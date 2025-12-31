# 🚀 Supabase + MongoDB Atlas Setup Guide

## Step-by-Step Instructions

### Part 1: Supabase Setup (PostgreSQL) - 3 minutes

#### 1. Create Supabase Account
1. Open browser and go to: **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with GitHub or Email
4. Verify your email if needed

#### 2. Create New Project
1. Click **"New Project"**
2. Fill in:
   - **Name:** HireGenie
   - **Database Password:** Create a strong password (SAVE THIS!)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free
3. Click **"Create new project"**
4. Wait 2-3 minutes for setup to complete

#### 3. Get Database Connection Details
1. Click **"Settings"** (gear icon in sidebar)
2. Click **"Database"**
3. Scroll to **"Connection string"**
4. Click **"URI"** tab
5. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
6. **SAVE THIS!** You'll need it for .env

#### 4. Run Database Schema
1. In Supabase, click **"SQL Editor"** in sidebar
2. Click **"New query"**
3. Open your local file: `backend/src/database/postgres/schema.sql`
4. Copy ALL the content
5. Paste into Supabase SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

✅ **Supabase Setup Complete!**

---

### Part 2: MongoDB Atlas Setup - 3 minutes

#### 1. Create MongoDB Atlas Account
1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with Google or Email
3. Verify your email

#### 2. Create Free Cluster
1. Choose **"M0 FREE"** tier
2. Provider: **AWS** (or any)
3. Region: Choose closest to you
4. Cluster Name: **HireGenie**
5. Click **"Create"**
6. Wait 1-3 minutes for cluster creation

#### 3. Create Database User
1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `hiregenie`
5. Password: Click **"Autogenerate Secure Password"** (SAVE THIS!)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

#### 4. Allow Network Access
1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

#### 5. Get Connection String
1. Click **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**
5. Version: **5.5 or later**
6. Copy the connection string (looks like):
   ```
   mongodb+srv://hiregenie:<password>@hiregenie.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. **Replace `<password>`** with the password you saved earlier
8. **Add database name** at the end: `/hiregenie`
   
   Final string should look like:
   ```
   mongodb+srv://hiregenie:YOUR_PASSWORD@hiregenie.xxxxx.mongodb.net/hiregenie?retryWrites=true&w=majority
   ```

✅ **MongoDB Atlas Setup Complete!**

---

### Part 3: Get Gemini API Key - 2 minutes

#### 1. Get Free Gemini API Key
1. Go to: **https://makersuite.google.com/app/apikey**
2. Sign in with Google account
3. Click **"Create API Key"**
4. Click **"Create API key in new project"**
5. Copy the API key (starts with `AIza...`)
6. **SAVE THIS!**

✅ **Gemini API Key Obtained!**

---

### Part 4: Configure Backend - 1 minute

#### 1. Create .env File
```bash
cd backend
copy .env.example .env
notepad .env
```

#### 2. Update .env with Your Credentials

Replace these values with what you saved:

```env
# Node Server
NODE_ENV=development
PORT=5000

# Supabase PostgreSQL
POSTGRES_HOST=db.xxx.supabase.co
POSTGRES_PORT=5432
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_supabase_password_here

# MongoDB Atlas
MONGODB_URI=mongodb+srv://hiregenie:your_password@hiregenie.xxxxx.mongodb.net/hiregenie?retryWrites=true&w=majority

# Redis (Skip for now - comment out or leave empty)
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=

# JWT Secrets (Generate random strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters-long

# Gemini AI
GEMINI_API_KEY=AIza_your_gemini_api_key_here

# Optional (can skip for testing)
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# File Upload
MAX_FILE_SIZE=10485760
```

#### 3. Generate JWT Secrets

Run this command to generate secure secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it for JWT_SECRET.
Run again for JWT_REFRESH_SECRET.

---

### Part 5: Start Backend - 30 seconds

```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
PostgreSQL connected ✓
MongoDB connected ✓
Redis connection skipped (optional)
```

---

### Part 6: Test It Works

#### Test 1: Health Check
Open browser: **http://localhost:5000/health**

Expected:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-31T10:00:00Z",
  "services": {
    "postgres": "connected",
    "mongodb": "connected",
    "redis": "skipped"
  }
}
```

#### Test 2: Register User
Open PowerShell:
```bash
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@test.com\",\"password\":\"TestPass123!\",\"firstName\":\"Admin\",\"lastName\":\"User\",\"organizationName\":\"Test Company\"}'
```

Expected: JSON response with user data and tokens

---

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] Database schema loaded in Supabase
- [ ] MongoDB Atlas cluster created
- [ ] Database user created in Atlas
- [ ] Network access allowed
- [ ] Gemini API key obtained
- [ ] .env file configured
- [ ] Backend starts without errors
- [ ] Health check returns "healthy"
- [ ] Can register a user

---

## 🆘 Troubleshooting

### "Cannot connect to PostgreSQL"
- Check Supabase password is correct in .env
- Verify host is `db.xxx.supabase.co` (not localhost)
- Check Supabase project is running (green status)

### "Cannot connect to MongoDB"
- Check password in connection string
- Verify IP is whitelisted (0.0.0.0/0)
- Check database name is at end of URI: `/hiregenie`

### "Invalid Gemini API key"
- Verify key starts with `AIza`
- Check for extra spaces in .env
- Try generating new key

### Backend won't start
- Run: `npm install`
- Check .env file exists
- Verify all required fields are filled

---

## 📞 Need Help?

If you get stuck:
1. Check the error message
2. Verify credentials in .env
3. Check Supabase/Atlas dashboards
4. Try restarting backend

---

**Ready to start? Follow the steps above!** 🚀
