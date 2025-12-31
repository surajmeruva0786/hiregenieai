# HireGenie AI - Backend API

Complete backend system for HireGenie AI recruitment platform with AI-powered interviews, candidate matching, and workflow automation.

## 🚀 Features

### ✅ Implemented (Phase 1)
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Organization Management**: Multi-tenant architecture with data isolation
- **Job Management**: Complete CRUD operations for job postings
- **Database Setup**: PostgreSQL + MongoDB + Redis configuration
- **Error Handling**: Comprehensive error handling and logging
- **API Structure**: RESTful API with proper routing

### 🚧 Coming Soon (Phases 2-6)
- Resume upload & processing pipeline
- AI-powered candidate matching
- Automated interview system
- Answer evaluation engine
- Bias detection & fairness
- Workflow automation
- Notification system
- Analytics & insights
- Billing & usage tracking

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- MongoDB 6+
- Redis 7+
- (Optional) Docker & Docker Compose

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and configure:
- Database credentials (PostgreSQL, MongoDB, Redis)
- JWT secrets
- AI API keys (Gemini, OpenAI)
- File storage (AWS S3)
- Email service (SendGrid)
- Payment (Stripe)

### 3. Set Up Databases

#### PostgreSQL

```bash
# Create database
createdb hiregenie

# Run schema
psql -d hiregenie -f src/database/postgres/schema.sql
```

#### MongoDB

MongoDB will auto-create collections on first use.

#### Redis

Redis requires no setup, just ensure it's running.

### 4. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

## 🐳 Docker Setup (Alternative)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📚 API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "organizationName": "Acme Corp"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "SecurePass123!"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

### Jobs

#### Create Job
```http
POST /api/jobs
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Senior Software Engineer",
  "description": "We are looking for...",
  "department": "Engineering",
  "location": "San Francisco, CA",
  "employmentType": "full-time",
  "experienceMin": 5,
  "experienceMax": 10,
  "salaryMin": 120000,
  "salaryMax": 180000,
  "requiredSkills": [
    {"name": "JavaScript", "weight": 0.3},
    {"name": "React", "weight": 0.25},
    {"name": "Node.js", "weight": 0.25},
    {"name": "PostgreSQL", "weight": 0.2}
  ],
  "preferredSkills": ["TypeScript", "AWS", "Docker"],
  "interviewRounds": [
    {"type": "screening", "duration": 30},
    {"type": "technical", "duration": 60},
    {"type": "behavioral", "duration": 45}
  ],
  "cutoffScore": 70
}
```

#### List Jobs
```http
GET /api/jobs?status=published&page=1&limit=10
Authorization: Bearer <access_token>
```

#### Get Job Details
```http
GET /api/jobs/:id
Authorization: Bearer <access_token>
```

#### Update Job
```http
PUT /api/jobs/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "published"
}
```

#### Publish Job
```http
POST /api/jobs/:id/publish
Authorization: Bearer <access_token>
```

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── index.ts                 # Application entry point
│   ├── config/                  # Database configurations
│   │   ├── postgres.ts
│   │   ├── mongodb.ts
│   │   └── redis.ts
│   ├── database/
│   │   └── postgres/
│   │       └── schema.sql       # PostgreSQL schema
│   ├── models/
│   │   └── mongodb/             # Mongoose models
│   │       ├── Candidate.ts
│   │       ├── Interview.ts
│   │       └── Resume.ts
│   ├── controllers/             # Route controllers
│   │   ├── auth.controller.ts
│   │   └── job.controller.ts
│   ├── routes/                  # API routes
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   └── job.routes.ts
│   ├── middleware/              # Express middleware
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── auth/                    # Authentication services
│   │   └── jwt.service.ts
│   ├── utils/                   # Utility functions
│   │   └── logger.ts
│   ├── services/                # Business logic (coming soon)
│   ├── queues/                  # BullMQ queues (coming soon)
│   └── workers/                 # Background workers (coming soon)
├── tests/                       # Test files
├── logs/                        # Application logs
├── package.json
├── tsconfig.json
└── .env.example
```

## 🔐 Authentication & Authorization

### Roles
- **admin**: Full access to organization
- **recruiter**: Manage jobs, candidates, interviews
- **interviewer**: Conduct interviews, evaluate candidates
- **student**: Apply to jobs, take interviews

### JWT Tokens
- **Access Token**: Short-lived (1 hour), used for API requests
- **Refresh Token**: Long-lived (7 days), used to get new access tokens

### Organization Isolation
All data is isolated by `organization_id`. Users can only access data from their organization.

## 📊 Database Schema

### PostgreSQL Tables
- `organizations` - Company/organization data
- `users` - User accounts with roles
- `jobs` - Job postings
- `pipeline_stages` - Candidate pipeline tracking
- `subscriptions` - Billing subscriptions
- `usage_tracking` - Usage metrics
- `audit_logs` - Audit trail
- `workflows` - Automation workflows
- `notifications` - Notification queue

### MongoDB Collections
- `candidates` - Candidate profiles with parsed resume data
- `interviews` - Interview sessions with Q&A
- `resumes` - Raw resume files and parsed content

## 🧪 Testing

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Generate coverage report
npm run test:coverage
```

## 📝 Logging

Logs are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

Log levels: `error`, `warn`, `info`, `debug`

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables for Production

Ensure these are set:
- `NODE_ENV=production`
- Strong `JWT_SECRET` and `JWT_REFRESH_SECRET`
- Production database credentials
- API keys for external services

## 🔄 Next Implementation Phases

### Phase 2: Resume Processing (Week 2)
- File upload with Multer
- BullMQ queue setup
- PDF/DOC parsing
- Skill extraction with AI
- Vector embeddings

### Phase 3: AI Matching (Week 3)
- Candidate-job matching algorithm
- Score calculation and explanation
- Vector similarity search

### Phase 4: AI Interviews (Week 4-5)
- Interview session management
- Question generation
- Answer evaluation
- Adaptive difficulty

### Phase 5: Automation (Week 6)
- Workflow engine
- Notification system
- Analytics dashboard

### Phase 6: Billing & Ops (Week 7-8)
- Stripe integration
- Usage tracking
- Monitoring & observability

## 🤝 Contributing

This is a proprietary project. For questions, contact the development team.

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

For issues or questions:
1. Check the logs in `logs/` directory
2. Verify environment variables in `.env`
3. Ensure all databases are running
4. Check API documentation above

## 🎯 Quick Start Checklist

- [ ] Install Node.js 18+
- [ ] Install PostgreSQL, MongoDB, Redis
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Configure environment variables
- [ ] Create PostgreSQL database
- [ ] Run database schema
- [ ] Start development server
- [ ] Test authentication endpoints
- [ ] Create first organization and user
- [ ] Test job creation

---

**Built with ❤️ for HireGenie AI**
