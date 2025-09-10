import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

// Expected env vars in Vercel dashboard (do NOT commit secrets):
// SUPABASE_URL, SUPABASE_SERVICE_ROLE, AUTH0_DOMAIN

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).send({ error: 'Method not allowed' });

  const { access_token } = req.body ?? {};
  if (!access_token) return res.status(400).send({ error: 'Missing access_token' });

  const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

  if (!AUTH0_DOMAIN || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    return res.status(500).send({ error: 'Server not configured (missing env vars)' });
  }

  try {
    // Validate token with Auth0 /userinfo
    const userinfoRes = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userinfoRes.ok) {
      const txt = await userinfoRes.text();
      return res.status(401).send({ error: 'Invalid access token', details: txt });
    }

    const profile = await userinfoRes.json();
    // profile contains: sub (auth0|userid), name, email, picture, etc.

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
      return res.status(500).send({ error: 'Failed to upsert user', details: error.message });
    }

    return res.status(200).send({ ok: true, user: { id, email, name, avatar } });
  } catch (err: any) {
    console.error(err);
    return res.status(500).send({ error: 'Unexpected error', details: err.message });
  }
}
