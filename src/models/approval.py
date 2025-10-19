from src.models.user import db
from datetime import datetime

class Approval(db.Model):
    __tablename__ = 'approvals'
    
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=False)
    approver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    approver_role = db.Column(db.String(50), nullable=False)  # direct_manager, project_manager, hr
    status = db.Column(db.String(50), default='pending')  # pending, approved, rejected, revision_requested
    comments = db.Column(db.Text)
    action_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'task_id': self.task_id,
            'approver_id': self.approver_id,
            'approver_name': self.approver.full_name if self.approver else None,
            'approver_role': self.approver_role,
            'status': self.status,
            'comments': self.comments,
            'action_date': self.action_date.isoformat() if self.action_date else None,
            'created_at': self.created_at.isoformat()
        }
