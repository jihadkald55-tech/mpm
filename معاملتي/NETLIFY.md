# 🚀 رفع منصة معاملتي على Netlify - دليل سريع

## الخطوات السريعة

### 1️⃣ نشر Frontend على Netlify

#### الطريقة الأسرع (Drag & Drop):

```powershell
# 1. بناء المشروع
cd "C:\Users\dell\Desktop\معاملتي\frontend"
npm run build

# 2. اذهب إلى
https://app.netlify.com/drop

# 3. اسحب مجلد "dist" إلى الصفحة
```

✅ **خلال دقائق موقعك سيكون جاهزاً!**

#### الطريقة الأفضل (من GitHub):

```powershell
# 1. رفع على GitHub
cd "C:\Users\dell\Desktop\معاملتي"
git init
git add .
git commit -m "Initial commit"
# أنشئ repo على GitHub ثم:
git remote add origin https://github.com/YOUR_USERNAME/moamalaty.git
git push -u origin main

# 2. على Netlify:
# - Add new site → Import from Git
# - اختر GitHub → اختر repository
# - Deploy!
```

---

### 2️⃣ نشر Backend (اختر واحدة)

#### خيار 1: Railway (الأسهل) ⭐

```powershell
# تثبيت CLI
npm i -g @railway/cli

# نشر
cd backend
railway login
railway init
railway add postgresql
railway up
```

رابط API سيكون: `https://PROJECT-NAME.up.railway.app`

#### خيار 2: Render (مجاني)

1. اذهب إلى [render.com](https://render.com)
2. New → Web Service
3. اختر GitHub repo
4. إعدادات:
   - Build: `cd backend && npm install && npm run build`
   - Start: `cd backend && npm start`
5. أضف PostgreSQL Database
6. Deploy!

#### خيار 3: Heroku

```powershell
cd backend
heroku create moamalaty-api
heroku addons:create heroku-postgresql:mini
git push heroku main
```

---

### 3️⃣ ربط Frontend بـ Backend

بعد نشر Backend، احصل على رابط API (مثلاً: `https://moamalaty.railway.app`)

#### على Netlify:
1. Site settings → Environment variables
2. أضف:
   ```
   VITE_API_URL = https://moamalaty.railway.app/api
   ```
3. Redeploy

#### على Backend:
أضف متغير:
```
FRONTEND_URL = https://your-site.netlify.app
```

---

## ✅ Checklist

- [ ] Frontend منشور على Netlify
- [ ] Backend منشور (Railway/Render/Heroku)
- [ ] قاعدة البيانات منشأة ومربوطة
- [ ] تم تشغيل SQL scripts على قاعدة الإنتاج
- [ ] تم تحديث VITE_API_URL في Netlify
- [ ] تم تحديث FRONTEND_URL في Backend
- [ ] تم اختبار تسجيل الدخول
- [ ] تم إنشاء المستخدمين التجريبيين

---

## 🎯 روابط سريعة

- **Netlify**: https://app.netlify.com
- **Railway**: https://railway.app
- **Render**: https://render.com
- **Heroku**: https://heroku.com

---

## 🆘 مشاكل شائعة

**مشكلة**: خطأ 404 عند التنقل
**حل**: ملف `_redirects` موجود؟ تأكد من وجوده في `frontend/public/`

**مشكلة**: لا يتصل بـ Backend
**حل**: تأكد من `VITE_API_URL` صحيح وBackend يعمل

**مشكلة**: CORS error
**حل**: أضف دومين Netlify في `FRONTEND_URL` بالـ Backend

---

## 📚 للمزيد

راجع [DEPLOYMENT.md](DEPLOYMENT.md) للدليل الكامل المفصل

---

**🎉 موقعك سيكون جاهزاً خلال 15 دقيقة!**
