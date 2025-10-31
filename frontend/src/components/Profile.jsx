import React, { useEffect, useState } from 'react';
import { getProfile } from '../api';
import { useAuth } from '../AuthContext';

export default function Profile() {
  const { updateProfile: updateProfileCtx } = useAuth();
  const [initial, setInitial] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const me = await getProfile();
        if (!mounted) return;
        setInitial(me);
        setName(me?.name || '');
        setEmail(me?.email || '');
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Không tải được hồ sơ');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess('');

    const payload = {};
    if (name !== initial?.name) payload.name = name.trim();
    if (email !== initial?.email) payload.email = email.trim();

    if (!Object.keys(payload).length) {
      setSuccess('Không có thay đổi nào để lưu');
      return;
    }

    setSaving(true);
    try {
      const updated = await updateProfileCtx(payload);
      setInitial(updated);
      setSuccess('Cập nhật hồ sơ thành công');
    } catch (err) {
      setError(err.message || 'Cập nhật hồ sơ thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 16 }}>Đang tải hồ sơ…</div>;

  return (
    <section style={{ padding: 16 }}>
      <h2>Hồ sơ cá nhân</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10, maxWidth: 420 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Họ tên</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ tên"
          />
        </label>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
          />
        </label>
        {error ? <div style={{ color: 'crimson' }}>{error}</div> : null}
        {success ? <div style={{ color: 'seagreen' }}>{success}</div> : null}
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={saving}>{saving ? 'Đang lưu…' : 'Lưu thay đổi'}</button>
        </div>
      </form>
    </section>
  );
}
