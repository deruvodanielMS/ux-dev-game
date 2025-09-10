import { createClient } from '@supabase/supabase-js';

// Expected env vars in hosting dashboard (do NOT commit secrets):
// SUPABASE_URL, SUPABASE_SERVICE_ROLE, AUTH0_DOMAIN

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Robust body parsing: some runtimes pre-parse req.body, others don't
    let body: any = (req as any).body;
    if (!body) {
      try {
        const raw = await new Promise<string>((resolve, reject) => {
          let data = '';
          req.on && req.on('data', (chunk: any) => (data += chunk));
          req.on && req.on('end', () => resolve(data));
          req.on && req.on('error', (err: any) => reject(err));
        });
        body = raw ? JSON.parse(raw) : {};
      } catch (e) {
        // ignore parse errors and fallback to empty
        body = {};
      }
    }

    const access_token = body?.access_token;
    if (!access_token) return res.status(400).json({ error: 'Missing access_token' });

    const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

    if (!AUTH0_DOMAIN || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
      return res.status(500).json({ error: 'Server not configured (missing env vars)' });
    }

    // Validate token with Auth0 /userinfo
    const userinfoRes = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userinfoRes.ok) {
      const txt = await userinfoRes.text().catch(() => 'failed to read response');
      return res.status(401).json({ error: 'Invalid access token', details: txt });
    }

    const profile = await userinfoRes.json().catch(() => null);
    if (!profile) return res.status(500).json({ error: 'Failed to parse profile from Auth0' });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

    const id = profile.sub;
    const email = profile.email ?? null;
    const name = profile.name ?? null;
    const avatar = profile.picture ?? null;

    // Upsert into players table (adjust table/fields to your schema)
    const payload: any = { id, email, name, slug: id };
    if (avatar) payload.avatar_url = avatar;

    const { error } = await supabase.from('players').upsert(payload);
    if (error) {
      console.error('Supabase upsert error', error);
      return res.status(500).json({ error: 'Failed to upsert user', details: error.message });
    }

    return res.status(200).json({ ok: true, user: { id, email, name, avatar } });
  } catch (err: any) {
    console.error('auth/verify error', err);
    // don't leak internal error details
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
