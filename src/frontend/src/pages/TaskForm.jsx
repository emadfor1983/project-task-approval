import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowRight, Save, Send, Loader2 } from 'lucide-react';

export default function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    objectives: '',
    deliverables: '',
    estimated_hours: ''
  });

  useEffect(() => {
    if (id) {
      loadTask();
    }
  }, [id]);

  const loadTask = async () => {
    try {
      setLoading(true);
      const response = await api.getTask(id);
      const task = response.task;
      
      if (task.status !== 'draft') {
        setError('لا يمكن تعديل المهمة إلا في حالة المسودة');
        return;
      }
      
      setFormData({
        title: task.title,
        description: task.description,
        objectives: task.objectives || '',
        deliverables: task.deliverables || '',
        estimated_hours: task.estimated_hours || ''
      });
    } catch (err) {
      setError(err.message || 'فشل تحميل المهمة');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setError('');
    setSubmitting(true);

    try {
      if (id) {
        await api.updateTask(id, formData);
      } else {
        await api.createTask(formData);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'فشل حفظ المهمة');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);

    try {
      let taskId = id;
      if (!id) {
        const response = await api.createTask(formData);
        taskId = response.task.id;
      } else {
        await api.updateTask(id, formData);
      }
      
      await api.submitTask(taskId);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'فشل إرسال المهمة');
    } finally {
      setSubmitting(false);
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowRight className="ml-2 h-4 w-4" />
            العودة إلى لوحة التحكم
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {id ? 'تعديل المهمة' : 'إنشاء مهمة جديدة'}
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان المهمة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="أدخل عنوان المهمة"
                required
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                وصف المهمة <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="اكتب وصفاً تفصيلياً للمهمة"
                rows={5}
                required
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الأهداف المرجوة
              </label>
              <textarea
                value={formData.objectives}
                onChange={(e) => handleChange('objectives', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="حدد الأهداف التي تسعى لتحقيقها من هذه المهمة"
                rows={4}
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المخرجات المتوقعة
              </label>
              <textarea
                value={formData.deliverables}
                onChange={(e) => handleChange('deliverables', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="اذكر المخرجات والنتائج المتوقعة"
                rows={4}
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوقت التقديري (بالساعات)
              </label>
              <input
                type="number"
                value={formData.estimated_hours}
                onChange={(e) => handleChange('estimated_hours', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0"
                min="0"
                step="0.5"
                dir="rtl"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleSave}
                variant="outline"
                disabled={submitting || !formData.title || !formData.description}
                className="flex-1"
              >
                {submitting ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="ml-2 h-4 w-4" />
                    حفظ كمسودة
                  </>
                )}
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={submitting || !formData.title || !formData.description}
                className="flex-1"
              >
                {submitting ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="ml-2 h-4 w-4" />
                    إرسال للموافقة
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
