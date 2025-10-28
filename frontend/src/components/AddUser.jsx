import React, { useState } from "react";
import { createUser } from "../api";

export default function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    try {
      await createUser({ name: name.trim(), email: email.trim() });
      setName("");
      setEmail("");
      window.dispatchEvent(new Event("users-updated"));
    } catch (err) {
      console.error(err);
      alert("Create user failed");
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "flex",
        gap: 8,
        justifyContent: "center",
      }}
    >
      <input
        type="text"
        placeholder="Enter user name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}