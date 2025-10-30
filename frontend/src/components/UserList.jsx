import React, { useEffect, useState } from "react";
import { getUsers } from "../api";

export default function UserList() {
  const [users, setUsers] = useState([]);

  const load = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    load();
    const h = () => load();
    window.addEventListener("users-updated", h);
    return () => window.removeEventListener("users-updated", h);
  }, []);

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {users.map((u) => (
        <li key={u._id || u.id}>
          {u.name}
          {u.email ? ` - ${u.email}` : ""}
        </li>
      ))}
    </ul>
  );
}