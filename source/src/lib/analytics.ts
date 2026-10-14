export type Metric = { label: string; value: number }
export type DailyMetric = { date: string; views: number }
export type AnalyticsSummary = {
  total: number
  today: number
  daily: DailyMetric[]
  countries: Metric[]
  sources: Metric[]
  platforms: Metric[]
}

declare global {
  interface Window {
    TAMVERSE_ANALYTICS?: { supabaseUrl?: string; publishableKey?: string }
  }
}

const config = () => window.TAMVERSE_ANALYTICS ?? {}

export const analyticsReady = () => Boolean(config().supabaseUrl && config().publishableKey)

function platform() {
  const ua = navigator.userAgent
  if (/android/i.test(ua)) return 'Android'
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS'
  if (/Windows/i.test(ua)) return 'Windows'
  if (/Macintosh|Mac OS X/i.test(ua)) return 'macOS'
  if (/Linux/i.test(ua)) return 'Linux'
  return 'Other'
}

function device() {
  const ua = navigator.userAgent
  if (/iPad|Tablet/i.test(ua)) return 'Tablet'
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return 'Mobile'
  return 'Desktop'
}

function source() {
  const params = new URLSearchParams(location.search)
  const tagged = params.get('platform') || params.get('utm_source')
  if (tagged) return tagged.slice(0, 80).toLowerCase()
  if (!document.referrer) return 'direct'
  try { return new URL(document.referrer).hostname.replace(/^www\./, '').slice(0, 80) }
  catch { return 'referral' }
}

async function request(body: Record<string, unknown>) {
  const { supabaseUrl = '', publishableKey = '' } = config()
  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/functions/v1/analytics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: publishableKey, Authorization: `Bearer ${publishableKey}` },
    body: JSON.stringify(body)
  })
  if (!response.ok) throw new Error(`Analytics request failed: ${response.status}`)
  return response.json()
}

export async function trackVisit() {
  if (!analyticsReady() || sessionStorage.getItem('tamverse-visit-sent')) return
  const sessionId = sessionStorage.getItem('tamverse-session') || crypto.randomUUID()
  sessionStorage.setItem('tamverse-session', sessionId)
  const params = new URLSearchParams(location.search)
  await request({
    action: 'track', sessionId, source: source(), platform: platform(), device: device(),
    medium: params.get('utm_medium')?.slice(0, 80) || null,
    campaign: params.get('utm_campaign')?.slice(0, 100) || null,
    content: params.get('utm_content')?.slice(0, 100) || null
  })
  sessionStorage.setItem('tamverse-visit-sent', '1')
}

export async function loadSummary(days = 7): Promise<AnalyticsSummary> {
  if (!analyticsReady()) throw new Error('Analytics is not configured')
  return request({ action: 'summary', days })
}
