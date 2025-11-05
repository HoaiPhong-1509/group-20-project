// Small helper to handle fetch with JSON and cookies (dev proxy -> same origin)
async function request(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let msg = 'Request failed';
    try {
      const data = await res.json();
      msg = data?.message || msg;
    } catch (_) {}
    throw new Error(msg);
  }
  // Some endpoints may return empty JSON
  try {
    return await res.json();
  } catch (_) {
    return null;
  }
}

const BASE = process.env.REACT_APP_API_URL || '';

// Users
export async function getUsers(token) {
    const res = await fetch(`${BASE}/users`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
        },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function createUser({ name, email }) {
  return request('/users', {
    method: 'POST',
    body: JSON.stringify({ name, email }),
  });
}

export async function deleteUser(userId, token) {
    const res = await fetch(`${BASE}/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
        },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

// Auth
export async function signup({ name, email, password }) {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login({ email, password }) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return request('/auth/logout', { method: 'POST' });
}

export async function getMe() {
  return request('/auth/me');
}

// Profile
export async function getProfile() {
  return request('/api/profile');
}

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