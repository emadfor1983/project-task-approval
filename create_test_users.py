import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.models.user import db, User
from src.main import app

# بيانات المستخدمين التجريبيين
test_users = [
    {
        'username': 'employee1',
        'email': 'employee1@example.com',
        'password': 'password123',
        'full_name': 'أحمد محمد',
        'role': 'employee',
        'department': 'تقنية المعلومات'
    },
    {
        'username': 'manager1',
        'email': 'manager1@example.com',
        'password': 'password123',
        'full_name': 'خالد العلي',
        'role': 'direct_manager',
        'department': 'تقنية المعلومات'
    },
    {
        'username': 'pm1',
        'email': 'pm1@example.com',
        'password': 'password123',
        'full_name': 'سارة أحمد',
        'role': 'project_manager',
        'department': 'إدارة المشاريع'
    },
    {
        'username': 'hr1',
        'email': 'hr1@example.com',
        'password': 'password123',
        'full_name': 'فاطمة حسن',
        'role': 'hr',
        'department': 'الموارد البشرية'
    }
]

with app.app_context():
    # حذف المستخدمين الموجودين
    User.query.delete()
    db.session.commit()
    
    # إضافة المستخدمين الجدد
    for user_data in test_users:
        user = User(
            username=user_data['username'],
            email=user_data['email'],
            full_name=user_data['full_name'],
            role=user_data['role'],
            department=user_data['department']
        )
        user.set_password(user_data['password'])
        db.session.add(user)
    
    db.session.commit()
    print("تم إنشاء المستخدمين التجريبيين بنجاح!")
    print("\nبيانات تسجيل الدخول:")
    print("-" * 50)
    for user_data in test_users:
        print(f"الدور: {user_data['role']}")
        print(f"اسم المستخدم: {user_data['username']}")
        print(f"كلمة المرور: {user_data['password']}")
        print("-" * 50)
