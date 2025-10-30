import React from "react";
import "./App.css";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { AuthProvider, useAuth } from "./AuthContext";

function Main() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div style={{ padding: 24 }}>Đang kiểm tra phiên đăng nhập…</div>;

  return (
    <div className="App">
      <header style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <h1>React Frontend - User Management</h1>
        {user ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>Xin chào, {user.name || user.email}</span>
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
          <AddUser />
          <hr />
          <UserList />
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

