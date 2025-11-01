import React, { useState } from "react";
import "./App.css";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { AuthProvider, useAuth } from "./AuthContext";
import Profile from "./components/Profile";

function Main() {
  const { user, loading, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = async () => {
    setShowProfile(false);
    await logout();
  };

  if (loading) return <div style={{ padding: 24 }}>Đang kiểm tra phiên đăng nhập…</div>;

  return (
    <div className="App">
      <header style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <h1>React Frontend - User Management</h1>
        {user ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>Xin chào, {user.name || user.email} {user.role ? `(${user.role})` : ''}</span>
            <button
              type="button"
              onClick={() => setShowProfile(v => !v)}
              aria-pressed={showProfile}
              title="Xem/ẩn hồ sơ"
            >
              Hồ sơ
            </button>
            <button onClick={handleLogout}>Đăng xuất</button>
          </div>
        ) : null}
      </header>

      {!user ? (
        <div>
          <Login />
          <Signup />
        </div>
      ) : (
        <>
          {showProfile ? <Profile /> : null}
          {user.role === 'admin' ? (
            <>
              <AddUser />
              <hr />
              <UserList />
            </>
          ) : (
            <div style={{ padding: 16 }}>Bạn không có quyền xem danh sách người dùng.</div>
          )}
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}

export default App;