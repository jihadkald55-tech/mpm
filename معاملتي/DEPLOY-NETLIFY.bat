@echo off
chcp 65001 >nul
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║        نشر منصة معاملتي على Netlify                      ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo [1/3] بناء Frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo ❌ فشل البناء!
    pause
    exit /b 1
)
echo ✅ تم البناء بنجاح!
echo.

echo [2/3] المجلد الجاهز للنشر:
echo 📁 %cd%\dist\
echo.

echo [3/3] خطوات النشر:
echo.
echo الطريقة 1 - Drag and Drop (الأسرع):
echo ════════════════════════════════════════════════
echo 1. افتح: https://app.netlify.com/drop
echo 2. اسحب مجلد "dist" الموجود في:
echo    %cd%\dist\
echo 3. انتظر الرفع!
echo.
echo الطريقة 2 - من GitHub (الأفضل):
echo ════════════════════════════════════════════════
echo 1. ارفع المشروع على GitHub
echo 2. اذهب لـ Netlify → Add new site → Import from Git
echo 3. اختر repository
echo 4. Deploy!
echo.
echo ⚠️  مهم جداً:
echo ════════════════════════════════════════════════
echo بعد النشر، أضف متغير البيئة التالي في Netlify:
echo.
echo    VITE_API_URL = رابط_الـBackend_الخاص_بك
echo.
echo مثال: VITE_API_URL = https://moamalaty-api.railway.app/api
echo.
echo 📚 للمزيد من التفاصيل:
echo    - راجع NETLIFY.md
echo    - راجع docs\DEPLOYMENT.md
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║  ✅ المشروع جاهز للنشر!                                  ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

cd ..
pause
