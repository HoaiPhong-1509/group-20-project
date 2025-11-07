const API_BASE = process.env.REACT_APP_API_URL || '/api';

function buildUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

// Single helper
async function request(path, { method = 'GET', headers = {}, body, token, isForm } = {}) {
  const t = token || localStorage.getItem('token') || null;

  const finalHeaders = {
    ...(isForm ? {} : { 'Content-Type': 'application/json' }),
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
    ...headers,
  };

  const options = { method, headers: finalHeaders };
  if (body !== undefined) {
    options.body = isForm ? body : typeof body === 'string' ? body : JSON.stringify(body);
  }

  const res = await fetch(buildUrl(path), options);
  if (!res.ok) {
    let msg = 'Request failed';
    try {
      const data = await res.json();
      msg = data?.message || msg;
    } catch {
      msg = await res.text().catch(() => msg);
    }
    throw new Error(msg);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

// Auth
export function signup({ name, email, password }) {
  return request('/auth/register', { method: 'POST', body: { name, email, password } });
}

export function login({ email, password }) {
  return request('/auth/login', { method: 'POST', body: { email, password } });
}

export function logout() {
  return request('/auth/logout', { method: 'POST' });
}

export function getMe() {
  return request('/auth/me');
}

// Users (admin)
export function getUsers() {
  return request('/users');
}

<<<<<<< HEAD
export async function updateProfile(payload) {
  return request('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

const getApiBaseUrl = () => process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const forgotPassword = async (email) => {
  const res = await fetch(`${getApiBaseUrl()}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const uploadAvatar = async (token, file) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const res = await fetch(`${getApiBaseUrl()}/users/me/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  if (!res.ok) throw await res.json();
  return res.json();
};
=======
export function createUser({ name, email, password, role }) {
  return request('/users', { method: 'POST', body: { name, email, password, role } });
}

export function updateUser(id, payload) {
  return request(`/users/${id}`, { method: 'PUT', body: payload });
}

export function deleteUser(id) {
  return request(`/users/${id}`, { method: 'DELETE' });
}

// Profile
export function getProfile() {
  return request('/profile');
}

export function updateProfile(payload) {
  return request('/profile', { method: 'PUT', body: payload });
}

export function uploadAvatar(file) {
  const fd = new FormData();
  fd.append('avatar', file);
  return request('/profile/avatar', { method: 'POST', body: fd, isForm: true });
}

// Password reset
export function requestPasswordReset(email) {
  return request('/auth/forgot', { method: 'POST', body: { email } });
}

export function resetPassword({ token, password }) {
  return request('/auth/reset', { method: 'POST', body: { token, password } });
}
>>>>>>> 9459f33e (finish hd 4)
