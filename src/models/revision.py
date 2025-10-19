from src.models.user import db
from datetime import datetime

class Revision(db.Model):
    __tablename__ = 'revisions'
    
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=False)
    requested_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    revision_notes = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    requester = db.relationship('User', foreign_keys=[requested_by])
    
    def to_dict(self):
        return {
            'id': self.id,
            'task_id': self.task_id,
            'requested_by': self.requested_by,
            'requester_name': self.requester.full_name if self.requester else None,
            'revision_notes': self.revision_notes,
            'created_at': self.created_at.isoformat()
        }
