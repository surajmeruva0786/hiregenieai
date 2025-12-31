# 🚀 EASIEST Setup - SQLite + In-Memory MongoDB

## Problem
You don't want to install PostgreSQL, MongoDB, or use Docker.

## ✅ Solution: Simplified Development Setup

I'll modify the backend to use:
- **SQLite** instead of PostgreSQL (no installation needed!)
- **In-memory MongoDB** for testing (no installation needed!)
- **Skip Redis** for now (optional)

### Step 1: Install SQLite Dependencies

```bash
cd backend
npm install better-sqlite3 @types/better-sqlite3
```

### Step 2: Use This .env Configuration

```env
# Development Mode
NODE_ENV=development
PORT=5000

# SQLite (No installation needed!)
USE_SQLITE=true
SQLITE_DB_PATH=./hiregenie.db

# MongoDB (Will use in-memory for testing)
USE_MEMORY_MONGODB=true

# Skip Redis for now
SKIP_REDIS=true

# JWT Secrets
JWT_SECRET=dev-secret-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=dev-refresh-secret-key-change-in-production-min-32

# Gemini AI (Required - Get free key)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional services (can skip for testing)
SENDGRID_API_KEY=
STRIPE_SECRET_KEY=
```

### Step 3: Run Backend

```bash
npm run dev
```

That's it! No database installation needed!

---

## 🎯 What This Gives You

✅ **Works immediately** - No database setup  
✅ **SQLite file** - All data in one file  
✅ **In-memory MongoDB** - For testing  
✅ **Full API** - All endpoints work  
❌ **Not for production** - Use real databases later  

---

## 🔄 When You're Ready for Production

Later, you can easily switch to real databases by changing .env:

```env
USE_SQLITE=false
USE_MEMORY_MONGODB=false
POSTGRES_HOST=your_real_postgres
MONGODB_URI=your_real_mongodb
```

---

## 💡 Alternative: Use Only Cloud Databases

If you want a production-ready setup without local installation:

### Option 1: Supabase (PostgreSQL) - FREE
1. Go to https://supabase.com
2. Create account
3. Create project (takes 2 minutes)
4. Get connection string

### Option 2: MongoDB Atlas - FREE
1. Go to https://www.mongodb.com/cloud/atlas
2. Create account
3. Create M0 cluster (free tier)
4. Get connection string

**Total setup time: 5 minutes**  
**Cost: $0**  
**Production-ready: Yes**

---

## 🤔 Which Should You Choose?

### For Quick Testing (Right Now)
→ Use SQLite + In-memory MongoDB (I can set this up in 5 minutes)

### For Production/Real Use
→ Use Supabase + MongoDB Atlas (Free, 5-minute setup)

### If You Have Docker Desktop
→ Use Docker containers (as originally planned)

---

## ⚡ Want Me to Set Up SQLite Version?

I can modify the backend code to use SQLite + in-memory MongoDB so you can start testing **immediately** without any database installation.

Just say "yes" and I'll:
1. Add SQLite support
2. Add in-memory MongoDB support
3. Update configuration
4. You run `npm run dev` and it works!

**Would you like me to do this?**
