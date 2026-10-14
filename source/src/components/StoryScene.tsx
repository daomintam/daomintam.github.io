import type { CSSProperties, PointerEvent } from 'react'
import type { Chapter } from '../data/tamverseChapters'

type Props = { chapter: Chapter; index: number; total: number; revealed: boolean; onReveal: () => void; mascotBounce: boolean; language: 'en' | 'vi' }

export function StoryScene({ chapter, index, total, revealed, onReveal, mascotBounce, language }: Props) {
  const vi = language === 'vi'
  const number = String(index + 1).padStart(2, '0')
  const tilt = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--tilt-x', `${(event.clientX - bounds.left - bounds.width / 2) / bounds.width * 7}deg`)
    event.currentTarget.style.setProperty('--tilt-y', `${-(event.clientY - bounds.top - bounds.height / 2) / bounds.height * 7}deg`)
  }
  const resetTilt = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg')
    event.currentTarget.style.setProperty('--tilt-y', '0deg')
  }
  return <article className="story-scene" style={{ '--accent': chapter.color } as CSSProperties}>
    <section className="story-copy" aria-labelledby={`story-title-${index}`}>
      <div className="story-heading">
      <p className="kicker"><span>{number} / {String(total).padStart(2, '0')}</span>{chapter.kicker}</p>
      <h1 id={`story-title-${index}`}>{chapter.title}</h1>
      </div>
      <p className="story-body">{chapter.body}</p>
      <div className="reveal-row">
        <button className="cta" onClick={onReveal}>{chapter.cta}<span aria-hidden="true">↗</span></button>
        <p className={`punchline ${revealed ? 'visible' : ''}`} role="status">{revealed ? chapter.punchline : ''}</p>
      </div>
    </section>
    <section className="art-stage" aria-label={vi ? 'Minh họa nhân vật TΛM' : 'TAM character artwork'} onPointerMove={tilt} onPointerLeave={resetTilt}>
      <span className="art-index" aria-hidden="true">{number}</span>
      <div className="art-orbit" aria-hidden="true" />
      <div className="orb orb-one" aria-hidden="true" /><div className="orb orb-two" aria-hidden="true" />
      <div className="art-figure"><img className={`mascot ${mascotBounce ? 'boing' : ''}`} src="/img/me.svg" alt={vi ? 'Mascot TΛM chuyển động' : 'TΛM animated mascot'} draggable={false} /></div>
      <div className="symbol" aria-hidden="true">{chapter.symbol}</div>
      <div className="sticker" aria-hidden="true"><span>{chapter.sticker[0]}</span><strong>{chapter.sticker[1]}</strong><i>✳</i></div>
      <p className="art-caption" aria-hidden="true"><span>✳</span> {vi ? 'MỘT CHÚT TÒ MÒ. CẢ VŨ TRỤ.' : 'A LITTLE CURIOUS. A WHOLE UNIVERSE.'}</p>
    </section>
  </article>
}
