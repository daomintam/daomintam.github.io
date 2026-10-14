import { useEffect, useState } from 'react'
import { analyticsReady, AnalyticsSummary, loadSummary, trackVisit } from '../lib/analytics'

const empty: AnalyticsSummary = { total: 0, today: 0, daily: [], countries: [], sources: [], platforms: [] }
const ranges = [{ en: '7 days', vi: '7 ngày', days: 7 }, { en: '30 days', vi: '30 ngày', days: 30 }, { en: '6 months', vi: '6 tháng', days: 183 }, { en: '1 year', vi: '1 năm', days: 365 }]

function chartPoints(data: AnalyticsSummary['daily'], days: number, language: 'en' | 'vi') {
  const locale = language === 'vi' ? 'vi-VN' : 'en'
  if (days <= 30) return data.map((item) => ({ key: item.date, value: item.views, label: new Date(`${item.date}T00:00:00`).toLocaleDateString(locale, days === 7 ? { weekday: 'short' } : { day: 'numeric' }) }))
  const months = new Map<string, number>()
  data.forEach((item) => { const key = item.date.slice(0, 7); months.set(key, (months.get(key) ?? 0) + item.views) })
  return [...months].map(([key, value]) => ({ key, value, label: new Date(`${key}-01T00:00:00`).toLocaleDateString(locale, { month: 'short' }) }))
}

function Ranking({ title, values, emptyLabel }: { title: string; values: { label: string; value: number }[]; emptyLabel: string }) {
  const max = Math.max(...values.map((item) => item.value), 1)
  return <section className="analytics-ranking"><h3>{title}</h3>{values.length ? values.map((item) => <div className="analytics-rank" key={item.label}>
    <span>{item.label}</span><i><b style={{ width: `${item.value / max * 100}%` }} /></i><strong>{item.value}</strong>
  </div>) : <p>{emptyLabel}</p>}</section>
}

function Calendar30({ days, language }: { days: AnalyticsSummary['daily']; language: 'en' | 'vi' }) {
  const vi = language === 'vi'
  const locale = vi ? 'vi-VN' : 'en'
  const firstDate = days[0] ? new Date(`${days[0].date}T00:00:00`) : null
  const blanks = firstDate ? firstDate.getDay() : 0
  return <section className="analytics-calendar"><h3>{vi ? '30 ngày gần nhất' : 'Last 30 days'}</h3>
    <div className="calendar-weekdays" aria-hidden="true">{(vi ? ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).map((day) => <span key={day}>{day}</span>)}</div>
    <div className="calendar-grid">
      {Array.from({ length: blanks }, (_, index) => <i className="calendar-blank" key={`blank-${index}`} />)}
      {days.map((item) => {
        const date = new Date(`${item.date}T00:00:00`)
        const detail = `${date.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} · ${item.views.toLocaleString(locale)} ${vi ? 'lượt truy cập' : item.views === 1 ? 'visit' : 'visits'}`
        return <article className={item.views ? 'has-visits' : ''} key={item.date} tabIndex={0} aria-label={detail} data-tooltip={detail}>
          <span>{date.getDate()}</span><strong>{item.views}</strong>
        </article>
      })}
    </div>
  </section>
}

export function AnalyticsWidget({ language }: { language: 'en' | 'vi' }) {
  const vi = language === 'vi'
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(empty)
  const [error, setError] = useState('')
  const [range, setRange] = useState(ranges[0])
  const configured = analyticsReady()
  const chart = chartPoints(data.daily, range.days, language)
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
      loadSummary(range.days).then(setData).catch(() => setError(vi ? 'Không thể tải dữ liệu.' : 'Unable to load analytics.')).finally(() => setLoading(false))
    }
    return () => window.removeEventListener('keydown', close)
  }, [open, configured, range, vi])

  return <>
    <button className="analytics-trigger" onClick={() => setOpen(true)} aria-label={vi ? 'Xem lưu lượng truy cập' : 'View visitor analytics'} title={vi ? 'Lưu lượng truy cập' : 'Visitor analytics'}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V9m6 10V5m6 14v-7m4 7H2" /></svg>
    </button>
    {open && <div className="analytics-overlay" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
      <div className="analytics-modal" role="dialog" aria-modal="true" aria-labelledby="analytics-title">
        <button className="analytics-close" onClick={() => setOpen(false)} aria-label={vi ? 'Đóng thống kê' : 'Close analytics'}>×</button>
        <p className="analytics-eyebrow">TΛMVERSE SIGNALS</p><h2 id="analytics-title">{vi ? 'Lưu lượng truy cập' : 'Visitor flow'}</h2>
        <div className="analytics-ranges" aria-label={vi ? 'Khoảng thời gian thống kê' : 'Analytics period'}>{ranges.map((item) => <button className={range.days === item.days ? 'active' : ''} key={item.days} onClick={() => setRange(item)}>{vi ? item.vi : item.en}</button>)}</div>
        {!configured ? <div className="analytics-setup"><strong>{vi ? 'Cần thiết lập Supabase' : 'Supabase setup required'}</strong><p>{vi ? 'Dashboard đã sẵn sàng. Hãy thêm URL dự án và khóa publishable vào ' : 'The dashboard is ready. Add your project URL and publishable key to '}<code>analytics-config.js</code>.</p></div> : loading ? <p className="analytics-state">{vi ? 'Đang tải dữ liệu…' : 'Loading signals…'}</p> : error ? <p className="analytics-state">{error}</p> : <>
          <div className="analytics-totals"><article><strong>{data.total.toLocaleString()}</strong><span>{vi ? 'Tổng lượt truy cập' : 'Total visits'}</span></article><article><strong>{data.today.toLocaleString()}</strong><span>{vi ? 'Hôm nay' : 'Today'}</span></article></div>
          {range.days === 30 ? <Calendar30 days={data.daily} language={language} /> : <section className="analytics-days"><h3>{vi ? `${vi ? range.vi : range.en} gần nhất` : `Last ${range.en}`}</h3><div style={{ gridTemplateColumns: `repeat(${chart.length}, minmax(18px, 1fr))` }}>{chart.map((item) => <article key={item.key}><i style={{ height: `${Math.max(8, item.value / chartMax * 100)}%` }} /><span>{item.label}</span><b>{item.value}</b></article>)}</div></section>}
          <div className="analytics-grid"><Ranking title={vi ? 'Quốc gia' : 'Countries'} values={data.countries} emptyLabel={vi ? 'Chưa có dữ liệu' : 'No data yet'} /><Ranking title={vi ? 'Nguồn' : 'Sources'} values={data.sources} emptyLabel={vi ? 'Chưa có dữ liệu' : 'No data yet'} /><Ranking title={vi ? 'Nền tảng' : 'Platforms'} values={data.platforms} emptyLabel={vi ? 'Chưa có dữ liệu' : 'No data yet'} /></div>
        </>}
        <p className="analytics-privacy">{vi ? 'Chỉ đếm ẩn danh · Không lưu địa chỉ IP' : 'Anonymous counts only · IP addresses are not stored'}</p>
      </div>
    </div>}
  </>
}
