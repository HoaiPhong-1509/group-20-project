import React, { useState } from 'react';
import { uploadAvatar } from '../api';
import { useAuth } from '../AuthContext';

export default function UpdateAvatar() {
  const { updateUser, refreshMe } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const onSelect = (e) => {
    setErr('');
    const f = e.target.files?.[0];
    setFile(f || null);
  };

  const onUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setErr(''); setMsg('');
    try {
      const res = await uploadAvatar(file); // { avatarUrl }
      const url = res?.avatarUrl ? `${res.avatarUrl}?t=${Date.now()}` : '';
      if (url) {
        // Cập nhật ngay vào context (và localStorage)
        updateUser({ avatarUrl: url });
        // Phát event cho các component khác (Profile) nếu họ tự load profile
        window.dispatchEvent(new Event('profile-updated'));
      }
      // Đồng bộ lại từ server (nếu muốn chắc chắn)
      try { await refreshMe(); } catch {}
      setMsg('Cập nhật ảnh đại diện thành công.');
      setFile(null);
    } catch (e) {
      setErr(e.message || 'Tải lên thất bại');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={onUpload}>
      <input type="file" accept="image/*" onChange={onSelect} />
      <button type="submit" disabled={!file || uploading}>
        {uploading ? 'Đang tải...' : 'Cập nhật ảnh'}
      </button>
      {msg && <div style={{ color: 'green' }}>{msg}</div>}
      {err && <div style={{ color: 'crimson' }}>{err}</div>}
    </form>
  );
}