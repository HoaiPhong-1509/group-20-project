import React, { useEffect, useState, useCallback } from 'react';
import { getUsers, deleteUser } from '../api';
import { useAuth } from '../AuthContext';

export default function UserList() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setErr('');
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (e) {
      setErr(e.message || 'Load failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener('users-updated', handler);
    return () => window.removeEventListener('users-updated', handler);
  }, [load]);

  const onDelete = async (id) => {
    if (!window.confirm('Xóa user này?')) return;
    try {
      await deleteUser(id);
      setUsers((list) => list.filter((u) => u._id !== id && u.id !== id));
    } catch (e) {
      alert(e.message || 'Delete failed');
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (err) return <div style={{ color: 'crimson' }}>{err}</div>;

  return (
    <div>
      <h3>Danh sách người dùng</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {users.map((u) => {
          const uid = u._id || u.id;
          return (
            <li
              key={uid}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '6px 4px',
                borderBottom: '1px solid #eee',
              }}
            >
              <span style={{ flex: 1 }}>
                {u.name} ({u.email}) - {u.role}
              </span>
              {currentUser?.role === 'admin' && currentUser?.id !== uid && (
                <button
                  onClick={() => onDelete(uid)}
                  style={{ background: '#d32f2f', color: '#fff', border: 'none', padding: '4px 10px', cursor: 'pointer' }}
                >
                  Xóa
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}