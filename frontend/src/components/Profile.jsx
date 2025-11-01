import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../api';
import { useAuth } from '../AuthContext';

export default function Profile() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

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

  if (!user) return null;
  if (loading) return <div style={{ padding: 12 }}>Đang tải hồ sơ…</div>;

  return (
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
  );
}