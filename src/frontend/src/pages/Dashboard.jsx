import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { FileCheck, LogOut, Plus, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsResponse, tasksResponse] = await Promise.all([
        api.getDashboardStats(),
        user.role === 'employee' ? api.getTasks() : api.getPendingApprovals()
      ]);
      setStats(statsResponse.stats);
      setTasks(tasksResponse.tasks);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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

  const getRoleText = (role) => {
    const roleMap = {
      'employee': 'موظف',
      'direct_manager': 'مدير مباشر',
      'project_manager': 'مدير مشاريع',
      'hr': 'موارد بشرية'
    };
    return roleMap[role] || role;
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

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCheck className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">نظام إدارة المهمات</h1>
                <p className="text-sm text-gray-600">{user?.full_name} - {getRoleText(user?.role)}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="ml-2 h-4 w-4" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {user?.role === 'employee' && (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي المهمات</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats?.total_tasks || 0}</p>
                  </div>
                  <FileText className="h-12 w-12 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">قيد الانتظار</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">{stats?.pending_tasks || 0}</p>
                  </div>
                  <Clock className="h-12 w-12 text-yellow-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">معتمدة</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats?.approved_tasks || 0}</p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">مرفوضة</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{stats?.rejected_tasks || 0}</p>
                  </div>
                  <XCircle className="h-12 w-12 text-red-500" />
                </div>
              </div>
            </>
          )}

          {user?.role !== 'employee' && (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">بانتظار الموافقة</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">{stats?.pending_approvals || 0}</p>
                  </div>
                  <Clock className="h-12 w-12 text-yellow-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">تمت الموافقة عليها</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats?.approved_count || 0}</p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
              </div>
            </>
          )}
        </div>

        {user?.role === 'employee' && (
          <div className="mb-6">
            <Button onClick={() => navigate('/tasks/new')}>
              <Plus className="ml-2 h-4 w-4" />
              إنشاء مهمة جديدة
            </Button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              {user?.role === 'employee' ? 'مهماتي' : 'المهمات المعلقة'}
            </h2>
          </div>
          
          <div className="divide-y">
            {tasks.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>لا توجد مهمات</p>
              </div>
            ) : (
              tasks.map((task) => (
                <Link
                  key={task.id}
                  to={`/tasks/${task.id}`}
                  className="block px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{task.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>الموظف: {task.employee_name}</span>
                        <span>•</span>
                        <span>الوقت التقديري: {task.estimated_hours} ساعة</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(task.status)}`}>
                      {getStatusText(task.status)}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

