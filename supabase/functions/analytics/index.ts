import { createClient } from 'npm:@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}
const clean = (value: unknown, length = 100) => typeof value === 'string' ? value.trim().slice(0, length) : null

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const publicKey = Deno.env.get('ANALYTICS_PUBLISHABLE_KEY')
    if (!publicKey || request.headers.get('apikey') !== publicKey) return json({ error: 'Unauthorized' }, 401)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const secretKey = Deno.env.get('ANALYTICS_SECRET_KEY')!
    const db = createClient(supabaseUrl, secretKey, { auth: { persistSession: false } })
    const body = await request.json()

    if (body.action === 'summary') {
      const { data, error } = await db.rpc('analytics_summary', { p_days: Math.min(Math.max(Number(body.days) || 7, 1), 30) })
      if (error) throw error
      return json(data)
    }
    if (body.action !== 'track' || !/^[0-9a-f-]{36}$/i.test(body.sessionId ?? '')) return json({ error: 'Invalid request' }, 400)

    const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
    let country = 'Unknown'
    if (forwarded && !/^(127\.|10\.|192\.168\.|::1)/.test(forwarded)) {
      try {
        const response = await fetch(`https://api.country.is/${encodeURIComponent(forwarded)}`)
        const result = await response.json()
        if (result.country) country = new Intl.DisplayNames(['en'], { type: 'region' }).of(result.country) || result.country
      } catch { /* Country remains unknown; IP is never stored. */ }
    }
    const { error } = await db.from('analytics_visits').upsert({
      session_id: body.sessionId,
      country,
      source: clean(body.source, 80) || 'direct',
      medium: clean(body.medium, 80),
      campaign: clean(body.campaign),
      content: clean(body.content),
      platform: clean(body.platform, 40) || 'Other',
      device: clean(body.device, 40) || 'Desktop'
    }, { onConflict: 'session_id,visit_date', ignoreDuplicates: true })
    if (error) throw error
    return json({ ok: true })
  } catch (error) {
    console.error(error)
    return json({ error: 'Analytics service error' }, 500)
  }
})

function json(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: { ...cors, 'Content-Type': 'application/json' } })
}
