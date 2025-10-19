from flask import Blueprint, request, jsonify
from src.models.user import db, User
from src.models.task import Task
from src.models.approval import Approval
from src.routes.auth import token_required
from datetime import datetime

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('/tasks', methods=['GET'])
@token_required
def get_tasks(current_user):
    # حسب الدور، يتم عرض المهمات المناسبة
    if current_user.role == 'employee':
        tasks = Task.query.filter_by(employee_id=current_user.id).all()
    elif current_user.role == 'direct_manager':
        tasks = Task.query.filter(Task.status.in_(['pending_direct_manager', 'approved', 'rejected'])).all()
    elif current_user.role == 'project_manager':
        tasks = Task.query.filter(Task.status.in_(['pending_project_manager', 'approved', 'rejected'])).all()
    elif current_user.role == 'hr':
        tasks = Task.query.filter(Task.status.in_(['pending_hr', 'approved', 'rejected'])).all()
    else:
        tasks = []
    
    return jsonify({'tasks': [task.to_dict() for task in tasks]}), 200

@tasks_bp.route('/tasks/<int:task_id>', methods=['GET'])
@token_required
def get_task(current_user, task_id):
    task = Task.query.get(task_id)
    
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    
    # التحقق من الصلاحيات
    if current_user.role == 'employee' and task.employee_id != current_user.id:
        return jsonify({'message': 'Access denied'}), 403
    
    task_dict = task.to_dict()
    task_dict['approvals'] = [approval.to_dict() for approval in task.approvals]
    task_dict['revisions'] = [revision.to_dict() for revision in task.revisions]
    
    return jsonify({'task': task_dict}), 200

@tasks_bp.route('/tasks', methods=['POST'])
@token_required
def create_task(current_user):
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('description'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    new_task = Task(
        title=data['title'],
        description=data['description'],
        objectives=data.get('objectives', ''),
        deliverables=data.get('deliverables', ''),
        estimated_hours=data.get('estimated_hours', 0),
        employee_id=current_user.id,
        status='draft'
    )
    
    db.session.add(new_task)
    db.session.commit()
    
    return jsonify({'message': 'Task created successfully', 'task': new_task.to_dict()}), 201

@tasks_bp.route('/tasks/<int:task_id>', methods=['PUT'])
@token_required
def update_task(current_user, task_id):
    task = Task.query.get(task_id)
    
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    
    if task.employee_id != current_user.id:
        return jsonify({'message': 'Access denied'}), 403
    
    data = request.get_json()
    
    if data.get('title'):
        task.title = data['title']
    if data.get('description'):
        task.description = data['description']
    if data.get('objectives'):
        task.objectives = data['objectives']
    if data.get('deliverables'):
        task.deliverables = data['deliverables']
    if data.get('estimated_hours'):
        task.estimated_hours = data['estimated_hours']
    
    task.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({'message': 'Task updated successfully', 'task': task.to_dict()}), 200

@tasks_bp.route('/tasks/<int:task_id>/submit', methods=['POST'])
@token_required
def submit_task(current_user, task_id):
    task = Task.query.get(task_id)
    
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    
    if task.employee_id != current_user.id:
        return jsonify({'message': 'Access denied'}), 403
    
    if task.status != 'draft':
        return jsonify({'message': 'Task already submitted'}), 400
    
    task.status = 'pending_direct_manager'
    task.updated_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify({'message': 'Task submitted successfully', 'task': task.to_dict()}), 200

@tasks_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
@token_required
def delete_task(current_user, task_id):
    task = Task.query.get(task_id)
    
    if not task:
        return jsonify({'message': 'Task not found'}), 404
    
    if task.employee_id != current_user.id:
        return jsonify({'message': 'Access denied'}), 403
    
    db.session.delete(task)
    db.session.commit()
    
    return jsonify({'message': 'Task deleted successfully'}), 200
