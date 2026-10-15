import { useChapterRail } from '../lib/useChapterRail'
import { DeviceTilt } from '../components/DeviceTilt'
import { AnalyticsWidget } from '../components/AnalyticsWidget'
import { useCallback, useEffect, useState } from 'react'
import { chapters, chaptersVi } from '../data/tamverseChapters'
import { StoryTopBar } from '../components/StoryTopBar'
import { StoryScene } from '../components/StoryScene'
import { StoryControls } from '../components/StoryControls'
import { XProfileCard } from '../components/XProfileCard'
import { xProfile } from '../data/xProfile'

function initialLanguage(): 'en' | 'vi' {
  const saved = localStorage.getItem('tamverse-language-preference')
  if (saved === 'en' || saved === 'vi') return saved
  return navigator.languages.some((locale) => locale.toLowerCase().startsWith('vi')) ? 'vi' : 'en'
}

export default function Story() {
  const [active, setActive] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [bouncing, setBouncing] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('tamverse-theme') !== 'light')
  const [language, setLanguage] = useState<'en' | 'vi'>(initialLanguage)
  const changeActive = useCallback((index: number) => {
    setActive(index); setRevealed(false); setBouncing(false)
  }, [])
  const { rail, navigate, ...dragHandlers } = useChapterRail(changeActive, chapters.length)
  const next = useCallback(() => navigate(active === chapters.length - 1 ? 0 : active + 1), [active, navigate])
  const prev = useCallback(() => navigate(active - 1), [active, navigate])

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('tamverse-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    document.documentElement.lang = language
    localStorage.setItem('tamverse-language-preference', language)
  }, [language])

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (document.querySelector('.analytics-overlay') || (event.target instanceof HTMLElement && event.target.closest('button, a, input, textarea, select, [contenteditable]'))) return
      if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(event.key)) { event.preventDefault(); next() }
      if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); prev() }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [next, prev])

  const reveal = () => {
    setRevealed(true); setBouncing(false)
    requestAnimationFrame(() => setBouncing(true))
    window.setTimeout(() => setBouncing(false), 700)
  }

  const localizedChapters = language === 'vi' ? chaptersVi : chapters

  return <div className="app-shell" style={{ '--accent': localizedChapters[active].color } as React.CSSProperties}>
    <div className="ambient-motion" aria-hidden="true"><i /><i /><i /><i /></div>
    <StoryTopBar chapters={localizedChapters} active={active} onSelect={(index) => navigate(index)} dark={dark} onTheme={() => setDark((value) => !value)} language={language} onLanguage={() => setLanguage((value) => value === 'en' ? 'vi' : 'en')} />
    <div id="story" role="main" tabIndex={0} aria-label={language === 'vi' ? 'Câu chuyện TΛMVERSE, kéo ngang để khám phá' : 'TΛMVERSE story, drag horizontally to explore'} className="story-rail" ref={rail} {...dragHandlers}>
      {localizedChapters.map((chapter, index) => <div className="story-slide" key={index} aria-hidden={index !== active} ref={(node) => { if (node) node.inert = index !== active }}>
        <StoryScene index={index} total={localizedChapters.length} chapter={chapter} revealed={index === active && revealed} onReveal={reveal} mascotBounce={index === active && bouncing} language={language} />
      </div>)}
    </div>
    <StoryControls active={active} total={localizedChapters.length} onPrev={prev} onNext={next} language={language} />
    <div className="profile-slot"><XProfileCard language={language} /></div>
    <aside className="social-links" aria-label={language === 'vi' ? 'Mạng xã hội' : 'Social profiles'}>
      <a href="https://www.tiktok.com/@mintamdao" target="_blank" rel="noreferrer">TikTok</a>
      <a href="https://github.com/daomintam" target="_blank" rel="noreferrer">GitHub</a>
      <a href={xProfile.url} target="_blank" rel="noreferrer">X</a>
      <AnalyticsWidget language={language} />
      <DeviceTilt language={language} />
    </aside>
  </div>
}
