import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { requestPasswordReset, resetPassword } from '../api';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');

  // form quên mật khẩu
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  // form đặt lại mật khẩu
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [resetting, setResetting] = useState(false);

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const onSend = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    if (!email.trim()) return setErr('Hãy nhập email');
    setSending(true);
    try {
      await requestPasswordReset(email.trim());
      setMsg('Email đặt lại đã được gửi (kiểm tra Inbox/Spam).');
    } catch (e) {
      setErr(e.message || 'Gửi thất bại');
    } finally {
      setSending(false);
    }
  };

  const onReset = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    if (!password || password.length < 6) return setErr('Mật khẩu >= 6 ký tự');
    if (password !== confirm) return setErr('Mật khẩu không khớp');
    setResetting(true);
    try {
      await resetPassword({ token, password });
      setMsg('Đổi mật khẩu thành công. Hãy đăng nhập lại.');
      setPassword(''); setConfirm('');
    } catch (e) {
      setErr(e.message || 'Đổi mật khẩu thất bại');
    } finally {
      setResetting(false);
    }
  };

  if (token) {
    // Trang đặt lại mật khẩu
    return (
      <div style={{ maxWidth: 420, margin: '40px auto' }}>
        <h2>Đặt lại mật khẩu</h2>
        {msg && <p style={{ color: 'green' }}>{msg}</p>}
        {err && <p style={{ color: 'crimson' }}>{err}</p>}
        <form onSubmit={onReset}>
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 8, marginBottom: 8 }}
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={{ width: '100%', padding: 8, marginBottom: 8 }}
          />
          <button type="submit" disabled={resetting}>
            {resetting ? 'Đang đổi...' : 'Đổi mật khẩu'}
          </button>
        </form>
      </div>
    );
  }

  // Trang yêu cầu quên mật khẩu
  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2>Quên mật khẩu</h2>
      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {err && <p style={{ color: 'crimson' }}>{err}</p>}
      <form onSubmit={onSend}>
        <input
          type="email"
          placeholder="Email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8 }}
        />
        <button type="submit" disabled={sending}>
          {sending ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
        </button>
      </form>
    </div>
  );
}