"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";

export default function AccountPage() {
  const { currentUser, updateProfile, logout } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (currentUser) {
      setTimeout(() => setName(currentUser.name ?? ""), 0);
      setTimeout(() => setEmail(currentUser.email), 0);
    }
  }, [currentUser]);

  if (!currentUser)
    return (
      <main>
        <p>Loading account…</p>
      </main>
    );

  const onSave = () => updateProfile({ name, email });

  return (
    <main>
      <h1>My Account</h1>
      <div style={{ margin: "8px 0" }}>
        <p>
          <strong>Logged in as:</strong> {currentUser.email}
        </p>
        <p>
          <strong>Role:</strong> {currentUser.role}
        </p>
      </div>
      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Email
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <div>
        <button onClick={onSave}>Save</button>
        <button onClick={logout}>Logout</button>
      </div>
    </main>
  );
}
