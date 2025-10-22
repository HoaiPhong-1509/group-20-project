import React from "react";
import "./App.css";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";

function App() {
  return (
    <div className="App">
      <h1>React Frontend - User Management</h1>
      <AddUser />
      <hr />
      <UserList />
    </div>
  );
}

export default App;

