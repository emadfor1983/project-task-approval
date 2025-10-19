from flask import Blueprint, jsonify
from src.models.task import Task
from src.models.user import User, db
from src.routes.auth import token_required
from sqlalchemy import func

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard/stats', methods=['GET'])
@token_required
def get_stats(current_user):
    stats = {}
    
    if current_user.role == 'employee':
        # إحصائيات الموظف
        stats['total_tasks'] = Task.query.filter_by(employee_id=current_user.id).count()
        stats['draft_tasks'] = Task.query.filter_by(employee_id=current_user.id, status='draft').count()
        stats['pending_tasks'] = Task.query.filter(
            Task.employee_id == current_user.id,
            Task.status.in_(['pending_direct_manager', 'pending_project_manager', 'pending_hr'])
        ).count()
        stats['approved_tasks'] = Task.query.filter_by(employee_id=current_user.id, status='approved').count()
        stats['rejected_tasks'] = Task.query.filter_by(employee_id=current_user.id, status='rejected').count()
    
    elif current_user.role == 'direct_manager':
        stats['pending_approval'] = Task.query.filter_by(status='pending_direct_manager').count()
        stats['total_approved'] = Task.query.join(Task.approvals).filter(
            Task.approvals.any(approver_id=current_user.id, status='approved')
        ).count()
    
    elif current_user.role == 'project_manager':
        stats['pending_approval'] = Task.query.filter_by(status='pending_project_manager').count()
        stats['total_approved'] = Task.query.join(Task.approvals).filter(
            Task.approvals.any(approver_id=current_user.id, status='approved')
        ).count()
    
    elif current_user.role == 'hr':
        stats['pending_approval'] = Task.query.filter_by(status='pending_hr').count()
        stats['total_approved'] = Task.query.filter_by(status='approved').count()
        stats['total_tasks'] = Task.query.count()
        stats['total_users'] = User.query.count()
    
    # إحصائيات عامة
    status_counts = db.session.query(
        Task.status, func.count(Task.id)
    ).group_by(Task.status).all()
    
    stats['status_breakdown'] = {status: count for status, count in status_counts}
    
    return jsonify({'stats': stats}), 200
