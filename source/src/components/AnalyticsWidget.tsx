import { useEffect, useState } from 'react'
import { analyticsReady, AnalyticsSummary, loadSummary, trackVisit } from '../lib/analytics'

const empty: AnalyticsSummary = { total: 0, today: 0, daily: [], countries: [], sources: [], platforms: [] }
const ranges = [{ label: '7 days', days: 7 }, { label: '30 days', days: 30 }, { label: '6 months', days: 183 }, { label: '1 year', days: 365 }]

function chartPoints(data: AnalyticsSummary['daily'], days: number) {
  if (days <= 30) return data.map((item) => ({ key: item.date, value: item.views, label: new Date(`${item.date}T00:00:00`).toLocaleDateString('en', days === 7 ? { weekday: 'short' } : { day: 'numeric' }) }))
  const months = new Map<string, number>()
  data.forEach((item) => { const key = item.date.slice(0, 7); months.set(key, (months.get(key) ?? 0) + item.views) })
  return [...months].map(([key, value]) => ({ key, value, label: new Date(`${key}-01T00:00:00`).toLocaleDateString('en', { month: 'short' }) }))
}

function Ranking({ title, values }: { title: string; values: { label: string; value: number }[] }) {
  const max = Math.max(...values.map((item) => item.value), 1)
  return <section className="analytics-ranking"><h3>{title}</h3>{values.length ? values.map((item) => <div className="analytics-rank" key={item.label}>
    <span>{item.label}</span><i><b style={{ width: `${item.value / max * 100}%` }} /></i><strong>{item.value}</strong>
  </div>) : <p>No data yet</p>}</section>
}

function Calendar30({ days }: { days: AnalyticsSummary['daily'] }) {
  const firstDate = days[0] ? new Date(`${days[0].date}T00:00:00`) : null
  const blanks = firstDate ? firstDate.getDay() : 0
  return <section className="analytics-calendar"><h3>Last 30 days</h3>
    <div className="calendar-weekdays" aria-hidden="true">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day}</span>)}</div>
    <div className="calendar-grid">
      {Array.from({ length: blanks }, (_, index) => <i className="calendar-blank" key={`blank-${index}`} />)}
      {days.map((item) => {
        const date = new Date(`${item.date}T00:00:00`)
        const detail = `${date.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} · ${item.views.toLocaleString()} ${item.views === 1 ? 'visit' : 'visits'}`
        return <article className={item.views ? 'has-visits' : ''} key={item.date} tabIndex={0} aria-label={detail} data-tooltip={detail}>
          <span>{date.getDate()}</span><strong>{item.views}</strong>
        </article>
      })}
    </div>
  </section>
}

export function AnalyticsWidget() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(empty)
  const [error, setError] = useState('')
  const [range, setRange] = useState(ranges[0])
  const configured = analyticsReady()
  const chart = chartPoints(data.daily, range.days)
  const chartMax = Math.max(...chart.map((item) => item.value), 1)

  useEffect(() => { trackVisit().catch(() => undefined) }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('analytics-open', open)
    return () => document.documentElement.classList.remove('analytics-open')
  }, [open])
  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', close)
    if (configured) {
      setLoading(true); setError('')
      loadSummary(range.days).then(setData).catch(() => setError('Unable to load analytics.')).finally(() => setLoading(false))
    }
    return () => window.removeEventListener('keydown', close)
  }, [open, configured, range])

  return <>
    <button className="analytics-trigger" onClick={() => setOpen(true)} aria-label="View visitor analytics" title="Visitor analytics">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V9m6 10V5m6 14v-7m4 7H2" /></svg>
    </button>
    {open && <div className="analytics-overlay" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
      <div className="analytics-modal" role="dialog" aria-modal="true" aria-labelledby="analytics-title">
        <button className="analytics-close" onClick={() => setOpen(false)} aria-label="Close analytics">×</button>
        <p className="analytics-eyebrow">TΛMVERSE SIGNALS</p><h2 id="analytics-title">Visitor flow</h2>
        <div className="analytics-ranges" aria-label="Analytics period">{ranges.map((item) => <button className={range.days === item.days ? 'active' : ''} key={item.days} onClick={() => setRange(item)}>{item.label}</button>)}</div>
        {!configured ? <div className="analytics-setup"><strong>Supabase setup required</strong><p>The dashboard is ready. Add your project URL and publishable key to <code>analytics-config.js</code> after completing the included setup guide.</p></div> : loading ? <p className="analytics-state">Loading signals…</p> : error ? <p className="analytics-state">{error}</p> : <>
          <div className="analytics-totals"><article><strong>{data.total.toLocaleString()}</strong><span>Total visits</span></article><article><strong>{data.today.toLocaleString()}</strong><span>Today</span></article></div>
          {range.days === 30 ? <Calendar30 days={data.daily} /> : <section className="analytics-days"><h3>Last {range.label}</h3><div style={{ gridTemplateColumns: `repeat(${chart.length}, minmax(18px, 1fr))` }}>{chart.map((item) => <article key={item.key}><i style={{ height: `${Math.max(8, item.value / chartMax * 100)}%` }} /><span>{item.label}</span><b>{item.value}</b></article>)}</div></section>}
          <div className="analytics-grid"><Ranking title="Countries" values={data.countries} /><Ranking title="Sources" values={data.sources} /><Ranking title="Platforms" values={data.platforms} /></div>
        </>}
        <p className="analytics-privacy">Anonymous counts only · IP addresses are not stored</p>
      </div>
    </div>}
  </>
}
