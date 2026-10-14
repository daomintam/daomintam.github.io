import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { incidents, type Incident } from '../data/incidents'
import { useChapterRail } from '../lib/useChapterRail'
import { IncidentVisual } from '../components/IncidentVisual'
import { AnalyticsWidget } from '../components/AnalyticsWidget'

const stages = ['Chuyện gì xảy ra?', 'Cách ứng phó', 'Bài học']

function CaseScene({ incident, index }: { incident: Incident; index: number }) {
  const [stage, setStage] = useState(0)
  return <article className="case-scene" style={{ '--case-color': incident.color } as CSSProperties} aria-labelledby={`case-title-${index}`}>
    <section className="case-intro">
      <p className="case-dateline"><span>{incident.chain}</span><time dateTime={incident.isoDate}>{incident.date}</time></p>
      <p className="atlas-eyebrow">HỒ SƠ {String(index + 1).padStart(2, '0')} / {incident.category}</p>
      <h1 id={`case-title-${index}`}>{incident.title}</h1>
      <p className="case-lead">{incident.lead}</p>
    </section>
    <div className="case-evidence">
      <div className="case-diagram"><IncidentVisual incident={incident} responding={stage > 0} /></div>
      <div className="case-metric"><b>{incident.metric}</b><span>{incident.metricLabel}</span></div>
    </div>
    <section className="case-reading" aria-label={`Diễn biến ${incident.chain}`}>
      <div className="case-tabs" role="tablist" aria-label="Các góc nhìn">{stages.map((label, tab) => <button key={label} id={`case-${index}-tab-${tab}`} role="tab" aria-selected={stage === tab} aria-controls={`case-${index}-panel`} onClick={() => setStage(tab)} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); const next = (tab + (event.key === 'ArrowRight' ? 1 : -1) + stages.length) % stages.length; setStage(next); document.getElementById(`case-${index}-tab-${next}`)?.focus() } }} tabIndex={stage === tab ? 0 : -1}>{label}</button>)}</div>
      <div className="case-panel" id={`case-${index}-panel`} role="tabpanel" aria-labelledby={`case-${index}-tab-${stage}`} tabIndex={0}>
        {stage === 2 && <h2>{incident.lessonTitle}</h2>}<p>{incident.sections[stage]}</p>
        {stage === 2 && <small>Góc nhìn biên tập rút ra từ sự kiện.</small>}
      </div>
      <div className="case-sources"><span>ĐỌC NGUỒN GỐC</span>{incident.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" title={source.label} aria-label={source.label}>{source.label.split(' · ')[0]} ↗</a>)}</div>
    </section>
  </article>
}

export default function IncidentStories() {
  const [active, setActive] = useState(0)
  const changeActive = useCallback((index: number) => setActive(index), [])
  const { rail, navigate, ...dragHandlers } = useChapterRail(changeActive, incidents.length)
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (document.querySelector('.analytics-overlay') || (event.target instanceof Element && event.target.closest('button, a, input, [role="tablist"]'))) return
      if (event.key === 'ArrowRight' || event.key === 'PageDown') { event.preventDefault(); navigate(active + 1) }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); navigate(active - 1) }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [active, navigate])
  return <div className="atlas-app incident-app" style={{ '--case-color': incidents[active].color } as CSSProperties}>
    <header className="atlas-header"><a className="atlas-brand" href="#/">TΛM <span>/</span> ATLAS</a><a className="back-topics" href="#/">← Chủ đề</a><span className="case-real-label"><i /> HỒ SƠ CÓ THẬT</span></header>
    <nav className="case-chain-nav" aria-label="Chọn hồ sơ blockchain">{incidents.map((incident, index) => <button key={incident.id} onClick={() => navigate(index)} aria-current={index === active ? 'step' : undefined} style={{ '--chain-color': incident.color } as CSSProperties}><span>{String(index + 1).padStart(2, '0')}</span>{incident.chain}</button>)}</nav>
    <main className="case-rail" ref={rail} {...dragHandlers} tabIndex={0} aria-label="Các hồ sơ sự cố, kéo ngang để khám phá">{incidents.map((incident, index) => <div className="case-slide" key={incident.id} aria-hidden={index !== active} ref={node => { if (node) node.inert = index !== active }}><CaseScene incident={incident} index={index} /></div>)}</main>
    <div className="case-bottom"><span className="case-counter"><b>{String(active + 1).padStart(2, '0')}</b> / {String(incidents.length).padStart(2, '0')} <i /><span>KÉO NGANG ĐỂ KHÁM PHÁ</span></span><div className="case-controls"><button disabled={active === 0} onClick={() => navigate(active - 1)}>← Trước</button><button className="case-next" onClick={() => navigate(active === incidents.length - 1 ? 0 : active + 1)}>{active === incidents.length - 1 ? 'Đọc lại' : 'Hồ sơ tiếp'} →</button></div></div>
    <footer className="atlas-footer"><p>Sự kiện lịch sử · Biên soạn 15.10.2026 · Mỗi hồ sơ có nguồn gốc.</p><div><a href="#/hu-cau">TΛMVERSE ↗</a><AnalyticsWidget language="vi" /></div></footer>
  </div>
}
