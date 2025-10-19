from src.models.user import db
from datetime import datetime

class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    objectives = db.Column(db.Text)
    deliverables = db.Column(db.Text)
    estimated_hours = db.Column(db.Float)
    employee_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(50), default='draft')  # draft, pending_direct_manager, pending_project_manager, pending_hr, approved, rejected
    rejection_reason = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    approvals = db.relationship('Approval', backref='task', lazy=True, cascade='all, delete-orphan')
    revisions = db.relationship('Revision', backref='task', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'objectives': self.objectives,
            'deliverables': self.deliverables,
            'estimated_hours': self.estimated_hours,
            'employee_id': self.employee_id,
            'employee_name': self.employee.full_name if self.employee else None,
            'status': self.status,
            'rejection_reason': self.rejection_reason,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
