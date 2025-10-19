# وثائق API - نظام إدارة توقيع مهمات المشاريع

## نظرة عامة

هذا المستند يوثق جميع نقاط النهاية (Endpoints) المتاحة في API الخاص بنظام إدارة توقيع مهمات المشاريع.

**Base URL**: `http://localhost:8080`

**المصادقة**: يستخدم النظام JWT (JSON Web Tokens) للمصادقة. يجب تضمين التوكن في رأس الطلب:
```
Authorization: Bearer <token>
```

---

## المصادقة (Authentication)

### 1. تسجيل مستخدم جديد

**Endpoint**: `POST /api/auth/register`

**الوصف**: إنشاء حساب مستخدم جديد

**Body**:
```json
{
  "username": "string",
  "password": "string",
  "full_name": "string",
  "role": "employee|direct_manager|project_manager|hr"
}
```

**Response** (201):
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "employee1",
    "full_name": "أحمد محمد",
    "role": "employee"
  }
}
```

**أمثلة**:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "employee1",
    "password": "password123",
    "full_name": "أحمد محمد",
    "role": "employee"
  }'
```

---

### 2. تسجيل الدخول

**Endpoint**: `POST /api/auth/login`

**الوصف**: تسجيل الدخول والحصول على JWT token

**Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Response** (200):
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "employee1",
    "full_name": "أحمد محمد",
    "role": "employee"
  }
}
```

**أمثلة**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "employee1",
    "password": "password123"
  }'
```

---

## المهمات (Tasks)

### 3. إنشاء مهمة جديدة

**Endpoint**: `POST /api/tasks`

**الوصف**: إنشاء مهمة جديدة (للموظفين فقط)

**Headers**:
```
Authorization: Bearer <token>
```

**Body**:
```json
{
  "title": "string",
  "description": "string",
  "objectives": "string",
  "deliverables": "string",
  "estimated_hours": number
}
```

**Response** (201):
```json
{
  "id": 1,
  "title": "تطوير نظام إدارة المشاريع",
  "description": "تطوير نظام متكامل...",
  "objectives": "تحسين كفاءة إدارة المشاريع...",
  "deliverables": "نظام ويب كامل...",
  "estimated_hours": 120,
  "status": "pending_direct_manager",
  "created_by": 1,
  "created_at": "2025-10-19T10:30:00"
}
```

**أمثلة**:
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "تطوير نظام إدارة المشاريع",
    "description": "تطوير نظام متكامل لإدارة المشاريع",
    "objectives": "تحسين كفاءة إدارة المشاريع",
    "deliverables": "نظام ويب كامل مع قاعدة بيانات",
    "estimated_hours": 120
  }'
```

---

### 4. الحصول على جميع المهمات

**Endpoint**: `GET /api/tasks`

**الوصف**: الحصول على قائمة المهمات حسب دور المستخدم

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `status` (optional): تصفية حسب الحالة

**Response** (200):
```json
[
  {
    "id": 1,
    "title": "تطوير نظام إدارة المشاريع",
    "description": "تطوير نظام متكامل...",
    "status": "approved",
    "created_by": 1,
    "employee_name": "أحمد محمد",
    "estimated_hours": 120,
    "created_at": "2025-10-19T10:30:00"
  }
]
```

**أمثلة**:
```bash
# جميع المهمات
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer <token>"

# المهمات المعتمدة فقط
curl -X GET "http://localhost:8080/api/tasks?status=approved" \
  -H "Authorization: Bearer <token>"
```

---

### 5. الحصول على مهمة محددة

**Endpoint**: `GET /api/tasks/<task_id>`

**الوصف**: الحصول على تفاصيل مهمة محددة

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "id": 1,
  "title": "تطوير نظام إدارة المشاريع",
  "description": "تطوير نظام متكامل...",
  "objectives": "تحسين كفاءة إدارة المشاريع...",
  "deliverables": "نظام ويب كامل...",
  "estimated_hours": 120,
  "status": "approved",
  "created_by": 1,
  "employee_name": "أحمد محمد",
  "created_at": "2025-10-19T10:30:00"
}
```

**أمثلة**:
```bash
curl -X GET http://localhost:8080/api/tasks/1 \
  -H "Authorization: Bearer <token>"
```

---

### 6. تحديث مهمة

**Endpoint**: `PUT /api/tasks/<task_id>`

**الوصف**: تحديث مهمة موجودة (للموظف صاحب المهمة فقط)

**Headers**:
```
Authorization: Bearer <token>
```

**Body**:
```json
{
  "title": "string",
  "description": "string",
  "objectives": "string",
  "deliverables": "string",
  "estimated_hours": number
}
```

**Response** (200):
```json
{
  "message": "Task updated successfully"
}
```

**أمثلة**:
```bash
curl -X PUT http://localhost:8080/api/tasks/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "تطوير نظام إدارة المشاريع المحدث",
    "description": "تطوير نظام متكامل محدث...",
    "objectives": "تحسين كفاءة إدارة المشاريع",
    "deliverables": "نظام ويب كامل",
    "estimated_hours": 150
  }'
```

---

### 7. حذف مهمة

**Endpoint**: `DELETE /api/tasks/<task_id>`

**الوصف**: حذف مهمة (للموظف صاحب المهمة فقط، وفقط إذا لم تحصل على أي موافقات)

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "message": "Task deleted successfully"
}
```

**أمثلة**:
```bash
curl -X DELETE http://localhost:8080/api/tasks/1 \
  -H "Authorization: Bearer <token>"
```

---

## الموافقات (Approvals)

### 8. الموافقة على مهمة

**Endpoint**: `POST /api/approvals/approve/<task_id>`

**الوصف**: الموافقة على مهمة (للمديرين والموارد البشرية)

**Headers**:
```
Authorization: Bearer <token>
```

**Body**:
```json
{
  "comments": "string (optional)"
}
```

**Response** (200):
```json
{
  "message": "Task approved successfully"
}
```

**أمثلة**:
```bash
curl -X POST http://localhost:8080/api/approvals/approve/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "comments": "موافق على المهمة، مشروع مهم ومفيد للمؤسسة"
  }'
```

---

### 9. رفض مهمة

**Endpoint**: `POST /api/approvals/reject/<task_id>`

**الوصف**: رفض مهمة (للمديرين والموارد البشرية)

**Headers**:
```
Authorization: Bearer <token>
```

**Body**:
```json
{
  "comments": "string (required)"
}
```

**Response** (200):
```json
{
  "message": "Task rejected successfully"
}
```

**أمثلة**:
```bash
curl -X POST http://localhost:8080/api/approvals/reject/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "comments": "المهمة غير واضحة، يرجى إعادة صياغتها"
  }'
```

---

### 10. طلب تعديل على مهمة

**Endpoint**: `POST /api/approvals/request-revision/<task_id>`

**الوصف**: طلب تعديلات على مهمة (للمديرين والموارد البشرية)

**Headers**:
```
Authorization: Bearer <token>
```

**Body**:
```json
{
  "comments": "string (required)"
}
```

**Response** (200):
```json
{
  "message": "Revision requested successfully"
}
```

**أمثلة**:
```bash
curl -X POST http://localhost:8080/api/approvals/request-revision/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "comments": "يرجى إضافة المزيد من التفاصيل حول المخرجات المتوقعة"
  }'
```

---

### 11. الحصول على سجل الموافقات لمهمة

**Endpoint**: `GET /api/approvals/task/<task_id>`

**الوصف**: الحصول على جميع الموافقات والقرارات المتعلقة بمهمة

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
[
  {
    "id": 1,
    "task_id": 1,
    "approver_id": 2,
    "approver_name": "خالد العلي",
    "approver_role": "direct_manager",
    "action": "approved",
    "comments": "موافق على المهمة، مشروع مهم ومفيد للمؤسسة",
    "created_at": "2025-10-19T10:35:00"
  },
  {
    "id": 2,
    "task_id": 1,
    "approver_id": 3,
    "approver_name": "سارة أحمد",
    "approver_role": "project_manager",
    "action": "approved",
    "comments": "موافق من إدارة المشاريع، المشروع يتماشى مع الخطة الاستراتيجية",
    "created_at": "2025-10-19T10:40:00"
  }
]
```

**أمثلة**:
```bash
curl -X GET http://localhost:8080/api/approvals/task/1 \
  -H "Authorization: Bearer <token>"
```

---

## لوحة التحكم (Dashboard)

### 12. الحصول على إحصائيات لوحة التحكم

**Endpoint**: `GET /api/dashboard/stats`

**الوصف**: الحصول على الإحصائيات حسب دور المستخدم

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):

**للموظف**:
```json
{
  "total_tasks": 5,
  "approved_tasks": 2,
  "pending_tasks": 2,
  "rejected_tasks": 1
}
```

**للمديرين والموارد البشرية**:
```json
{
  "pending_approval": 3,
  "approved_tasks": 10
}
```

**أمثلة**:
```bash
curl -X GET http://localhost:8080/api/dashboard/stats \
  -H "Authorization: Bearer <token>"
```

---

## حالات المهمة (Task Status)

| الحالة | الوصف |
|-------|------|
| `pending_direct_manager` | بانتظار موافقة المدير المباشر |
| `pending_project_manager` | بانتظار موافقة مدير المشاريع |
| `pending_hr` | بانتظار موافقة الموارد البشرية |
| `approved` | معتمدة (حصلت على جميع الموافقات) |
| `rejected` | مرفوضة |
| `revision_requested` | يتطلب تعديل |

---

## أدوار المستخدمين (User Roles)

| الدور | القيمة | الصلاحيات |
|------|-------|----------|
| موظف | `employee` | إنشاء وتعديل المهمات |
| مدير مباشر | `direct_manager` | الموافقة/الرفض/طلب تعديل (المرحلة الأولى) |
| مدير مشاريع | `project_manager` | الموافقة/الرفض/طلب تعديل (المرحلة الثانية) |
| موارد بشرية | `hr` | الموافقة/الرفض/طلب تعديل (المرحلة النهائية) |

---

## أكواد الأخطاء (Error Codes)

| الكود | الوصف |
|------|------|
| 400 | Bad Request - طلب غير صحيح |
| 401 | Unauthorized - غير مصرح |
| 403 | Forbidden - ممنوع |
| 404 | Not Found - غير موجود |
| 500 | Internal Server Error - خطأ في الخادم |

**مثال على رسالة خطأ**:
```json
{
  "error": "Unauthorized access"
}
```

---

## أمثلة كاملة

### سيناريو كامل: إنشاء مهمة والموافقة عليها

```bash
# 1. تسجيل الدخول كموظف
TOKEN_EMPLOYEE=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "employee1", "password": "password123"}' \
  | jq -r '.token')

# 2. إنشاء مهمة جديدة
TASK_ID=$(curl -X POST http://localhost:8080/api/tasks \
  -H "Authorization: Bearer $TOKEN_EMPLOYEE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "تطوير نظام إدارة المشاريع",
    "description": "تطوير نظام متكامل",
    "objectives": "تحسين الكفاءة",
    "deliverables": "نظام ويب",
    "estimated_hours": 120
  }' | jq -r '.id')

# 3. تسجيل الدخول كمدير مباشر
TOKEN_MANAGER=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "manager1", "password": "password123"}' \
  | jq -r '.token')

# 4. الموافقة على المهمة
curl -X POST http://localhost:8080/api/approvals/approve/$TASK_ID \
  -H "Authorization: Bearer $TOKEN_MANAGER" \
  -H "Content-Type: application/json" \
  -d '{"comments": "موافق على المهمة"}'

# 5. تسجيل الدخول كمدير مشاريع
TOKEN_PM=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "pm1", "password": "password123"}' \
  | jq -r '.token')

# 6. الموافقة على المهمة
curl -X POST http://localhost:8080/api/approvals/approve/$TASK_ID \
  -H "Authorization: Bearer $TOKEN_PM" \
  -H "Content-Type: application/json" \
  -d '{"comments": "موافق من إدارة المشاريع"}'

# 7. تسجيل الدخول كموارد بشرية
TOKEN_HR=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "hr1", "password": "password123"}' \
  | jq -r '.token')

# 8. الموافقة النهائية
curl -X POST http://localhost:8080/api/approvals/approve/$TASK_ID \
  -H "Authorization: Bearer $TOKEN_HR" \
  -H "Content-Type: application/json" \
  -d '{"comments": "معتمد من الموارد البشرية"}'

# 9. التحقق من حالة المهمة
curl -X GET http://localhost:8080/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN_EMPLOYEE"
```

---

## ملاحظات مهمة

1. **المصادقة**: جميع endpoints تتطلب JWT token ماعدا `/api/auth/login` و `/api/auth/register`
2. **الصلاحيات**: كل endpoint يتحقق من صلاحيات المستخدم قبل تنفيذ العملية
3. **سير العمل**: المهمة يجب أن تمر بجميع مراحل الموافقة بالترتيب
4. **التعليقات**: التعليقات اختيارية عند الموافقة، ولكنها إلزامية عند الرفض أو طلب التعديل

---

**تاريخ آخر تحديث**: 19 أكتوبر 2025

