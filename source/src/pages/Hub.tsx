import { useState, type CSSProperties } from 'react'
import { topics } from '../data/topics'
import { incidents } from '../data/incidents'
import { IncidentVisual } from '../components/IncidentVisual'
import { AnalyticsWidget } from '../components/AnalyticsWidget'
import { xProfile } from '../data/xProfile'

export default function Hub() {
  const [filter, setFilter] = useState<'all' | 'fact' | 'fiction'>('all')
  const visible = topics.filter(topic => filter === 'all' || topic.kind === filter)
  return <div className="atlas-app atlas-hub">
    <header className="atlas-header"><a className="atlas-brand" href="#/">TΛM <span>/</span> ATLAS<span className="brand-dot" /></a><span className="atlas-header-note">MỖI CHỦ ĐỀ, MỘT THẾ GIỚI.</span><a className="atlas-header-link" href={xProfile.url} target="_blank" rel="noreferrer">TΛM trên X ↗</a></header>
    <main className="hub-main">
      <section className="hub-intro">
        <p className="atlas-eyebrow"><span /> BỘ SƯU TẬP TRẢI NGHIỆM</p>
        <h1>Chuyện thật để hiểu.<br /><em>Hư cấu để tưởng tượng.</em></h1>
        <p className="hub-description">Có những chuyện đã làm blockchain đổi hướng. Có những chuyện chỉ bắt đầu từ một chiếc hoodie. Chọn một chủ đề và bước vào.</p>
        <div className="hub-index"><b>{String(topics.length).padStart(2, '0')}</b><span>chủ đề<br />đang mở</span><i /><span>Đọc theo nhịp của bạn.<br />Kéo ngang để đi sâu.</span></div>
        <nav className="topic-filters" aria-label="Lọc chủ đề">{([{ id: 'all', label: 'Tất cả' }, { id: 'fact', label: 'Có thật' }, { id: 'fiction', label: 'Hư cấu' }] as const).map(item => <button key={item.id} aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>{item.label}</button>)}</nav>
      </section>
      <section className="topic-list" aria-label="Các chủ đề" aria-live="polite">
        {visible.map(topic => <a className={`topic-card topic-${topic.kind}`} key={topic.id} href={topic.href}>
          <div className="topic-card-top"><span className="topic-kind"><i />{topic.tag}</span><span className="topic-number">/{topic.index}</span></div>
          <div className="topic-card-content"><div><h2>{topic.title}</h2><p>{topic.description}</p><span className="topic-enter">{topic.kind === 'fact' ? 'Mở hồ sơ' : 'Vào TΛMVERSE'} <b aria-hidden="true">↗</b></span></div>
            {topic.kind === 'fact' ? <div className="topic-miniature" style={{ '--case-color': '#f3b36a' } as CSSProperties}><IncidentVisual incident={incidents[0]} compact /></div> : <img className="topic-mascot" src="/img/me.svg" alt="Nhân vật TΛM trong chuyến phiêu lưu hư cấu" loading="lazy" />}
          </div>
          <div className="topic-card-bottom">{topic.kind === 'fact' ? <><span>BTC / ETH / BNB / SOL</span><span>{String(incidents.length).padStart(2, '0')} hồ sơ · Có nguồn gốc</span></> : <><span>HƯ CẤU / TƯỞNG TƯỢNG</span><span>04 chương</span></>}</div>
        </a>)}
      </section>
    </main>
    <footer className="atlas-footer"><p>Chuyện có thật có nguồn. Chuyện hư cấu có nhãn.</p><div><a href="https://github.com/daomintam" target="_blank" rel="noreferrer">GitHub ↗</a><a href={xProfile.url} target="_blank" rel="noreferrer">X ↗</a><AnalyticsWidget language="vi" /></div></footer>
  </div>
}
