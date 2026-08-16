"use client";
import React, { useEffect, useState } from 'react';

export default function UsersAdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/users', { credentials: 'same-origin' });
      const data = await res.json();
      setUsers(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h1 className="text-2xl mb-4">Users</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="space-y-2">
          {users.map((u) => (
            <li key={u.id} className="p-3 bg-white rounded shadow-sm">{u.name} — {u.email}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
