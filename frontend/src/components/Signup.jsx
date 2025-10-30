import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || password.length < 6) {
      return setError('Vui lòng nhập tên, email và mật khẩu tối thiểu 6 ký tự');
    }
    setSubmitting(true);
    try {
      await signup({ name: name.trim(), email: email.trim(), password });
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 360, margin: '16px auto' }}>
      <h2>Đăng ký</h2>
      <input
        type="text"
        placeholder="Họ tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="username"
      />
      <input
        type="password"
        placeholder="Mật khẩu (>= 6 ký tự)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
      />
      {error ? <div style={{ color: 'crimson' }}>{error}</div> : null}
      <button disabled={submitting} type="submit">{submitting ? 'Đang đăng ký...' : 'Đăng ký'}</button>
    </form>
  );
}
