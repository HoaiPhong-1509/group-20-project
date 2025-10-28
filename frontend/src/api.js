export async function getUsers() {
  const res = await fetch('/users');
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
}

export async function createUser({ name, email }) {
  const res = await fetch('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
}