# 🚀 HireGenie AI Backend - Quick Start & Testing Guide

## ⚡ Quick Start (Fastest Way)

### Prerequisites
- Node.js 18+ installed
- PostgreSQL installed and running
- MongoDB installed and running
- Redis installed and running

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Setup Environment
```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` file with your settings:
```env
# Server
NODE_ENV=development
PORT=5000

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=hiregenie
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# MongoDB
MONGODB_URI=mongodb://localhost:27017/hiregenie

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Secrets (generate random strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# Gemini AI (Get from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# SendGrid (Get from https://sendgrid.com)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Stripe (Get from https://stripe.com)
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# File Upload
MAX_FILE_SIZE=10485760
```

### Step 3: Setup PostgreSQL Database
```bash
# Create database
createdb hiregenie

# Run schema
psql -d hiregenie -f src/database/postgres/schema.sql
```

**OR using psql directly:**
```bash
psql -U postgres
CREATE DATABASE hiregenie;
\c hiregenie
\i src/database/postgres/schema.sql
\q
```

### Step 4: Start Development Server
```bash
npm run dev
```

You should see:
```
Server running on port 5000
PostgreSQL connected
MongoDB connected
Redis connected
```

---

## ✅ Testing the Backend

### Test 1: Health Check
```bash
curl http://localhost:5000/health
```

**Expected Response:**
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

### Test 2: Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "TestPass123!",
    "firstName": "Admin",
    "lastName": "User",
    "organizationName": "Test Company"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "admin@test.com",
      "firstName": "Admin",
      "lastName": "User"
    },
    "organization": {
      "id": "...",
      "name": "Test Company"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Save the accessToken for next tests!**

### Test 3: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "TestPass123!"
  }'
```

### Test 4: Get Current User
```bash
# Replace YOUR_TOKEN with the accessToken from registration
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 5: Create a Job
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Software Engineer",
    "description": "We are looking for an experienced software engineer...",
    "department": "Engineering",
    "location": "San Francisco, CA",
    "employmentType": "full-time",
    "experienceMin": 5,
    "experienceMax": 10,
    "salaryMin": 120000,
    "salaryMax": 180000,
    "salaryCurrency": "USD",
    "requiredSkills": [
      {"name": "JavaScript", "weight": 0.3},
      {"name": "React", "weight": 0.25},
      {"name": "Node.js", "weight": 0.2}
    ],
    "cutoffScore": 70
  }'
```

### Test 6: Get All Jobs
```bash
curl http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🧪 Complete Testing Workflow

### 1. Start Backend
```bash
npm run dev
```

### 2. Start Workers (in separate terminals)

**Terminal 2 - Resume Worker:**
```bash
cd backend
node -r ts-node/register src/workers/resume.worker.ts
```

**Terminal 3 - Notification Worker:**
```bash
cd backend
node -r ts-node/register src/workers/notification.worker.ts
```

### 3. Test Resume Upload

First, create a test resume file (`test-resume.pdf`) or use any PDF resume.

```bash
curl -X POST http://localhost:5000/api/resumes/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@test-resume.pdf" \
  -F "jobId=YOUR_JOB_ID"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "resumeId": "...",
    "status": "pending",
    "message": "Resume uploaded successfully and queued for processing"
  }
}
```

### 4. Check Resume Processing Status
```bash
curl http://localhost:5000/api/resumes/RESUME_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Statuses:**
- `pending` - Queued for processing
- `processing` - Currently being processed
- `completed` - Successfully processed
- `failed` - Processing failed

### 5. Get Candidates
```bash
curl http://localhost:5000/api/candidates \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. Match Candidates to Job
```bash
curl -X POST http://localhost:5000/api/matching/jobs/YOUR_JOB_ID/match \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "candidateId": "...",
      "totalScore": 85,
      "matchPercentage": 85,
      "breakdown": {
        "skillsScore": 90,
        "experienceScore": 85,
        "educationScore": 80,
        "vectorSimilarity": 75
      },
      "explanation": "Skills Match: 90% - Matched 3 of 3 required skills..."
    }
  ]
}
```

---

## 🐛 Troubleshooting

### Issue 1: "Cannot connect to PostgreSQL"

**Check if PostgreSQL is running:**
```bash
# Windows
pg_ctl status

# Linux/Mac
sudo systemctl status postgresql
```

**Start PostgreSQL:**
```bash
# Windows
pg_ctl start

# Linux/Mac
sudo systemctl start postgresql
```

**Verify connection:**
```bash
psql -U postgres -d hiregenie
```

### Issue 2: "Cannot connect to MongoDB"

**Check if MongoDB is running:**
```bash
# Windows
mongod --version

# Linux/Mac
sudo systemctl status mongod
```

**Start MongoDB:**
```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

**Verify connection:**
```bash
mongosh
```

### Issue 3: "Cannot connect to Redis"

**Check if Redis is running:**
```bash
redis-cli ping
```

**Expected:** `PONG`

**Start Redis:**
```bash
# Windows
redis-server

# Linux/Mac
sudo systemctl start redis
```

### Issue 4: "Module not found"

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 5: "Port 5000 already in use"

**Find and kill the process:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

**Or change port in .env:**
```env
PORT=3000
```

### Issue 6: TypeScript errors

```bash
# Rebuild
npm run build
```

---

## 📝 Testing Checklist

Use this checklist to verify everything works:

- [ ] Backend starts without errors
- [ ] Health check returns "healthy"
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can get current user
- [ ] Can create a job
- [ ] Can list jobs
- [ ] Can upload resume
- [ ] Resume worker processes file
- [ ] Candidate profile created
- [ ] Can match candidates to job
- [ ] Match scores are returned
- [ ] Can view candidates
- [ ] Can start AI interview
- [ ] Can submit answers
- [ ] Can view analytics

---

## 🔍 Monitoring Logs

### View Application Logs
```bash
# Development
# Logs appear in console

# Check log files
cat logs/error.log
cat logs/combined.log
```

### View Worker Logs
```bash
# Resume worker logs
# Check console output

# Notification worker logs
# Check console output
```

### View Database Logs

**PostgreSQL:**
```bash
# Find log location
psql -U postgres -c "SHOW log_directory;"
psql -U postgres -c "SHOW log_filename;"
```

**MongoDB:**
```bash
# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

**Redis:**
```bash
# Redis logs
redis-cli
CONFIG GET logfile
```

---

## 🎯 API Testing Tools

### Option 1: cURL (Command Line)
Already shown above - best for quick tests

### Option 2: Postman
1. Download Postman
2. Import collection (create from examples above)
3. Set environment variable for `accessToken`
4. Test all endpoints

### Option 3: Thunder Client (VS Code Extension)
1. Install Thunder Client extension
2. Create requests
3. Test directly in VS Code

### Option 4: REST Client (VS Code Extension)
Create `test.http` file:
```http
### Health Check
GET http://localhost:5000/health

### Register
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPass123!",
  "firstName": "Test",
  "lastName": "User",
  "organizationName": "Test Org"
}

### Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "TestPass123!"
}
```

---

## 🚀 Production Testing

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
NODE_ENV=production node dist/index.js
```

### Load Testing
```bash
# Install k6
# https://k6.io/docs/getting-started/installation/

# Create load test
cat > load-test.js << 'EOF'
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  let res = http.get('http://localhost:5000/health');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
EOF

# Run load test
k6 run load-test.js
```

---

## ✅ Success Indicators

Your backend is working correctly if:

1. ✅ Server starts without errors
2. ✅ All database connections successful
3. ✅ Health check returns 200 OK
4. ✅ Can register and login users
5. ✅ JWT tokens are generated
6. ✅ Can create and retrieve jobs
7. ✅ Resume upload queues jobs
8. ✅ Workers process jobs
9. ✅ Candidates are created
10. ✅ Matching returns scores
11. ✅ No errors in logs

---

## 🎉 Next Steps

Once everything is working:

1. **Connect Frontend**
   - Update frontend API URL
   - Test login flow
   - Test job creation
   - Test resume upload

2. **Add More Test Data**
   - Create multiple jobs
   - Upload multiple resumes
   - Test matching
   - Test interviews

3. **Deploy to Production**
   - Follow DEPLOYMENT.md
   - Use Docker Compose
   - Set up monitoring

4. **Monitor Performance**
   - Check response times
   - Monitor database queries
   - Track worker performance

---

**Happy Testing! 🚀**
