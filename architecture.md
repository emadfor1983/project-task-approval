# تصميم بنية تطبيق إدارة توقيع مهمات المشاريع

## 1. البنية العامة للتطبيق

### Stack التقني:
- **Backend:** Flask (Python)
- **Frontend:** React
- **Database:** SQLite (للتطوير، يمكن الترقية إلى PostgreSQL للإنتاج)
- **Authentication:** JWT (JSON Web Tokens)

## 2. قاعدة البيانات

### الجداول الرئيسية:

#### جدول المستخدمين (users)
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password_hash`
- `full_name`
- `role` (employee, direct_manager, project_manager, hr)
- `department`
- `created_at`

#### جدول المهمات (tasks)
- `id` (Primary Key)
- `title`
- `description`
- `objectives`
- `deliverables`
- `estimated_hours`
- `employee_id` (Foreign Key -> users)
- `status` (draft, pending_direct_manager, pending_project_manager, pending_hr, approved, rejected)
- `rejection_reason`
- `created_at`
- `updated_at`

#### جدول الموافقات (approvals)
- `id` (Primary Key)
- `task_id` (Foreign Key -> tasks)
- `approver_id` (Foreign Key -> users)
- `approver_role` (direct_manager, project_manager, hr)
- `status` (pending, approved, rejected, revision_requested)
- `comments`
- `action_date`

#### جدول التعديلات (revisions)
- `id` (Primary Key)
- `task_id` (Foreign Key -> tasks)
- `requested_by` (Foreign Key -> users)
- `revision_notes`
- `created_at`

## 3. API Endpoints

### Authentication:
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `GET /api/auth/me` - الحصول على بيانات المستخدم الحالي

### Tasks:
- `GET /api/tasks` - الحصول على جميع المهمات (حسب الصلاحية)
- `GET /api/tasks/:id` - الحصول على تفاصيل مهمة
- `POST /api/tasks` - إنشاء مهمة جديدة
- `PUT /api/tasks/:id` - تحديث مهمة
- `DELETE /api/tasks/:id` - حذف مهمة

### Approvals:
- `GET /api/approvals/pending` - المهمات المعلقة للموافقة
- `POST /api/approvals/:task_id/approve` - الموافقة على مهمة
- `POST /api/approvals/:task_id/reject` - رفض مهمة
- `POST /api/approvals/:task_id/request-revision` - طلب تعديل

### Dashboard:
- `GET /api/dashboard/stats` - إحصائيات عامة

## 4. سير العمل (Workflow)

1. الموظف ينشئ مهمة جديدة (status: draft)
2. عند الإرسال، تتغير الحالة إلى (pending_direct_manager)
3. المدير المباشر يراجع ويوافق → (pending_project_manager)
4. مدير المشاريع يراجع ويوافق → (pending_hr)
5. الموارد البشرية توافق → (approved)
6. في أي مرحلة، يمكن الرفض أو طلب التعديل

## 5. الأمان والصلاحيات

- كل مستخدم يرى فقط المهمات المتعلقة به
- المديرون يرون المهمات المعلقة للموافقة
- JWT للمصادقة وحماية الـ APIs
- تشفير كلمات المرور باستخدام bcrypt
