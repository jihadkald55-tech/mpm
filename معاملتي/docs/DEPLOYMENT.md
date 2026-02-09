# دليل النشر على Netlify

## 🚀 نشر Frontend على Netlify

### الطريقة 1: من خلال GitHub (موصى بها)

#### 1. رفع المشروع على GitHub

```powershell
cd "C:\Users\dell\Desktop\معاملتي"

# تهيئة Git
git init
git add .
git commit -m "Initial commit - Moamalaty Platform"

# إنشاء repository على GitHub ثم:
git remote add origin https://github.com/YOUR_USERNAME/moamalaty.git
git branch -M main
git push -u origin main
```

#### 2. ربط Netlify بـ GitHub

1. اذهب إلى [netlify.com](https://netlify.com)
2. سجل دخول أو أنشئ حساب
3. اضغط "Add new site" → "Import an existing project"
4. اختر GitHub وامنح الصلاحيات
5. اختر repository "moamalaty"

#### 3. إعدادات البناء

Netlify سيكتشف الإعدادات تلقائياً من `netlify.toml`:

```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

#### 4. متغيرات البيئة

في لوحة تحكم Netlify:
1. اذهب لـ Site settings → Environment variables
2. أضف المتغير التالي:

```
VITE_API_URL = https://your-backend-api.com/api
```

⚠️ **مهم**: استبدل `your-backend-api.com` برابط الـ Backend الخاص بك

#### 5. انشر الموقع

اضغط "Deploy site" وانتظر الانتهاء!

موقعك سيكون جاهزاً على: `https://your-site-name.netlify.app`

---

### الطريقة 2: Drag & Drop (سريعة للتجربة)

#### 1. بناء المشروع محلياً

```powershell
cd "C:\Users\dell\Desktop\معاملتي\frontend"

# بناء المشروع
npm run build
```

هذا سينشئ مجلد `dist/` يحتوي على الملفات الجاهزة

#### 2. رفع على Netlify

1. اذهب إلى [netlify.com/drop](https://app.netlify.com/drop)
2. اسحب مجلد `dist/` إلى الصفحة
3. انتظر الرفع

موقعك سيكون جاهزاً فوراً!

⚠️ **تنبيه**: ستحتاج لإضافة متغيرات البيئة يدوياً في Site settings

---

## 🖥️ نشر Backend

Backend لا يمكن نشره على Netlify (لأنه Node.js server)، استخدم واحدة من:

### خيارات مجانية:

#### 1. Railway (موصى به) ⭐

```powershell
# تثبيت Railway CLI
npm i -g @railway/cli

# تسجيل الدخول
railway login

# إنشاء مشروع جديد
cd backend
railway init

# ربط PostgreSQL
railway add postgresql

# نشر
railway up
```

📝 **متغيرات البيئة على Railway**:
- سيتم إنشاء `DATABASE_URL` تلقائياً
- أضف `JWT_SECRET`, `FRONTEND_URL`, إلخ يدوياً

#### 2. Render

1. اذهب إلى [render.com](https://render.com)
2. أنشئ "New Web Service"
3. اختر repository
4. إعدادات:
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Environment**: Node

5. أضف PostgreSQL من "New Database"
6. أضف متغيرات البيئة

#### 3. Heroku

```powershell
# تثبيت Heroku CLI
# ثم:
cd backend
heroku create moamalaty-api
heroku addons:create heroku-postgresql:mini
git push heroku main
```

#### 4. DigitalOcean App Platform

1. اذهب إلى DigitalOcean
2. أنشئ App من GitHub
3. اختر repository
4. إعدادات Backend + Database

---

## 🔗 ربط Frontend بـ Backend

بعد نشر Backend، احصل على رابط API (مثلاً: `https://moamalaty-api.railway.app`)

### حدّث متغيرات البيئة:

#### على Netlify:
1. Site settings → Environment variables
2. عدّل `VITE_API_URL`:
   ```
   VITE_API_URL = https://moamalaty-api.railway.app/api
   ```

#### على Backend (Railway/Render):
أضف/عدّل:
```
FRONTEND_URL = https://your-site.netlify.app
```

ثم أعد نشر الموقعين.

---

## ✅ خطوات ما بعد النشر

### 1. اختبار الموقع

- ✅ تسجيل الدخول
- ✅ إنشاء معاملة
- ✅ رفع ملفات
- ✅ الإشعارات

### 2. إعداد Domain مخصص (اختياري)

في Netlify:
1. Domain settings → Add domain
2. اتبع التعليمات لربط الدومين

### 3. تفعيل HTTPS

Netlify يوفر HTTPS تلقائياً مع Let's Encrypt ✅

### 4. مراقبة الأداء

استخدم:
- Netlify Analytics
- Google Analytics (أضفه في `index.html`)

---

## 🔧 نصائح مهمة

### للأداء الأفضل:

1. **تفعيل CDN**: Netlify يفعّله تلقائياً ✅

2. **ضغط الملفات**: 
   ```json
   // vite.config.ts
   build: {
     minify: 'terser',
   }
   ```

3. **تحليل الحزمة**:
   ```powershell
   npm run build -- --mode analyze
   ```

### للأمان:

1. ✅ غير `JWT_SECRET` في Production
2. ✅ فعّل CORS للدومين المحدد فقط
3. ✅ استخدم HTTPS دائماً
4. ✅ أضف Rate Limiting

### للمراقبة:

1. راقب الأخطاء مع [Sentry](https://sentry.io)
2. تتبع الأداء مع Netlify Analytics
3. راقب الـ Backend مع LogTail أو Datadog

---

## 📋 Checklist قبل النشر

- [ ] تم بناء المشروع بدون أخطاء
- [ ] تم اختبار جميع الميزات محلياً
- [ ] تم تحديث متغيرات البيئة
- [ ] تم تغيير JWT_SECRET
- [ ] تم إعداد قاعدة البيانات في الإنتاج
- [ ] تم تشغيل migrations على قاعدة الإنتاج
- [ ] تم تعديل CORS للدومين الصحيح
- [ ] تم اختبار الموقع على الإنتاج

---

## 🆘 حل المشاكل

### Frontend لا يتصل بـ Backend

✅ **تأكد من**:
- صحة `VITE_API_URL` في Netlify
- تفعيل CORS للدومين الصحيح في Backend
- Backend يعمل (اختبر `/health`)

### خطأ 404 عند التنقل

✅ **الحل**: ملف `_redirects` موجود في `frontend/public/`

### الموقع بطيء

✅ **الحل**: 
- فعّل Caching Headers (موجودة في netlify.toml)
- استخدم CDN (Netlify يفعّله تلقائياً)
- قلل حجم الصور

### خطأ في البناء

✅ **تحقق من**:
- Node version صحيح (18+)
- جميع dependencies مثبتة
- لا يوجد أخطاء TypeScript

---

## 🎉 تهانينا!

موقعك الآن على الإنترنت ومتاح للجميع! 🚀

**روابط مفيدة:**
- [Netlify Docs](https://docs.netlify.com)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)

---

**للدعم**: راجع [FAQ.md](FAQ.md) أو تواصل معنا
