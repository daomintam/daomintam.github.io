type Props = { active: number; total: number; onPrev: () => void; onNext: () => void; language: 'en' | 'vi' }

export function StoryControls({ active, total, onPrev, onNext, language }: Props) {
  const vi = language === 'vi'
  return <footer className="bottom-bar">
    <div className="footer-note"><p>{vi ? 'Một trí tưởng tượng khoác hoodie. ' : 'An imagination wearing a hoodie. '}<span>{vi ? 'Không phải tiểu sử.' : 'Not a biography.'}</span></p></div>
    <div className="chapter-progress" aria-label={`${vi ? 'Chương' : 'Chapter'} ${active + 1} ${vi ? 'trên' : 'of'} ${total}`}><span className="page-count"><b>{String(active + 1).padStart(2, '0')}</b> / {String(total).padStart(2, '0')}</span><div className="progress">{Array.from({ length: total }, (_, index) => <i key={index} className={index <= active ? 'complete' : ''} />)}</div></div>
    <div className="controls">
      <button onClick={onPrev} disabled={active === 0} aria-label={vi ? 'Chương trước' : 'Previous chapter'}><span aria-hidden="true">←</span> {vi ? 'Trước' : 'Previous'}</button>
      <button className="next" onClick={onNext}>{active === total - 1 ? (vi ? 'Đọc lại' : 'Read again') : (vi ? 'Tiếp' : 'Next')} <span aria-hidden="true">{active === total - 1 ? '↻' : '→'}</span></button>
    </div>
  </footer>
}
