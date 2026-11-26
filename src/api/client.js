import axios from 'axios'

export const API_BASE_URL = 'https://doctors-pg-backend-1001199295091.asia-south2.run.app/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medrecall_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token if invalid
      localStorage.removeItem('medrecall_token')
      localStorage.removeItem('medrecall_user')
    }
    return Promise.reject(error)
  }
)

// Auth helper: returns stored token if session exists
export async function ensureAuth() {
  return localStorage.getItem('medrecall_token') || null
}

// API Methods
export const apiService = {
  // Subjects & Live Progress
  getSubjects: () => api.get('/subjects').then((r) => r.data),
  getSubjectTopics: (slug) => api.get(`/subjects/${slug}/topics`).then((r) => r.data),
  getLiveProgress: () =>
    axios.get('https://doctors-pg-backend-1001199295091.asia-south2.run.app/live-progress/data').then((r) => r.data),

  // Search
  search: (query) => api.get('/search', { params: { q: query } }).then((r) => r.data),
  getTrending: () => api.get('/search/trending').then((r) => r.data),
  recordSearchClick: (topicId, query) => api.post('/search/click', { topicId, query }).then((r) => r.data),

  // Topic & 3-Layer Revision
  getTopic: (slug) => api.get(`/topics/${slug}`).then((r) => r.data),
  getTopicQuestions: (slug, params = {}) => api.get(`/topics/${slug}/questions`, { params }).then((r) => r.data),

  // Practice & Mistakes Deck
  getPracticeDrill: (params = {}) => api.get('/practice/drill', { params }).then((r) => r.data),
  recordAttempt: (payload) => api.post('/progress/attempt', payload).then((r) => r.data),
  recordBatchAttempt: (attempts) => api.post('/progress/batch-attempt', { attempts }).then((r) => r.data),
  getWrongDeck: (topicSlug) => api.get('/progress/wrong-deck', { params: { topicSlug } }).then((r) => r.data),
  getProgressSummary: () => api.get('/progress/summary').then((r) => r.data),

  // 20th Notebook
  getNotebook: (subjectCode) => api.get('/notebook', { params: { subjectCode } }).then((r) => r.data),
  toggleNotebook: (topicId, personalNote = '') => api.post('/notebook/toggle', { topicId, personalNote }).then((r) => r.data),
  updateNotebookNote: (topicId, personalNote) => api.patch(`/notebook/${topicId}/note`, { personalNote }).then((r) => r.data),

  // Clinical Review & Audit
  flagError: (payload) => api.post('/review/flag', payload).then((r) => r.data),

  // Analytics & Client Telemetry
  trackEvents: (events, anonymousId) =>
    api.post('/analytics/track', { events, anonymousId }).then((r) => r.data),

  // Auth
  login: (userData) => api.post('/auth/login', userData).then((r) => r.data),
  getMe: () => api.get('/auth/me').then((r) => r.data),
  updateProfile: (profileData) => api.patch('/auth/profile', profileData).then((r) => r.data),
}

export default api
