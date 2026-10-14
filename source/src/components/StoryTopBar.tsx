import type { Chapter } from '../data/tamverseChapters'
import { wordmark } from '../data/xProfile'

type Props = { chapters: Chapter[]; active: number; onSelect: (index: number) => void; dark: boolean; onTheme: () => void; language: 'en' | 'vi'; onLanguage: () => void }

export function StoryTopBar({ chapters, active, onSelect, dark, onTheme, language, onLanguage }: Props) {
  const vi = language === 'vi'
  return <header className="topbar">
    <a className="brand" href="#story" aria-label={`${wordmark} home`}><span>{vi ? 'Một câu chuyện hư cấu' : 'A fictional story'}</span><strong>• {wordmark}</strong></a>
    <nav className="chapters" aria-label={vi ? 'Các chương truyện' : 'Story chapters'}>
      {chapters.map((chapter, index) => <button key={chapter.title} className={active === index ? 'active' : ''} style={{ '--chapter-color': chapter.color } as React.CSSProperties} onClick={() => onSelect(index)} aria-label={`${vi ? 'Chương' : 'Chapter'} ${index + 1}: ${chapter.title}`} aria-current={active === index ? 'step' : undefined}>{String(index + 1).padStart(2, '0')}</button>)}
    </nav>
    <div className="top-actions">
      <button className="language-toggle" onClick={onLanguage} aria-label={vi ? 'Switch to English' : 'Chuyển sang tiếng Việt'} title={vi ? 'English' : 'Tiếng Việt'}>{vi ? 'EN' : 'VI'}</button>
      <button className="theme-toggle" onClick={onTheme} aria-label={vi ? `Chuyển sang giao diện ${dark ? 'sáng' : 'tối'}` : `Switch to ${dark ? 'light' : 'dark'} theme`} title={vi ? 'Đổi giao diện' : 'Toggle theme'}>{dark ? '☀' : '☾'}</button>
    </div>
  </header>
}
