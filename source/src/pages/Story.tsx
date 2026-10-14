import { useCallback, useEffect, useRef, useState } from 'react'
import { chapters, chaptersVi } from '../data/tamverseChapters'
import { StoryTopBar } from '../components/StoryTopBar'
import { StoryScene } from '../components/StoryScene'
import { StoryControls } from '../components/StoryControls'
import { XProfileCard } from '../components/XProfileCard'
import { xProfile } from '../data/xProfile'

export default function Story() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [revealed, setRevealed] = useState(false)
  const [bouncing, setBouncing] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('tamverse-theme') !== 'light')
  const [language, setLanguage] = useState<'en' | 'vi'>(() => localStorage.getItem('tamverse-language') === 'vi' ? 'vi' : 'en')
  const locked = useRef(false)
  const touchX = useRef(0)
  const touchY = useRef(0)

  const navigate = useCallback((next: number, dir?: 'next' | 'prev') => {
    if (locked.current || next === active) return
    locked.current = true
    setDirection(dir ?? (next > active ? 'next' : 'prev'))
    setActive((next + chapters.length) % chapters.length)
    setRevealed(false)
    window.setTimeout(() => { locked.current = false }, 950)
  }, [active])

  const next = useCallback(() => navigate(active === chapters.length - 1 ? 0 : active + 1, 'next'), [active, navigate])
  const prev = useCallback(() => active > 0 && navigate(active - 1, 'prev'), [active, navigate])

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('tamverse-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    document.documentElement.lang = language
    localStorage.setItem('tamverse-language', language)
  }, [language])

  useEffect(() => {
    const wheel = (event: WheelEvent) => {
      if (document.querySelector('.analytics-overlay')) return
      event.preventDefault()
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
      if (Math.abs(horizontal) < 24) return
      horizontal > 0 ? next() : prev()
    }
    const key = (event: KeyboardEvent) => {
      if (document.querySelector('.analytics-overlay') || (event.target instanceof HTMLElement && event.target.closest('button, a, input, textarea, select, [contenteditable]'))) return
      if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(event.key)) next()
      if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) prev()
    }
    window.addEventListener('wheel', wheel, { passive: false })
    window.addEventListener('keydown', key)
    return () => { window.removeEventListener('wheel', wheel); window.removeEventListener('keydown', key) }
  }, [next, prev])

  const reveal = () => {
    setRevealed(true); setBouncing(false)
    requestAnimationFrame(() => setBouncing(true))
    window.setTimeout(() => setBouncing(false), 700)
  }

  const localizedChapters = language === 'vi' ? chaptersVi : chapters

  return <div className="app-shell" style={{ '--accent': localizedChapters[active].color } as React.CSSProperties} onTouchStart={(e) => { touchX.current = e.changedTouches[0].clientX; touchY.current = e.changedTouches[0].clientY }} onTouchEnd={(e) => { const delta = e.changedTouches[0].clientX - touchX.current; if (!(e.target instanceof Element && e.target.closest('.analytics-overlay')) && Math.abs(delta) >= 45 && Math.abs(delta) > Math.abs(e.changedTouches[0].clientY - touchY.current) * 1.5) delta < 0 ? next() : prev() }}>
    <div className="ambient-motion" aria-hidden="true"><i /><i /><i /><i /></div>
    <StoryTopBar chapters={localizedChapters} active={active} onSelect={(index) => navigate(index)} dark={dark} onTheme={() => setDark((value) => !value)} language={language} onLanguage={() => setLanguage((value) => value === 'en' ? 'vi' : 'en')} />
    <StoryScene key={`${active}-${language}`} chapter={localizedChapters[active]} direction={direction} revealed={revealed} onReveal={reveal} mascotBounce={bouncing} language={language} />
    <StoryControls active={active} total={localizedChapters.length} onPrev={prev} onNext={next} language={language} />
    <div className="profile-slot"><XProfileCard language={language} /></div>
    <aside className="social-links" aria-label={language === 'vi' ? 'Mạng xã hội' : 'Social profiles'}>
      <a href="https://www.tiktok.com/@mintamdao" target="_blank" rel="noreferrer">TikTok</a>
      <a href="https://github.com/daomintam" target="_blank" rel="noreferrer">GitHub</a>
      <a href={xProfile.url} target="_blank" rel="noreferrer">X</a>
    </aside>
  </div>
}
