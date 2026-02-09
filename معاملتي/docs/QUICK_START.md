# دليل الإطلاق السريع - منصة معاملتي

## المتطلبات الأساسية

قبل البدء، تأكد من تثبيت المتطلبات التالية:

- Node.js 18 أو أحدث
- PostgreSQL 14 أو أحدث
- npm أو yarn

## خطوات التشغيل السريع

### 1. إعداد قاعدة البيانات

```powershell
# إنشاء قاعدة البيانات
createdb moamalaty_db

# تشغيل السكريبتات (من مجلد database)
psql -d moamalaty_db -f schema.sql
psql -d moamalaty_db -f seed.sql
```

### 2. إعداد Backend

```powershell
cd backend

# تثبيت المكتبات
npm install

# نسخ ملف البيئة
copy .env.example .env

# تحديث متغيرات البيئة في .env
# قم بتعديل DB_PASSWORD و JWT_SECRET

# إنشاء المستخدمين التجريبيين
npm run create-users

# تشغيل الخادم
npm run dev
```

الخادم سيعمل على: http://localhost:5000

### 3. إعداد Frontend

```powershell
# في نافذة PowerShell جديدة
cd frontend

# تثبيت المكتبات
npm install

# نسخ ملف البيئة
copy .env.example .env

# تشغيل التطبيق
npm run dev
```

التطبيق سيعمل على: http://localhost:5173

### 4. الوصول للتطبيق

افتح المتصفح وانتقل إلى: http://localhost:5173

## حسابات التجربة

### مواطن
- البريد: `citizen@test.com`
- كلمة المرور: `Test123!`

### موظف حكومي
- البريد: `employee@gov.iq`
- كلمة المرور: `Test123!`

### مستشار قانوني
- البريد: `lawyer@moamalaty.iq`
- كلمة المرور: `Test123!`

### مشرف
- البريد: `supervisor@gov.iq`
- كلمة المرور: `Test123!`

### مدير النظام
- البريد: `admin@moamalaty.iq`
- كلمة المرور: `Admin123!`

## حل المشاكل الشائعة

### خطأ في الاتصال بقاعدة البيانات

تأكد من:
- تشغيل PostgreSQL
- صحة معلومات الاتصال في `.env`
- وجود قاعدة البيانات `moamalaty_db`

### خطأ في تثبيت المكتبات

```powershell
# حذف node_modules وإعادة التثبيت
rm -r node_modules
npm install
```

### المنفذ محجوز

إذا كان المنفذ 5000 أو 5173 محجوزاً:
- للـ Backend: غير PORT في .env
- للـ Frontend: غير port في vite.config.ts

## البناء للإنتاج

### Backend

```powershell
cd backend
npm run build
npm start
```

### Frontend

```powershell
cd frontend
npm run build
# الملفات ستكون في مجلد dist/
```

## استكشاف الميزات

### للمواطن
1. تسجيل الدخول
2. إنشاء معاملة جديدة
3. متابعة حالة المعاملة
4. رفع المستندات
5. طلب استشارة قانونية

### للموظف الحكومي
1. عرض المعاملات الجديدة
2. مراجعة والموافقة/الرفض
3. إضافة ملاحظات
4. تحديث حالة المعاملة

### للمدير
1. عرض جميع الإحصائيات
2. إدارة المستخدمين
3. عرض التقارير
4. مراقبة النشاطات

## الدعم

للمساعدة أو الإبلاغ عن مشاكل:
- البريد: support@moamalaty.iq
- الوثائق الكاملة: راجع README.md
