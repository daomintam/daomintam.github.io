import type { Chapter } from '../data/tamverseChapters'
import { wordmark } from '../data/xProfile'

type Props = { chapters: Chapter[]; active: number; onSelect: (index: number) => void; dark: boolean; onTheme: () => void }

export function StoryTopBar({ chapters, active, onSelect, dark, onTheme }: Props) {
  return <header className="topbar">
    <a className="brand" href="#story" aria-label={`${wordmark} home`}><span>A fictional story</span><strong>• {wordmark}</strong></a>
    <nav className="chapters" aria-label="Story chapters">
      {chapters.map((chapter, index) => <button key={chapter.title} className={active === index ? 'active' : ''} style={{ '--chapter-color': chapter.color } as React.CSSProperties} onClick={() => onSelect(index)} aria-label={`Chapter ${index + 1}: ${chapter.title}`} aria-current={active === index ? 'step' : undefined}>{String(index + 1).padStart(2, '0')}</button>)}
    </nav>
    <button className="theme-toggle" onClick={onTheme} aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`} title="Toggle theme">{dark ? '☀' : '☾'}</button>
  </header>
}
