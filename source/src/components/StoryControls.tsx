import { AnalyticsWidget } from './AnalyticsWidget'

type Props = { active: number; total: number; onPrev: () => void; onNext: () => void }

export function StoryControls({ active, total, onPrev, onNext }: Props) {
  return <footer className="bottom-bar">
    <div className="footer-note"><AnalyticsWidget /><p>An imagination wearing a hoodie. <span>Not a biography.</span></p></div>
    <div className="progress" aria-label={`Chapter ${active + 1} of ${total}`}><i style={{ width: `${((active + 1) / total) * 100}%` }} /></div>
    <div className="controls">
      <button onClick={onPrev} disabled={active === 0} aria-label="Previous chapter"><span aria-hidden="true">←</span> Previous</button>
      <button className="next" onClick={onNext}>{active === total - 1 ? 'Read again' : 'Next'} <span aria-hidden="true">{active === total - 1 ? '↻' : '→'}</span></button>
    </div>
  </footer>
}
