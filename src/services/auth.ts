export async function syncAuth0User(accessToken: string) {
  try {
    const res = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: accessToken }),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => '<failed to read body>');
      throw new Error(`Sync failed: ${res.status} ${txt}`);
    }

    const data = await res.json().catch(() => null);
    if (!data) throw new Error('Invalid JSON response from auth verify');
    return data;
  } catch (err: unknown) {
    console.error('syncAuth0User error', err);
    throw err;
  }
}
