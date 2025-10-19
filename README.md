# نظام إدارة توقيع مهمات المشاريع

## نظرة عامة

تطبيق ويب متكامل لإدارة عملية الموافقة على مهمات المشاريع في المؤسسات. يتطلب النظام موافقة ثلاثة أطراف: المدير المباشر، مدير المشاريع، والموارد البشرية.

## المزايا

- ✅ سير عمل منظم ومتسلسل للموافقات
- ✅ واجهة عربية احترافية بالكامل
- ✅ لوحة تحكم تفاعلية مع إحصائيات فورية
- ✅ نظام صلاحيات متعدد المستويات
- ✅ تتبع حالة المهمات في الوقت الفعلي
- ✅ إمكانية طلب التعديلات والرفض مع التعليقات

## التقنيات المستخدمة

### Backend
- **Flask** - إطار عمل Python للواجهة الخلفية
- **SQLAlchemy** - ORM لإدارة قاعدة البيانات
- **SQLite** - قاعدة بيانات (يمكن الترقية إلى PostgreSQL)
- **JWT** - للمصادقة والأمان
- **bcrypt** - لتشفير كلمات المرور

### Frontend
- **React** - مكتبة JavaScript للواجهة الأمامية
- **React Router** - للتوجيه بين الصفحات
- **Tailwind CSS** - للتصميم
- **shadcn/ui** - مكونات واجهة المستخدم
- **Lucide Icons** - الأيقونات

## البنية الهيكلية

```
project_task_approval/
├── src/
│   ├── models/           # نماذج قاعدة البيانات
│   │   ├── user.py       # نموذج المستخدمين
│   │   ├── task.py       # نموذج المهمات
│   │   ├── approval.py   # نموذج الموافقات
│   │   └── revision.py   # نموذج التعديلات
│   ├── routes/           # مسارات API
│   │   ├── auth.py       # المصادقة
│   │   ├── tasks.py      # المهمات
│   │   ├── approvals.py  # الموافقات
│   │   └── dashboard.py  # لوحة التحكم
│   ├── frontend/         # تطبيق React
│   │   ├── src/
│   │   │   ├── pages/    # صفحات التطبيق
│   │   │   ├── contexts/ # React Contexts
│   │   │   ├── lib/      # المكتبات والأدوات
│   │   │   └── components/ # المكونات
│   │   └── dist/         # الملفات المبنية
│   ├── static/           # الملفات الثابتة (Frontend المبني)
│   ├── database/         # قاعدة البيانات
│   └── main.py           # نقطة الدخول الرئيسية
├── venv/                 # البيئة الافتراضية
├── requirements.txt      # متطلبات Python
├── create_test_users.py  # سكريبت إنشاء مستخدمين تجريبيين
├── architecture.md       # وثائق البنية
├── USER_GUIDE.md         # دليل المستخدم
└── README.md             # هذا الملف
```

## التثبيت والإعداد

### المتطلبات الأساسية

- Python 3.11 أو أحدث
- Node.js 22 أو أحدث
- pip و pnpm

### خطوات التثبيت

#### 1. استنساخ المشروع

```bash
cd /home/ubuntu/project_task_approval
```

#### 2. إعداد Backend

```bash
# تفعيل البيئة الافتراضية
source venv/bin/activate

# تثبيت المتطلبات (مثبتة مسبقاً)
pip install -r requirements.txt

# إنشاء مستخدمين تجريبيين
python create_test_users.py
```

#### 3. إعداد Frontend (إذا كنت تريد التطوير)

```bash
cd src/frontend

# تثبيت المتطلبات (مثبتة مسبقاً)
pnpm install

# بناء التطبيق
pnpm run build

# نسخ الملفات المبنية
cd ../..
cp -r src/frontend/dist/* src/static/
```

#### 4. تشغيل التطبيق

```bash
# تأكد من تفعيل البيئة الافتراضية
source venv/bin/activate

# تشغيل الخادم
python src/main.py
```

التطبيق سيعمل على: `http://localhost:8080`

## الحسابات التجريبية

| الدور | اسم المستخدم | كلمة المرور |
|------|--------------|-------------|
| موظف | employee1 | password123 |
| مدير مباشر | manager1 | password123 |
| مدير مشاريع | pm1 | password123 |
| موارد بشرية | hr1 | password123 |

## API Endpoints

### المصادقة
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - الحصول على بيانات المستخدم الحالي

### المهمات
- `GET /api/tasks` - الحصول على جميع المهمات
- `GET /api/tasks/:id` - الحصول على مهمة محددة
- `POST /api/tasks` - إنشاء مهمة جديدة
- `PUT /api/tasks/:id` - تحديث مهمة
- `POST /api/tasks/:id/submit` - إرسال مهمة للموافقة
- `DELETE /api/tasks/:id` - حذف مهمة

### الموافقات
- `GET /api/approvals/pending` - المهمات المعلقة للموافقة
- `POST /api/approvals/:id/approve` - الموافقة على مهمة
- `POST /api/approvals/:id/reject` - رفض مهمة
- `POST /api/approvals/:id/request-revision` - طلب تعديل

### لوحة التحكم
- `GET /api/dashboard/stats` - إحصائيات لوحة التحكم

## سير العمل

1. **الموظف** ينشئ مهمة جديدة ويرسلها
2. **المدير المباشر** يراجع ويوافق/يرفض/يطلب تعديل
3. **مدير المشاريع** يراجع ويوافق/يرفض/يطلب تعديل
4. **الموارد البشرية** توافق نهائياً/ترفض/تطلب تعديل
5. المهمة تصبح **معتمدة** أو **مرفوضة**

## التطوير

### تشغيل Frontend في وضع التطوير

```bash
cd src/frontend
pnpm run dev
```

سيعمل على: `http://localhost:5173`

**ملاحظة:** في وضع التطوير، قد تحتاج لتحديث `API_BASE_URL` في `src/frontend/src/lib/api.js`

### بناء Frontend للإنتاج

```bash
cd src/frontend
pnpm run build
cd ../..
rm -rf src/static/*
cp -r src/frontend/dist/* src/static/
```

## النشر للإنتاج

### استخدام Gunicorn (موصى به)

```bash
# تثبيت gunicorn
pip install gunicorn

# تشغيل التطبيق
gunicorn -w 4 -b 0.0.0.0:8080 src.main:app
```

### استخدام Docker (اختياري)

يمكنك إنشاء Dockerfile للتطبيق:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY src/ ./src/
COPY create_test_users.py .

EXPOSE 8080
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8080", "src.main:app"]
```

## الأمان

- ✅ كلمات المرور مشفرة باستخدام bcrypt
- ✅ المصادقة عبر JWT tokens
- ✅ نظام صلاحيات محكم
- ✅ حماية من CSRF
- ✅ التحقق من صحة المدخلات

## الترقيات المستقبلية المقترحة

- [ ] إشعارات بالبريد الإلكتروني
- [ ] نظام الإشعارات الفورية
- [ ] تقارير وإحصائيات متقدمة
- [ ] تصدير البيانات (PDF, Excel)
- [ ] تكامل مع أنظمة خارجية
- [ ] تطبيق موبايل
- [ ] دعم المرفقات
- [ ] سجل التغييرات (Audit Log)
- [ ] البحث والفلترة المتقدمة
- [ ] لوحة تحكم إدارية شاملة

## استكشاف الأخطاء

### المشكلة: لا يمكن تسجيل الدخول

**الحل:**
- تأكد من إنشاء المستخدمين التجريبيين: `python create_test_users.py`
- تحقق من صحة اسم المستخدم وكلمة المرور

### المشكلة: الصفحة فارغة

**الحل:**
- تأكد من بناء Frontend: `cd src/frontend && pnpm run build`
- تأكد من نسخ الملفات: `cp -r src/frontend/dist/* src/static/`

### المشكلة: خطأ في قاعدة البيانات

**الحل:**
- احذف قاعدة البيانات وأعد إنشاءها:
```bash
rm src/database/app.db
python src/main.py  # سينشئ قاعدة بيانات جديدة
python create_test_users.py
```

## المساهمة

نرحب بالمساهمات! يرجى:
1. عمل Fork للمشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push إلى الفرع
5. فتح Pull Request

## الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام الحر.

## الدعم

للمزيد من المعلومات، راجع:
- [دليل المستخدم](USER_GUIDE.md)
- [وثائق البنية](architecture.md)

---

**تم التطوير بواسطة Manus AI**
