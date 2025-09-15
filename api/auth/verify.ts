import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Define types for request and response to avoid 'any'
interface ApiRequest {
  method?: string;
  body?: {
    access_token?: string;
  };
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
}

interface ApiResponse {
  status: (code: number) => {
    json: (data: object) => void;
  };
}

// Expected env vars in hosting dashboard (do NOT commit secrets):
// SUPABASE_URL, SUPABASE_SERVICE_ROLE, AUTH0_DOMAIN

export default async function handler(req: ApiRequest, res: ApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Robust body parsing: some runtimes pre-parse req.body, others don't
    let body: { access_token?: string } | undefined = req.body;
    if (!body) {
      try {
        const raw = await new Promise<string>((resolve, reject) => {
          let data = '';
          if (req.on) {
            req.on('data', (chunk: unknown) => (data += chunk));
            req.on('end', () => resolve(data));
            req.on('error', (err: unknown) => reject(err));
          } else {
            resolve('');
          }
        });
        body = raw ? JSON.parse(raw) : {};
      } catch {
        // ignore parse errors and fallback to empty
        body = {};
      }
    }

    const access_token = body?.access_token;
    if (!access_token) {
      return res.status(400).json({ error: 'Missing access_token' });
    }

    const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

    if (!AUTH0_DOMAIN || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
      return res
        .status(500)
        .json({ error: 'Server not configured (missing env vars)' });
    }

    // Validate token with Auth0 /userinfo
    const userinfoRes = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userinfoRes.ok) {
      const txt = await userinfoRes
        .text()
        .catch(() => 'failed to read response');
      return res
        .status(401)
        .json({ error: 'Invalid access token', details: txt });
    }

    const profile = await userinfoRes.json().catch(() => null);
    if (!profile) {
      return res
        .status(500)
        .json({ error: 'Failed to parse profile from Auth0' });
    }

    const supabase: SupabaseClient = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE,
    );

    const id = profile.sub;
    const email = profile.email ?? null;
    const name = profile.name ?? null;
    const avatar = profile.picture ?? null;

    // Upsert into players table (adjust table/fields to your schema)
    const payload: {
      id: string;
      email: string | null;
      name: string | null;
      slug: string;
      avatar_url?: string;
    } = { id, email, name, slug: id };
    if (avatar) payload.avatar_url = avatar;

    const { error } = await supabase.from('players').upsert(payload);
    if (error) {
      console.error('Supabase upsert error', error);
      return res
        .status(500)
        .json({ error: 'Failed to upsert user', details: error.message });
    }

    return res
      .status(200)
      .json({ ok: true, user: { id, email, name, avatar } });
  } catch (err: unknown) {
    console.error('auth/verify error', err);
    // don't leak internal error details
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
