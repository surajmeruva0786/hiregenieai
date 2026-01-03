# 🚀 LocalStorage Setup Guide - HireGenie AI

## Quick Start (No Database Required!)

This version of HireGenie uses **localStorage** for all data persistence. No database installation needed!

### Prerequisites
- Node.js (v16 or higher)
- npm

### Setup Steps

#### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
```

#### 2. Configure Backend

The backend is already configured to run without databases. No `.env` setup required!

#### 3. Start the Applications

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Backend runs on **http://localhost:5000**

**Terminal 2 - Frontend:**
```bash
npm run dev
```
✅ Frontend runs on **http://localhost:5173**

### That's It! 🎉

Open your browser to **http://localhost:5173** and start using the app!

---

## How It Works

### Data Storage
- All data is stored in your browser's **localStorage**
- Data persists across page refreshes
- Each browser has its own independent data

### Sample Data
The app comes with 2 sample job postings to get you started.

### User Accounts
Create accounts by signing up:
- **Recruiter Account**: For posting jobs and managing candidates
- **Student Account**: For browsing jobs and applying

---

## Features Available

### ✅ Working Features
- User registration and login
- Job posting (recruiters)
- Job browsing (students)
- Candidate management
- Application tracking
- Interview scheduling
- All data persists in localStorage

### ⚠️ Not Available (LocalStorage Mode)
- Email notifications
- Payment processing
- AI features (requires Gemini API key)
- Multi-user collaboration (each browser is independent)

---

## Data Management

### View Your Data
Open browser DevTools (F12) → Application → Local Storage → `hiregenie_data`

### Clear All Data
```javascript
localStorage.removeItem('hiregenie_data');
```
Then refresh the page to reinitialize with sample data.

### Export Data
```javascript
console.log(localStorage.getItem('hiregenie_data'));
```
Copy the output to save your data.

---

## Troubleshooting

### Backend Won't Start
```bash
cd backend
npm install
npm run dev
```

### Frontend Won't Start
```bash
npm install
npm run dev
```

### Data Not Persisting
- Check if localStorage is enabled in your browser
- Try a different browser
- Clear browser cache and try again

### Can't Login
- Make sure you registered an account first
- Check that email and password match exactly
- Try creating a new account

---

## Migration to Production

When you're ready to deploy with real databases:

1. Set up PostgreSQL (or use Supabase)
2. Set up MongoDB (or use MongoDB Atlas)
3. Update backend `.env` with database credentials
4. Uncomment database connections in `backend/src/index.ts`
5. The frontend localStorage service can be replaced with API calls

---

## Need Help?

- Check the browser console for errors (F12)
- Verify both backend and frontend are running
- Make sure you're using the correct ports (5000 and 5173)

---

**Enjoy building with HireGenie AI!** 🚀
