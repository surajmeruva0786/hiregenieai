@echo off
echo ========================================
echo HireGenie AI Backend - Setup Check
echo ========================================
echo.

echo Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Please install Node.js 18+
    pause
    exit /b 1
)
echo ✓ Node.js installed
echo.

echo Checking npm...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm not found!
    pause
    exit /b 1
)
echo ✓ npm installed
echo.

echo Checking PostgreSQL...
psql --version
if %errorlevel% neq 0 (
    echo WARNING: PostgreSQL not found or not in PATH
    echo Please install PostgreSQL 15+ from https://www.postgresql.org/download/
) else (
    echo ✓ PostgreSQL installed
)
echo.

echo Checking MongoDB...
mongod --version
if %errorlevel% neq 0 (
    echo WARNING: MongoDB not found or not in PATH
    echo Please install MongoDB 7+ from https://www.mongodb.com/try/download/community
) else (
    echo ✓ MongoDB installed
)
echo.

echo Checking Redis...
redis-cli --version
if %errorlevel% neq 0 (
    echo WARNING: Redis not found or not in PATH
    echo Please install Redis from https://redis.io/download or use Docker
) else (
    echo ✓ Redis installed
)
echo.

echo ========================================
echo Checking .env file...
if exist .env (
    echo ✓ .env file exists
) else (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Edit .env file with your API keys!
    echo.
    echo Required:
    echo   - GEMINI_API_KEY (get from https://makersuite.google.com/app/apikey)
    echo   - Database credentials
    echo.
)
echo.

echo ========================================
echo Setup Summary
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file with your API keys
echo 2. Start PostgreSQL, MongoDB, and Redis
echo 3. Run: npm run dev
echo.
echo For detailed instructions, see QUICK_START.md
echo.
pause
