export async function syncAuth0User(accessToken: string) {
  const res = await fetch('/api/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ access_token: accessToken }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Sync failed: ${res.status} ${txt}`);
  }

  return res.json();
}
