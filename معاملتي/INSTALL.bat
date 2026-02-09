@echo off
echo ================================================================
echo              منصة معاملتي - تشغيل سريع
echo ================================================================
echo.

REM التحقق من Node.js
echo [1/4] التحقق من Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ خطأ: Node.js غير مثبت!
    echo يرجى تحميله من: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js موجود

REM التحقق من PostgreSQL
echo [2/4] التحقق من PostgreSQL...
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ خطأ: PostgreSQL غير مثبت!
    echo يرجى تحميله من: https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)
echo ✅ PostgreSQL موجود

REM إعداد قاعدة البيانات
echo [3/4] إعداد قاعدة البيانات...
echo إنشاء قاعدة البيانات moamalaty_db...
createdb moamalaty_db 2>nul
if %errorlevel% equ 0 (
    echo ✅ تم إنشاء قاعدة البيانات
) else (
    echo ℹ️  قاعدة البيانات موجودة مسبقاً
)

echo تشغيل السكريبتات...
cd database
psql -d moamalaty_db -f schema.sql >nul 2>nul
psql -d moamalaty_db -f seed.sql >nul 2>nul
cd ..
echo ✅ تم إعداد قاعدة البيانات

REM تثبيت المكتبات
echo [4/4] تثبيت المكتبات...
echo Backend...
cd backend
call npm install >nul 2>nul
echo ✅ Backend جاهز

echo Frontend...
cd ..\frontend
call npm install >nul 2>nul
echo ✅ Frontend جاهز

cd ..

echo.
echo ================================================================
echo ✅ الإعداد اكتمل بنجاح!
echo ================================================================
echo.
echo الآن قم بما يلي:
echo.
echo 1. افتح PowerShell جديد وشغل Backend:
echo    cd backend
echo    npm run create-users
echo    npm run dev
echo.
echo 2. افتح PowerShell آخر وشغل Frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 3. افتح المتصفح: http://localhost:5173
echo.
echo حسابات التجربة:
echo    مواطن: citizen@test.com / Test123!
echo    مدير: admin@moamalaty.iq / Admin123!
echo.
echo ================================================================
pause
