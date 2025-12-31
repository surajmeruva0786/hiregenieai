# 🔧 Database Setup Guide - Windows

## Issue: Docker Not Running

The error `The system cannot find the file specified` means Docker Desktop is not running.

## ✅ Solution Options

### Option 1: Start Docker Desktop (Recommended if installed)

1. **Open Docker Desktop application**
   - Search for "Docker Desktop" in Windows Start menu
   - Click to start it
   - Wait for it to say "Docker Desktop is running"

2. **Verify Docker is running:**
```bash
docker --version
docker ps
```

3. **Then run the database containers:**
```bash
docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15
docker run -d --name mongodb -p 27017:27017 mongo:7
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

---

### Option 2: Install Docker Desktop (If not installed)

1. **Download Docker Desktop:**
   - Visit: https://www.docker.com/products/docker-desktop/
   - Download for Windows
   - Install and restart computer if needed

2. **Start Docker Desktop and follow Option 1**

---

### Option 3: Install Databases Directly (No Docker)

If you don't want to use Docker, install each database separately:

#### A. Install PostgreSQL

1. **Download PostgreSQL 15:**
   - Visit: https://www.postgresql.org/download/windows/
   - Download the installer
   - Run installer (remember the password you set!)

2. **Verify installation:**
```bash
psql --version
```

3. **Create database:**
```bash
# Open Command Prompt as Administrator
psql -U postgres
# Enter your password when prompted
# Then run:
CREATE DATABASE hiregenie;
\q
```

4. **Load schema:**
```bash
cd e:\github_projects\hiregenieai\backend
psql -U postgres -d hiregenie -f src\database\postgres\schema.sql
```

#### B. Install MongoDB

1. **Download MongoDB 7:**
   - Visit: https://www.mongodb.com/try/download/community
   - Download Windows installer
   - Install with default settings

2. **Start MongoDB:**
```bash
# MongoDB should start automatically as a service
# Verify:
mongosh
# Type 'exit' to quit
```

#### C. Install Redis

**For Windows, Redis requires WSL or use alternative:**

**Option C1: Use Memurai (Redis alternative for Windows)**
1. Visit: https://www.memurai.com/
2. Download and install
3. Start Memurai service

**Option C2: Use WSL (Windows Subsystem for Linux)**
```bash
wsl --install
# Restart computer
# Then in WSL:
sudo apt-get update
sudo apt-get install redis-server
sudo service redis-server start
```

**Option C3: Skip Redis for now (Development only)**
- Comment out Redis code in `src/index.ts`
- Workers won't work, but basic API will

---

### Option 4: Use Cloud Databases (Easiest for Testing)

#### A. PostgreSQL - Use Supabase (Free)
1. Visit: https://supabase.com
2. Create free account
3. Create new project
4. Get connection string from Settings > Database
5. Update `.env`:
```env
POSTGRES_HOST=db.xxx.supabase.co
POSTGRES_PORT=5432
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_from_supabase
```

#### B. MongoDB - Use MongoDB Atlas (Free)
1. Visit: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster (M0)
4. Get connection string
5. Update `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hiregenie
```

#### C. Redis - Use Upstash (Free)
1. Visit: https://upstash.com
2. Create free account
3. Create Redis database
4. Get connection details
5. Update `.env`:
```env
REDIS_HOST=your-redis.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your_password
```

---

## 🚀 Recommended Quick Start

**For immediate testing, I recommend Option 4 (Cloud Databases):**

1. **PostgreSQL:** Supabase (5 minutes setup)
2. **MongoDB:** MongoDB Atlas (5 minutes setup)
3. **Redis:** Upstash (3 minutes setup)

**Total setup time: ~15 minutes, no local installation needed!**

---

## ✅ After Database Setup

1. **Update `.env` file with your database credentials**

2. **Test connection:**
```bash
cd e:\github_projects\hiregenieai\backend
npm run dev
```

3. **You should see:**
```
Server running on port 5000
PostgreSQL connected ✓
MongoDB connected ✓
Redis connected ✓
```

4. **Test API:**
Open browser: http://localhost:5000/health

---

## 🆘 Still Having Issues?

### Quick Debug:

**Check what's running:**
```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check if MongoDB is running
mongosh --eval "db.version()"

# Check if Redis is running
redis-cli ping
```

**Common Errors:**

1. **"Connection refused"**
   → Database not running, start the service

2. **"Authentication failed"**
   → Wrong password in .env file

3. **"Database does not exist"**
   → Run: `createdb hiregenie` (PostgreSQL)

---

## 💡 My Recommendation

**For fastest setup right now:**

1. Use **Supabase** for PostgreSQL (free, instant)
2. Use **MongoDB Atlas** for MongoDB (free, instant)
3. **Skip Redis** for now (comment out in code)

This gets you running in 10 minutes with zero local installation!

Then you can add Redis later when needed for workers.
