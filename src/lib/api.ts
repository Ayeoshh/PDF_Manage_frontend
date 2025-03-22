import axios from 'axios';

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  baseURL: 'https://pdfmanagebackend-production.up.railway.app/api', 
  // baseURL: 'http://localhost:8000/api',

});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  signup: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  resetPassword: (email: string) =>
    api.post('/auth/reset-password', { email }),
  updatePassword: (data: { oldPassword: string; newPassword: string }) =>
    api.post('/auth/update-password', data),
  me: () => api.get('/auth/me'),
};

export const pdfs = {
  // upload: (file: File) => {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   return api.post('/pdfs/upload', formData);
  // },
  upload: (file: File) => {
    const token = localStorage.getItem('token'); // or sessionStorage, depending on where you store it

    const formData = new FormData();
    formData.append('pdf', file);

    return api.post('/pdfs/upload', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getAll: () => api.get('/pdfs/all'),
  get: (id: string) => api.get(`/pdfs/view/pdf/${id}`),
  delete: (id: string) => api.delete(`/pdfs/${id}`),
  // search: (query: string) => api.get(`/pdfs/search?query=${query}`),
  search: (query: string) => api.get(`/pdfs/search?query=${encodeURIComponent(query)}`),
  share: (id: string) => api.post(`/pdfs/share/${id}`),
  getShared: (token: string) => api.get(`/pdfs/shared/${token}`),
};

export const comments = {
  getAll: (pdfId: string) => api.get(`/comments/${pdfId}`),
  create: (pdfId: string, content: string) =>
    api.post(`/comments/${pdfId}`, { content }),
  update: (commentId: string, content: string) =>
    api.put(`/comments/${commentId}`, { content }),
  delete: (commentId: string) => api.delete(`/comments/${commentId}`),
  reply: (commentId: string, content: string) =>
    api.post(`/comments/reply/${commentId}`, { content }),
};

export default api;