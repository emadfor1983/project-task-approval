# دليل النشر - نظام إدارة توقيع مهمات المشاريع

## نظرة عامة

هذا الدليل يشرح كيفية نشر التطبيق بشكل دائم على منصات الاستضافة المجانية.

---

## 📋 المتطلبات

- حساب GitHub (تم إنشاؤه بالفعل)
- حساب Render (للـ Backend)
- حساب Vercel (للـ Frontend) - اختياري

**Repository**: https://github.com/emadfor1983/project-task-approval

---

## 🚀 الخيار 1: النشر على Render (Backend + Frontend معاً)

### الخطوات:

#### 1. إنشاء حساب على Render
- اذهب إلى https://render.com
- انقر على **Sign Up**
- سجل باستخدام GitHub

#### 2. إنشاء Web Service جديد
- من Dashboard، انقر على **New +**
- اختر **Web Service**
- اختر **Connect a repository**
- ابحث عن `project-task-approval` واختره
- انقر على **Connect**

#### 3. إعدادات الخدمة

**Basic Settings:**
- **Name**: `project-task-approval`
- **Region**: اختر أقرب منطقة لك
- **Branch**: `main`
- **Root Directory**: اتركه فارغاً
- **Runtime**: `Python 3`

**Build Settings:**
- **Build Command**: 
  ```bash
  pip install -r requirements.txt
  ```

- **Start Command**:
  ```bash
  python src/main.py
  ```

**Environment Variables:**
- انقر على **Advanced**
- أضف المتغيرات التالية:
  - `PYTHON_VERSION` = `3.11.0`
  - `PORT` = `8080` (سيتم تعيينه تلقائياً)

**Plan:**
- اختر **Free**

#### 4. النشر
- انقر على **Create Web Service**
- انتظر حتى يكتمل البناء والنشر (5-10 دقائق)
- ستحصل على رابط مثل: `https://project-task-approval.onrender.com`

#### 5. الاختبار
- افتح الرابط في المتصفح
- سجل الدخول باستخدام الحسابات التجريبية

---

## 🚀 الخيار 2: النشر المنفصل (Backend على Render + Frontend على Vercel)

### الجزء الأول: نشر Backend على Render

اتبع نفس الخطوات في الخيار 1 أعلاه.

### الجزء الثاني: نشر Frontend على Vercel

#### 1. تحديث Frontend للاتصال بـ Backend

أولاً، نحتاج لتحديث عنوان API في Frontend:

```bash
# في ملف src/frontend/src/lib/api.js
# غيّر baseURL من:
baseURL: 'http://localhost:8080/api'

# إلى:
baseURL: 'https://your-render-url.onrender.com/api'
```

#### 2. إنشاء حساب على Vercel
- اذهب إلى https://vercel.com
- انقر على **Sign Up**
- سجل باستخدام GitHub

#### 3. استيراد المشروع
- من Dashboard، انقر على **Add New...**
- اختر **Project**
- ابحث عن `project-task-approval`
- انقر على **Import**

#### 4. إعدادات المشروع

**Framework Preset**: اختر `Vite`

**Root Directory**: 
- انقر على **Edit**
- أدخل: `src/frontend`

**Build Settings:**
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`
- **Install Command**: `pnpm install`

**Environment Variables:**
- أضف متغير:
  - `VITE_API_URL` = `https://your-render-url.onrender.com/api`

#### 5. النشر
- انقر على **Deploy**
- انتظر حتى يكتمل النشر (2-3 دقائق)
- ستحصل على رابط مثل: `https://project-task-approval.vercel.app`

---

## 🚀 الخيار 3: النشر على Railway

Railway هو بديل ممتاز لـ Render ويدعم النشر التلقائي.

#### 1. إنشاء حساب على Railway
- اذهب إلى https://railway.app
- انقر على **Login with GitHub**

#### 2. إنشاء مشروع جديد
- انقر على **New Project**
- اختر **Deploy from GitHub repo**
- اختر `project-task-approval`

#### 3. إعدادات المشروع
- Railway سيكتشف تلقائياً أنه مشروع Python
- **Start Command**: `python src/main.py`
- **Environment Variables**: سيتم تعيين PORT تلقائياً

#### 4. النشر
- انقر على **Deploy**
- ستحصل على رابط عام تلقائياً

---

## 🔧 إعدادات إضافية

### تفعيل CORS للـ Frontend المنفصل

إذا كنت تستخدم Frontend منفصل على Vercel، أضف هذا الكود في `src/main.py`:

```python
from flask_cors import CORS

# بعد إنشاء app
CORS(app, resources={r"/api/*": {"origins": "*"}})
```

ثم أضف `flask-cors` إلى `requirements.txt`:
```
flask-cors==4.0.0
```

### إنشاء قاعدة بيانات دائمة

للحصول على قاعدة بيانات دائمة بدلاً من SQLite:

#### على Render:
1. أنشئ **PostgreSQL** database جديدة (مجانية)
2. احصل على **Internal Database URL**
3. حدّث `SQLALCHEMY_DATABASE_URI` في `src/main.py`:
   ```python
   app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///...')
   ```
4. أضف متغير بيئة `DATABASE_URL` في إعدادات الخدمة

---

## 📝 الحسابات التجريبية

بعد النشر، يمكنك استخدام هذه الحسابات للاختبار:

| الدور | اسم المستخدم | كلمة المرور |
|------|-------------|-------------|
| موظف | `employee1` | `password123` |
| مدير مباشر | `manager1` | `password123` |
| مدير مشاريع | `pm1` | `password123` |
| موارد بشرية | `hr1` | `password123` |

**ملاحظة**: هذه الحسابات موجودة في قاعدة البيانات المحلية. ستحتاج لإنشائها على الخادم باستخدام سكريبت `create_test_users.py`.

### إنشاء الحسابات على الخادم:

#### على Render:
1. اذهب إلى **Shell** في Dashboard
2. شغّل:
   ```bash
   python create_test_users.py
   ```

---

## 🔄 التحديثات التلقائية

### Render:
- كل push إلى GitHub سيؤدي لنشر تلقائي
- يمكنك تعطيل هذا من إعدادات الخدمة

### Vercel:
- كل push إلى GitHub سيؤدي لنشر تلقائي
- يمكنك تعطيل هذا من إعدادات المشروع

---

## 🐛 استكشاف الأخطاء

### المشكلة: التطبيق لا يعمل بعد النشر

**الحل:**
1. تحقق من Logs في Dashboard
2. تأكد من أن جميع المتطلبات في `requirements.txt`
3. تأكد من أن PORT يتم قراءته من متغيرات البيئة

### المشكلة: قاعدة البيانات فارغة

**الحل:**
1. شغّل سكريبت إنشاء الحسابات التجريبية
2. تأكد من أن `db.create_all()` يعمل بشكل صحيح

### المشكلة: CORS errors

**الحل:**
1. أضف `flask-cors` كما هو موضح أعلاه
2. تأكد من أن Frontend يستخدم الـ API URL الصحيح

---

## 📊 المراقبة

### Render:
- **Metrics**: عرض استخدام CPU, Memory, Network
- **Logs**: عرض logs في الوقت الفعلي
- **Events**: تتبع النشر والأحداث

### Vercel:
- **Analytics**: إحصائيات الزوار
- **Logs**: سجلات النشر
- **Performance**: أداء الموقع

---

## 💰 الحدود المجانية

### Render Free Tier:
- 750 ساعة/شهر
- 512 MB RAM
- يتوقف بعد 15 دقيقة من عدم النشاط
- يستغرق ~30 ثانية للاستيقاظ

### Vercel Free Tier:
- 100 GB Bandwidth/شهر
- Unlimited deployments
- لا يتوقف

### Railway Free Tier:
- $5 رصيد مجاني/شهر
- يكفي لتطبيق صغير

---

## 🔐 الأمان

### للإنتاج:
1. **غيّر SECRET_KEY**: استخدم مفتاح عشوائي قوي
2. **استخدم HTTPS**: تلقائي على Render و Vercel
3. **غيّر كلمات المرور**: للحسابات التجريبية
4. **أضف Rate Limiting**: لحماية API
5. **استخدم قاعدة بيانات PostgreSQL**: بدلاً من SQLite

---

## 📚 موارد إضافية

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Flask Deployment](https://flask.palletsprojects.com/en/2.3.x/deploying/)

---

## ✅ الخلاصة

التطبيق جاهز للنشر على أي من المنصات المذكورة. اختر المنصة التي تناسبك واتبع الخطوات المذكورة أعلاه.

**الكود متاح على GitHub**: https://github.com/emadfor1983/project-task-approval

---

**تاريخ آخر تحديث**: 19 أكتوبر 2025

