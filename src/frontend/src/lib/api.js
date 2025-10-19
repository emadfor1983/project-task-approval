const API_BASE_URL = '/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  }

  // Auth endpoints
  async login(username, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Tasks endpoints
  async getTasks() {
    return this.request('/tasks');
  }

  async getTask(taskId) {
    return this.request(`/tasks/${taskId}`);
  }

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(taskId, taskData) {
    return this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async submitTask(taskId) {
    return this.request(`/tasks/${taskId}/submit`, {
      method: 'POST',
    });
  }

  async deleteTask(taskId) {
    return this.request(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  // Approvals endpoints
  async getPendingApprovals() {
    return this.request('/approvals/pending');
  }

  async approveTask(taskId, comments = '') {
    return this.request(`/approvals/${taskId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ comments }),
    });
  }

  async rejectTask(taskId, reason) {
    return this.request(`/approvals/${taskId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async requestRevision(taskId, notes) {
    return this.request(`/approvals/${taskId}/request-revision`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }
}

export default new ApiService();
