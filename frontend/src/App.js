import React, { useState } from "react";
import "./App.css";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import { AuthProvider, useAuth } from "./AuthContext";

function Main() {
  const { user, loading, logout } = useAuth();
  const [view, setView] = useState('home'); // 'home' | 'profile'

  if (loading) return <div style={{ padding: 24 }}>Đang kiểm tra phiên đăng nhập…</div>;

  return (
    <div className="App">
      <header style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <h1>React Frontend - User Management</h1>
        {user ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>Xin chào, {user.name || user.email}</span>
            {view === 'profile' ? (
              <button onClick={() => setView('home')}>Trang chính</button>
            ) : (
              <button onClick={() => setView('profile')}>Hồ sơ</button>
            )}
            <button onClick={logout}>Đăng xuất</button>
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
          {view === 'profile' ? (
            <Profile />
          ) : (
            <>
              <AddUser />
              <hr />
              <UserList />
            </>
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

