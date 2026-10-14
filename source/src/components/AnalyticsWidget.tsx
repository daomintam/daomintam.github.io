import { useEffect, useState } from 'react'
import { analyticsReady, AnalyticsSummary, loadSummary, trackVisit } from '../lib/analytics'

const empty: AnalyticsSummary = { total: 0, today: 0, daily: [], countries: [], sources: [], platforms: [] }

function Ranking({ title, values }: { title: string; values: { label: string; value: number }[] }) {
  const max = Math.max(...values.map((item) => item.value), 1)
  return <section className="analytics-ranking"><h3>{title}</h3>{values.length ? values.map((item) => <div className="analytics-rank" key={item.label}>
    <span>{item.label}</span><i><b style={{ width: `${item.value / max * 100}%` }} /></i><strong>{item.value}</strong>
  </div>) : <p>No data yet</p>}</section>
}

export function AnalyticsWidget() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(empty)
  const [error, setError] = useState('')
  const configured = analyticsReady()

  useEffect(() => { trackVisit().catch(() => undefined) }, [])
  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', close)
    if (configured) {
      setLoading(true); setError('')
      loadSummary().then(setData).catch(() => setError('Unable to load analytics.')).finally(() => setLoading(false))
    }
    return () => window.removeEventListener('keydown', close)
  }, [open, configured])

  return <>
    <button className="analytics-trigger" onClick={() => setOpen(true)} aria-label="View visitor analytics" title="Visitor analytics">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V9m6 10V5m6 14v-7m4 7H2" /></svg>
    </button>
    {open && <div className="analytics-overlay" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
      <div className="analytics-modal" role="dialog" aria-modal="true" aria-labelledby="analytics-title">
        <button className="analytics-close" onClick={() => setOpen(false)} aria-label="Close analytics">×</button>
        <p className="analytics-eyebrow">TΛMVERSE SIGNALS</p><h2 id="analytics-title">Visitor flow</h2>
        {!configured ? <div className="analytics-setup"><strong>Supabase setup required</strong><p>The dashboard is ready. Add your project URL and publishable key to <code>analytics-config.js</code> after completing the included setup guide.</p></div> : loading ? <p className="analytics-state">Loading signals…</p> : error ? <p className="analytics-state">{error}</p> : <>
          <div className="analytics-totals"><article><strong>{data.total.toLocaleString()}</strong><span>Total visits</span></article><article><strong>{data.today.toLocaleString()}</strong><span>Today</span></article></div>
          <section className="analytics-days"><h3>Last 7 days</h3><div>{data.daily.map((day) => <article key={day.date}><i style={{ height: `${Math.max(8, day.views / Math.max(...data.daily.map((item) => item.views), 1) * 100)}%` }} /><span>{new Date(`${day.date}T00:00:00`).toLocaleDateString('en', { weekday: 'short' })}</span><b>{day.views}</b></article>)}</div></section>
          <div className="analytics-grid"><Ranking title="Countries" values={data.countries} /><Ranking title="Sources" values={data.sources} /><Ranking title="Platforms" values={data.platforms} /></div>
        </>}
        <p className="analytics-privacy">Anonymous counts only · IP addresses are not stored</p>
      </div>
    </div>}
  </>
}
