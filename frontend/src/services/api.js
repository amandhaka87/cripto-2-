import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally — token expired
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  verify2FALogin: (otp, tempToken) => api.post('/auth/2fa/verify-login', { otp }, {
    headers: { Authorization: `Bearer ${tempToken}` },
  }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
}

// 2FA Setup
export const twoFAAPI = {
  generate: () => api.post('/user/2fa/generate'),
  enable: (otp) => api.post('/user/2fa/enable', { otp }),
  disable: (otp) => api.post('/user/2fa/disable', { otp }),
}

// User
export const userAPI = {
  getDashboard: () => api.get('/user/dashboard'),
  getTransactions: (page = 1) => api.get(`/user/transactions?page=${page}`),
  updateProfile: (data) => api.put('/user/profile', data),
  getReferrals: () => api.get('/user/referrals'),
  requestWithdrawal: (data) => api.post('/user/withdraw', data),
  getWithdrawals: () => api.get('/user/withdrawals'),
}

// Plans
export const planAPI = {
  getInfo: () => api.get('/plans/info'),
  activate: (data) => api.post('/plans/activate', data),
}

// Deposit
export const depositAPI = {
  getWalletInfo: () => api.get('/deposit/wallet-info'),
  submit: (data) => api.post('/deposit/submit', data),
  getPending: () => api.get('/deposit/pending'),
  confirm: (txId) => api.patch(`/deposit/${txId}/confirm`),
  reject: (txId, reason) => api.patch(`/deposit/${txId}/reject`, { reason }),
}

// Leaderboard & Spin
export const leaderboardAPI = {
  getTopReferrals: () => api.get('/leaderboard/referrals'),
  getTopInvestors: () => api.get('/leaderboard/investors'),
  getMyRank: () => api.get('/leaderboard/my-rank'),
  spin: () => api.post('/leaderboard/spin'),
}

// Notifications
export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllRead: () => api.patch('/notifications/read-all'),
}

// Admin
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateKYC: (userId, data) => api.patch(`/admin/users/${userId}/kyc`, data),
  toggleUser: (userId) => api.patch(`/admin/users/${userId}/toggle`),
  creditROI: (userId) => api.post(`/admin/users/${userId}/credit-roi`),
  getPendingWithdrawals: () => api.get('/admin/withdrawals'),
  approveWithdrawal: (txId, txHash) => api.patch(`/admin/withdrawals/${txId}/approve`, { txHash }),
  rejectWithdrawal: (txId, reason) => api.patch(`/admin/withdrawals/${txId}/reject`, { reason }),
}

export default api
