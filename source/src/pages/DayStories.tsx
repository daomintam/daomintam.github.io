import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { MoodSprite } from '../components/MoodSprite'
import { DayAtmosphere } from '../components/DayAtmosphere'
import { dayScenes, dayThemes } from '../data/dayScenes'
import { useChapterRail } from '../lib/useChapterRail'
import '../styles/day.css'

export default function DayStories() {
  const [active, setActive] = useState(0)
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]))
  const onActive = useCallback((index: number) => { setActive(index); setVisited(old => new Set([...old, index])) }, [])
  const { rail, navigate, ...drag } = useChapterRail(onActive, dayScenes.length)
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.target as Element).closest('button,a,input')) return
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); navigate(active + (event.key === 'ArrowRight' ? 1 : -1)) }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [active, navigate])
  const themeStyle = (index: number) => ({ '--acid': dayThemes[index].accent, '--day-bg': dayThemes[index].background, '--day-glow': dayThemes[index].glow } as CSSProperties)
  return <div className="day-app" style={themeStyle(active)}>
    <header className="day-header"><a href="#/" aria-label="Về trang chủ đề">TΛM <span>/</span> ATLAS ↗</a><span>MỘT NGÀY KHÔNG QUÁ NGHIÊM TÚC</span><b>Một ngày, bảy sắc thái<span className="day-live" /></b></header>
    <main className="day-rail" ref={rail} {...drag} tabIndex={0} aria-label="Kéo ngang khám phá một ngày của TΛM">
      {dayScenes.map((scene, index) => <section key={index} className="day-slide" style={themeStyle(index)} data-scene={index} aria-hidden={active !== index} ref={node => { if (node) node.inert = active !== index }}>
        <article className="day-scene">
          <div className="day-copy"><p className="day-eyebrow">NHẬT KÝ HƯ CẤU <span>· {scene[0]}</span></p><h1>{scene[1]}</h1><p className="day-prose">{scene[2]}</p><div className="day-choices"><span>RỒI SAO NỮA?</span><button onClick={() => navigate(scene[6])}>{scene[5]} <i>↗</i></button><button onClick={() => navigate(scene[8])}>{scene[7]} <i>↗</i></button></div></div>
          <div className="day-art"><DayAtmosphere icons={dayThemes[index].icons} label={dayThemes[index].label} /><span className="day-orbit" /><span className="day-sticker">{dayThemes[index].sticker}</span><MoodSprite pose={scene[4]} /><span className="day-time">{scene[0]}</span><p className="day-status"><span />{scene[3]}</p></div>
        </article>
      </section>)}
    </main>
    <nav className="day-navigation" aria-label="Chuyển tình huống"><div><b>{String(active + 1).padStart(2, '0')}</b><span>/ {String(dayScenes.length).padStart(2, '0')}</span><small>Kéo ngang. Đi chậm thôi.</small></div><div><button aria-label="Tình huống trước" disabled={active === 0} onClick={() => navigate(active - 1)}>←</button><button onClick={() => navigate(active === dayScenes.length - 1 ? 0 : active + 1)}>{active === dayScenes.length - 1 ? 'Ngày mới' : 'Tiếp theo'} →</button></div></nav>
    <footer className="day-footer"><span className="day-collected">Đã gặp {visited.size}/{dayScenes.length} phiên bản của mình</span><div className="day-progress" aria-hidden="true">{dayScenes.map((_, i) => <span key={i} className={`${visited.has(i) ? 'seen' : ''} ${active === i ? 'current' : ''}`} />)}</div><a href="#/">Chọn chuyện khác ↗</a></footer>
  </div>
}
