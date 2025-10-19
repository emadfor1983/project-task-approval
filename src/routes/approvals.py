from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.task import Task
from src.models.approval import Approval
from src.models.revision import Revision
from src.routes.auth import token_required
from datetime import datetime

approvals_bp = Blueprint('approvals', __name__)

@approvals_bp.route('/approvals/pending', methods=['GET'])
@token_required
def get_pending_approvals(current_user):
    # حسب دور المستخدم، يتم عرض المهمات المعلقة
    if current_user.role == 'direct_manager':
        tasks = Task.query.filter_by(status='pending_direct_manager').all()
    elif current_user.role == 'project_manager':
        tasks = Task.query.filter_by(status='pending_project_manager').all()
    elif current_user.role == 'hr':
        tasks = Task.query.filter_by(status='pending_hr').all()
    else:
        return jsonify({'message': 'Access denied'}), 403
    
    return jsonify({'tasks': [task.to_dict() for task in tasks]}), 200

@approvals_bp.route('/approvals/<int:task_id>/approve', methods=['POST'])
@token_required
def approve_task(current_user, task_id):
    task = Task.query.get(task_id)
    
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    
    data = request.get_json()
    comments = data.get('comments', '') if data else ''
    
    # التحقق من الصلاحيات والحالة
    if current_user.role == 'direct_manager' and task.status == 'pending_direct_manager':
        task.status = 'pending_project_manager'
        approver_role = 'direct_manager'
    elif current_user.role == 'project_manager' and task.status == 'pending_project_manager':
        task.status = 'pending_hr'
        approver_role = 'project_manager'
    elif current_user.role == 'hr' and task.status == 'pending_hr':
        task.status = 'approved'
        approver_role = 'hr'
    else:
        return jsonify({'message': 'Invalid approval request'}), 400
    
    # إنشاء سجل الموافقة
    approval = Approval(
        task_id=task_id,
        approver_id=current_user.id,
        approver_role=approver_role,
        status='approved',
        comments=comments,
        action_date=datetime.utcnow()
    )
    
    db.session.add(approval)
    task.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({'message': 'Task approved successfully', 'task': task.to_dict()}), 200

@approvals_bp.route('/approvals/<int:task_id>/reject', methods=['POST'])
@token_required
def reject_task(current_user, task_id):
    task = Task.query.get(task_id)
    
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    
    data = request.get_json()
    
    if not data or not data.get('reason'):
        return jsonify({'message': 'Rejection reason is required'}), 400
    
    # التحقق من الصلاحيات
    if current_user.role == 'direct_manager' and task.status == 'pending_direct_manager':
        approver_role = 'direct_manager'
    elif current_user.role == 'project_manager' and task.status == 'pending_project_manager':
        approver_role = 'project_manager'
    elif current_user.role == 'hr' and task.status == 'pending_hr':
        approver_role = 'hr'
    else:
        return jsonify({'message': 'Invalid rejection request'}), 400
    
    task.status = 'rejected'
    task.rejection_reason = data['reason']
    
    # إنشاء سجل الموافقة
    approval = Approval(
        task_id=task_id,
        approver_id=current_user.id,
        approver_role=approver_role,
        status='rejected',
        comments=data['reason'],
        action_date=datetime.utcnow()
    )
    
    db.session.add(approval)
    task.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({'message': 'Task rejected', 'task': task.to_dict()}), 200

@approvals_bp.route('/approvals/<int:task_id>/request-revision', methods=['POST'])
@token_required
def request_revision(current_user, task_id):
    task = Task.query.get(task_id)
    
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    
    data = request.get_json()
    
    if not data or not data.get('notes'):
        return jsonify({'message': 'Revision notes are required'}), 400
    
    # التحقق من الصلاحيات
    if current_user.role not in ['direct_manager', 'project_manager', 'hr']:
        return jsonify({'message': 'Access denied'}), 403
    
    # إعادة المهمة إلى حالة المسودة
    task.status = 'draft'
    
    # إنشاء سجل التعديل
    revision = Revision(
        task_id=task_id,
        requested_by=current_user.id,
        revision_notes=data['notes']
    )
    
    # إنشاء سجل الموافقة
    approval = Approval(
        task_id=task_id,
        approver_id=current_user.id,
        approver_role=current_user.role,
        status='revision_requested',
        comments=data['notes'],
        action_date=datetime.utcnow()
    )
    
    db.session.add(revision)
    db.session.add(approval)
    task.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({'message': 'Revision requested', 'task': task.to_dict()}), 200
