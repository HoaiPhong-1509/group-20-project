import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile, uploadAvatar } from '../api';
import { useAuth } from '../AuthContext';

export default function Profile() {
  const { user, refresh, token, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [avatarMessage, setAvatarMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const p = await getProfile();
        if (mounted) {
          setForm({ name: p.name || '', email: p.email || '' });
        }
      } catch (e) {
        setErr(e.message || 'Không tải được hồ sơ');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const onChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setSaving(true);
    try {
      await updateProfile({ name: form.name.trim(), email: form.email.trim() });
      await refresh(); // cập nhật header “Xin chào, …”
      setMsg('Cập nhật thành công');
    } catch (e) {
      setErr(e.message || 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarSubmit = async (event) => {
    event.preventDefault();
    if (!avatarFile || !token) return;

    setAvatarUploading(true);
    setAvatarError('');
    setAvatarMessage('');

    try {
      const { avatarUrl } = await uploadAvatar(token, avatarFile);
      await refreshUser?.();
      setAvatarFile(null);
      if (avatarUrl) {
        setAvatarMessage('Cập nhật avatar thành công.');
      }
    } catch (err) {
      setAvatarError(err?.message || 'Tải ảnh thất bại.');
    } finally {
      setAvatarUploading(false);
    }
  };

  if (!user) return null;
  if (loading) return <div style={{ padding: 12 }}>Đang tải hồ sơ…</div>;

  return (
    <div className="profile-page">
      <section style={{ padding: 16, border: '1px solid #eee', margin: 16 }}>
        <h2>Hồ sơ cá nhân</h2>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 420, margin: '0 auto' }}>
          <label>
            Tên
            <input name="name" value={form.name} onChange={onChange} />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={onChange} />
          </label>
          {err ? <div style={{ color: 'crimson' }}>{err}</div> : null}
          {msg ? <div style={{ color: 'green' }}>{msg}</div> : null}
          <button type="submit" disabled={saving}>{saving ? 'Đang lưu…' : 'Lưu thay đổi'}</button>
        </form>
      </section>
      <section className="profile-avatar-section">
        <h3>Ảnh đại diện</h3>
        <img
          src={user?.avatarUrl || '/default-avatar.png'}
          alt="Avatar"
          className="profile-avatar"
        />
        <form onSubmit={handleAvatarSubmit} className="avatar-form">
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setAvatarFile(event.target.files?.[0] || null)}
          />
          <button type="submit" disabled={avatarUploading || !avatarFile}>
            {avatarUploading ? 'Đang tải...' : 'Cập nhật ảnh'}
          </button>
        </form>
        {avatarMessage && <p className="auth-success">{avatarMessage}</p>}
        {avatarError && <p className="auth-error">{avatarError}</p>}
      </section>
    </div>
  );
}