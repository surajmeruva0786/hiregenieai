# HireGenie AI Backend - Deployment Guide

## 🚀 Deployment Options

### Option 1: Docker Compose (Recommended for Quick Start)

#### Prerequisites
- Docker & Docker Compose installed
- Domain name (optional, for production)
- SSL certificate (optional, for HTTPS)

#### Steps

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/hiregenieai.git
cd hiregenieai/backend
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your API keys
nano .env
```

Required environment variables:
- `GEMINI_API_KEY` - Get from Google AI Studio
- `SENDGRID_API_KEY` - Get from SendGrid
- `SENDGRID_FROM_EMAIL` - Your verified sender email
- `STRIPE_SECRET_KEY` - Get from Stripe Dashboard
- `STRIPE_WEBHOOK_SECRET` - Get from Stripe Webhooks

3. **Start Services**
```bash
docker-compose up -d
```

4. **Check Status**
```bash
docker-compose ps
docker-compose logs -f backend
```

5. **Access Application**
- API: http://localhost:5000
- Health Check: http://localhost:5000/health

---

### Option 2: Manual Deployment (Production)

#### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- MongoDB 7+
- Redis 7+
- PM2 (process manager)

#### Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Build Application**
```bash
npm run build
```

3. **Setup Databases**
```bash
# PostgreSQL
createdb hiregenie
psql -d hiregenie -f src/database/postgres/schema.sql

# MongoDB - auto-creates on first connection
# Redis - ensure it's running
```

4. **Start with PM2**
```bash
# Install PM2
npm install -g pm2

# Start backend
pm2 start dist/index.js --name hiregenie-backend

# Start workers
pm2 start dist/workers/resume.worker.js --name resume-worker
pm2 start dist/workers/notification.worker.js --name notification-worker

# Save PM2 configuration
pm2 save
pm2 startup
```

5. **Setup Nginx Reverse Proxy**
```nginx
server {
    listen 80;
    server_name api.hiregenie.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

6. **Setup SSL with Let's Encrypt**
```bash
sudo certbot --nginx -d api.hiregenie.com
```

---

### Option 3: Cloud Deployment

#### AWS Deployment

**Using ECS (Elastic Container Service)**

1. **Build and Push Docker Image**
```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_URL

# Build image
docker build -t hiregenie-backend .

# Tag image
docker tag hiregenie-backend:latest YOUR_ECR_URL/hiregenie-backend:latest

# Push image
docker push YOUR_ECR_URL/hiregenie-backend:latest
```

2. **Create ECS Task Definition**
- Use the docker-compose.yml as reference
- Configure environment variables in ECS
- Set up RDS for PostgreSQL
- Set up DocumentDB for MongoDB
- Set up ElastiCache for Redis

3. **Create ECS Service**
- Configure load balancer
- Set up auto-scaling
- Configure health checks

**Using EC2**
- Follow Manual Deployment steps
- Use Elastic Beanstalk for easier management

#### Google Cloud Platform

**Using Cloud Run**

1. **Build and Deploy**
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/hiregenie-backend
gcloud run deploy hiregenie-backend \
  --image gcr.io/PROJECT_ID/hiregenie-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

2. **Setup Databases**
- Cloud SQL for PostgreSQL
- MongoDB Atlas
- Cloud Memorystore for Redis

#### Heroku

1. **Create Heroku App**
```bash
heroku create hiregenie-backend
```

2. **Add Buildpacks**
```bash
heroku buildpacks:set heroku/nodejs
```

3. **Add Add-ons**
```bash
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create mongohq:sandbox
heroku addons:create heroku-redis:hobby-dev
```

4. **Deploy**
```bash
git push heroku main
```

#### DigitalOcean

**Using App Platform**

1. Create app from GitHub repository
2. Configure build settings:
   - Build Command: `npm run build`
   - Run Command: `node dist/index.js`
3. Add managed databases (PostgreSQL, MongoDB, Redis)
4. Configure environment variables
5. Deploy

---

## 🔒 Security Checklist

### Before Production

- [ ] Change all default passwords
- [ ] Generate strong JWT secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable Helmet security headers
- [ ] Configure CSP (Content Security Policy)
- [ ] Set up firewall rules
- [ ] Enable database encryption
- [ ] Configure backup strategy
- [ ] Set up monitoring and alerts
- [ ] Review and limit API keys permissions
- [ ] Enable audit logging
- [ ] Configure session timeouts
- [ ] Set up DDoS protection

### Environment Variables

**Never commit these to Git:**
```bash
# Generate strong secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Use secrets management:
- AWS Secrets Manager
- Google Secret Manager
- Azure Key Vault
- HashiCorp Vault
- Doppler

---

## 📊 Monitoring & Logging

### Application Monitoring

**PM2 Monitoring**
```bash
pm2 monit
pm2 logs
pm2 status
```

**Docker Monitoring**
```bash
docker-compose logs -f
docker stats
```

### External Monitoring Services

1. **Sentry** - Error tracking
```bash
npm install @sentry/node
```

2. **New Relic** - APM
```bash
npm install newrelic
```

3. **DataDog** - Full-stack monitoring
```bash
npm install dd-trace
```

### Log Aggregation

- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Grafana Loki**
- **CloudWatch Logs** (AWS)
- **Google Cloud Logging**

---

## 🔄 Database Backups

### PostgreSQL Backup

**Automated Daily Backup**
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U postgres hiregenie > /backups/hiregenie_$DATE.sql
# Keep only last 7 days
find /backups -name "hiregenie_*.sql" -mtime +7 -delete
```

**Cron Job**
```bash
0 2 * * * /path/to/backup.sh
```

### MongoDB Backup

```bash
mongodump --uri="mongodb://admin:admin123@localhost:27017/hiregenie?authSource=admin" --out=/backups/mongodb_$(date +%Y%m%d)
```

### Restore

**PostgreSQL**
```bash
psql -U postgres hiregenie < backup.sql
```

**MongoDB**
```bash
mongorestore --uri="mongodb://admin:admin123@localhost:27017" /backups/mongodb_20231231
```

---

## 🚦 Health Checks

### Endpoint
```
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-31T10:00:00Z",
  "services": {
    "postgres": "connected",
    "mongodb": "connected",
    "redis": "connected"
  }
}
```

### Monitoring Script
```bash
#!/bin/bash
HEALTH_URL="http://localhost:5000/health"
if curl -f $HEALTH_URL > /dev/null 2>&1; then
    echo "Service is healthy"
else
    echo "Service is down! Restarting..."
    pm2 restart hiregenie-backend
fi
```

---

## 📈 Scaling

### Horizontal Scaling

**Load Balancer Configuration (Nginx)**
```nginx
upstream backend {
    least_conn;
    server backend1:5000;
    server backend2:5000;
    server backend3:5000;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

### Vertical Scaling

**Increase Resources**
- CPU: 2+ cores recommended
- RAM: 4GB+ recommended
- Storage: SSD with 50GB+ for logs and uploads

### Database Scaling

**PostgreSQL**
- Read replicas for analytics
- Connection pooling (PgBouncer)
- Partitioning for large tables

**MongoDB**
- Sharding for large datasets
- Read preference for analytics

**Redis**
- Redis Cluster for high availability
- Separate instances for cache vs queues

---

## 🔧 Troubleshooting

### Common Issues

**1. Database Connection Failed**
```bash
# Check if database is running
docker-compose ps
# Check logs
docker-compose logs postgres
# Verify connection string
echo $POSTGRES_HOST
```

**2. Worker Not Processing Jobs**
```bash
# Check Redis connection
redis-cli ping
# Check worker logs
pm2 logs resume-worker
# Restart worker
pm2 restart resume-worker
```

**3. High Memory Usage**
```bash
# Check memory usage
pm2 monit
# Restart with memory limit
pm2 start dist/index.js --max-memory-restart 1G
```

**4. Slow API Responses**
```bash
# Check database query performance
# Add indexes if needed
# Enable query logging
# Use Redis caching
```

---

## 📞 Support

For deployment issues:
- Check logs: `pm2 logs` or `docker-compose logs`
- Review environment variables
- Verify database connections
- Check firewall rules
- Ensure all services are running

---

## 🎯 Production Checklist

- [ ] All environment variables configured
- [ ] Databases backed up
- [ ] SSL/HTTPS enabled
- [ ] Monitoring set up
- [ ] Error tracking configured
- [ ] Rate limiting enabled
- [ ] CORS configured
- [ ] Firewall rules set
- [ ] Load balancer configured (if needed)
- [ ] Auto-scaling configured (if needed)
- [ ] Backup strategy in place
- [ ] Disaster recovery plan documented
- [ ] Team trained on deployment process

---

**Deployment Status: READY FOR PRODUCTION** ✅
