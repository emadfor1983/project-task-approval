import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, XCircle, Edit, Trash2, Clock, User, Calendar } from 'lucide-react';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showRevisionDialog, setShowRevisionDialog] = useState(false);
  const [comments, setComments] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadTask();
  }, [id]);

  const loadTask = async () => {
    try {
      setLoading(true);
      const response = await api.getTask(id);
      setTask(response.task);
    } catch (error) {
      console.error('Failed to load task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await api.approveTask(id, comments);
      setShowApprovalDialog(false);
      navigate('/dashboard');
    } catch (error) {
      alert(error.message || 'فشلت عملية الموافقة');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      alert('يرجى كتابة سبب الرفض');
      return;
    }

    try {
      setActionLoading(true);
      await api.rejectTask(id, reason);
      setShowRejectDialog(false);
      navigate('/dashboard');
    } catch (error) {
      alert(error.message || 'فشلت عملية الرفض');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!notes.trim()) {
      alert('يرجى كتابة ملاحظات التعديل');
      return;
    }

    try {
      setActionLoading(true);
      await api.requestRevision(id, notes);
      setShowRevisionDialog(false);
      navigate('/dashboard');
    } catch (error) {
      alert(error.message || 'فشلت عملية طلب التعديل');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذه المهمة؟')) return;

    try {
      await api.deleteTask(id);
      navigate('/dashboard');
    } catch (error) {
      alert(error.message || 'فشل حذف المهمة');
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'draft': 'مسودة',
      'pending_direct_manager': 'بانتظار المدير المباشر',
      'pending_project_manager': 'بانتظار مدير المشاريع',
      'pending_hr': 'بانتظار الموارد البشرية',
      'approved': 'معتمدة',
      'rejected': 'مرفوضة'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'draft': 'bg-gray-100 text-gray-800',
      'pending_direct_manager': 'bg-yellow-100 text-yellow-800',
      'pending_project_manager': 'bg-blue-100 text-blue-800',
      'pending_hr': 'bg-purple-100 text-purple-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const canApprove = () => {
    if (!task) return false;
    if (user.role === 'direct_manager' && task.status === 'pending_direct_manager') return true;
    if (user.role === 'project_manager' && task.status === 'pending_project_manager') return true;
    if (user.role === 'hr' && task.status === 'pending_hr') return true;
    return false;
  };

  const canEdit = () => {
    return task && task.employee_id === user.id && task.status === 'draft';
  };

  const canDelete = () => {
    return task && task.employee_id === user.id && task.status === 'draft';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">المهمة غير موجودة</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            العودة إلى لوحة التحكم
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة إلى لوحة التحكم
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {task.employee_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(task.created_at).toLocaleDateString('ar-SA')}
                  </span>
                  {task.estimated_hours > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {task.estimated_hours} ساعة
                    </span>
                  )}
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                {getStatusText(task.status)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">وصف المهمة</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
            </div>

            {task.objectives && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">الأهداف المرجوة</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{task.objectives}</p>
              </div>
            )}

            {task.deliverables && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">المخرجات المتوقعة</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{task.deliverables}</p>
              </div>
            )}

            {task.rejection_reason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-red-900 mb-2">سبب الرفض</h2>
                <p className="text-red-700">{task.rejection_reason}</p>
              </div>
            )}

            {/* Approvals History */}
            {task.approvals && task.approvals.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">سجل الموافقات</h2>
                <div className="space-y-3">
                  {task.approvals.map((approval) => (
                    <div key={approval.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{approval.approver_name}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          approval.status === 'approved' ? 'bg-green-100 text-green-800' :
                          approval.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {approval.status === 'approved' ? 'موافق' :
                           approval.status === 'rejected' ? 'مرفوض' : 'طلب تعديل'}
                        </span>
                      </div>
                      {approval.comments && (
                        <p className="text-sm text-gray-600">{approval.comments}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(approval.action_date).toLocaleString('ar-SA')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Revisions History */}
            {task.revisions && task.revisions.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">طلبات التعديل</h2>
                <div className="space-y-3">
                  {task.revisions.map((revision) => (
                    <div key={revision.id} className="border rounded-lg p-4 bg-yellow-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{revision.requester_name}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(revision.created_at).toLocaleString('ar-SA')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{revision.revision_notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex gap-3">
              {canApprove() && (
                <>
                  <Button onClick={() => setShowApprovalDialog(true)} className="flex-1">
                    <CheckCircle className="ml-2 h-4 w-4" />
                    موافقة
                  </Button>
                  <Button onClick={() => setShowRejectDialog(true)} variant="destructive" className="flex-1">
                    <XCircle className="ml-2 h-4 w-4" />
                    رفض
                  </Button>
                  <Button onClick={() => setShowRevisionDialog(true)} variant="outline" className="flex-1">
                    <Edit className="ml-2 h-4 w-4" />
                    طلب تعديل
                  </Button>
                </>
              )}

              {canEdit() && (
                <Button onClick={() => navigate(`/tasks/edit/${id}`)} variant="outline">
                  <Edit className="ml-2 h-4 w-4" />
                  تعديل
                </Button>
              )}

              {canDelete() && (
                <Button onClick={handleDelete} variant="destructive">
                  <Trash2 className="ml-2 h-4 w-4" />
                  حذف
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Approval Dialog */}
      {showApprovalDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">الموافقة على المهمة</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تعليقات (اختياري)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                dir="rtl"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleApprove} disabled={actionLoading} className="flex-1">
                {actionLoading ? 'جاري الموافقة...' : 'تأكيد الموافقة'}
              </Button>
              <Button onClick={() => setShowApprovalDialog(false)} variant="outline" className="flex-1">
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">رفض المهمة</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                سبب الرفض <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={4}
                required
                dir="rtl"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleReject} disabled={actionLoading} variant="destructive" className="flex-1">
                {actionLoading ? 'جاري الرفض...' : 'تأكيد الرفض'}
              </Button>
              <Button onClick={() => setShowRejectDialog(false)} variant="outline" className="flex-1">
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Dialog */}
      {showRevisionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">طلب تعديل</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ملاحظات التعديل <span className="text-red-500">*</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={4}
                required
                dir="rtl"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleRequestRevision} disabled={actionLoading} className="flex-1">
                {actionLoading ? 'جاري الإرسال...' : 'إرسال طلب التعديل'}
              </Button>
              <Button onClick={() => setShowRevisionDialog(false)} variant="outline" className="flex-1">
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
