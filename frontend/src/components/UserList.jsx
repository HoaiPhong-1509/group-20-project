import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { getUsers, deleteUser } from '../api';

export default function UserList() {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    let mounted = true;
    setLoading(true);
    getUsers(token)
      .then(data => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : data.users || [];
        setUsers(list);
      })
      .catch(e => mounted && setError(e.message || 'Lỗi khi tải danh sách'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [user, token]);

  if (!user) return <div>Vui lòng đăng nhập.</div>;
  if (user.role !== 'admin') return <div>Bạn không có quyền truy cập trang này.</div>;

  const canDelete = (u) => {
    const id = u._id || u.id;
    const me = user._id || user.id;
    if (!id) return false;
    if (id === me) return false;       
    if (u.role === 'admin') return false; 
    return true;
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa người dùng này?')) return;
    try {
      setDeletingId(id);
      await deleteUser(id, token);
      setUsers(prev => prev.filter(u => (u._id || u.id) !== id));
    } catch (e) {
      alert('Xóa thất bại: ' + (e.message || e));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ padding: 12 }}>
      <h2>Danh sách người dùng</h2>
      {loading && <div>Đang tải...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>Tên</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Email</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Role</th>
              <th style={{ padding: 8 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const id = u._id || u.id;
              const deletable = canDelete(u);
              const title =
                !deletable
                  ? (id === (user._id || user.id)
                      ? 'Không thể xóa chính bạn'
                      : u.role === 'admin'
                        ? 'Không thể xóa admin khác'
                        : '')
                  : '';
              return (
                <tr key={id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: 8 }}>{u.name || u.username || '-'}</td>
                  <td style={{ padding: 8 }}>{u.email || '-'}</td>
                  <td style={{ padding: 8 }}>{u.role || '-'}</td>
                  <td style={{ padding: 8, textAlign: 'center' }}>
                    <button
                      type="button"
                      title={title}
                      onClick={() => deletable && handleDelete(id)}
                      disabled={deletingId === id || !deletable}
                    >
                      {deletingId === id ? 'Đang xóa...' : 'Xóa'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}