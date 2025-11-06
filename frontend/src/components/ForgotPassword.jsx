import React, { useState } from 'react';
import { forgotPassword } from '../api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setMessage('');
    setError('');

    try {
      const data = await forgotPassword(email);
      setMessage(data.message || 'Vui lòng kiểm tra email của bạn.');
    } catch (err) {
      setError(err?.message || 'Không thể gửi yêu cầu.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Quên mật khẩu</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Đang gửi...' : 'Gửi hướng dẫn đặt lại'}
        </button>
      </form>

      {message && <p className="auth-success">{message}</p>}
      {error && <p className="auth-error">{error}</p>}
    </div>
  );
};

export default ForgotPassword;