import { useCallback, useEffect, useRef, useState } from 'react'
import { chapters } from '../data/tamverseChapters'
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
  const locked = useRef(false)
  const touchX = useRef(0)

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
    const wheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 24) return
      event.preventDefault()
      event.deltaY > 0 ? next() : prev()
    }
    const key = (event: KeyboardEvent) => {
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

  return <div className="app-shell" onTouchStart={(e) => { touchX.current = e.changedTouches[0].clientX }} onTouchEnd={(e) => { const delta = e.changedTouches[0].clientX - touchX.current; if (Math.abs(delta) >= 45) delta < 0 ? next() : prev() }}>
    <StoryTopBar chapters={chapters} active={active} onSelect={(index) => navigate(index)} dark={dark} onTheme={() => setDark((value) => !value)} />
    <StoryScene key={active} chapter={chapters[active]} direction={direction} revealed={revealed} onReveal={reveal} mascotBounce={bouncing} />
    <StoryControls active={active} total={chapters.length} onPrev={prev} onNext={next} />
    <XProfileCard />
    <aside className="social-links" aria-label="Social profiles">
      <a href="https://www.tiktok.com/@mintamdao" target="_blank" rel="noreferrer">TikTok</a>
      <a href="https://github.com/daomintam" target="_blank" rel="noreferrer">GitHub</a>
      <a href={xProfile.url} target="_blank" rel="noreferrer">X</a>
    </aside>
  </div>
}
