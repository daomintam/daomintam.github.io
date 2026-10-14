import type { Chapter } from '../data/tamverseChapters'

type Props = { chapter: Chapter; direction: 'next' | 'prev'; revealed: boolean; onReveal: () => void; mascotBounce: boolean }

export function StoryScene({ chapter, direction, revealed, onReveal, mascotBounce }: Props) {
  return <main id="story" className={`story-scene enter-${direction}`} style={{ '--accent': chapter.color } as React.CSSProperties}>
    <section className="story-copy" aria-labelledby="story-title">
      <p className="kicker"><span>{chapter.symbol}</span>{chapter.kicker}</p>
      <h1 id="story-title">{chapter.title}</h1>
      <p className="story-body">{chapter.body}</p>
      <div className="reveal-row">
        <button className="cta" onClick={onReveal}>{chapter.cta}<span aria-hidden="true">↗</span></button>
        <p className={`punchline ${revealed ? 'visible' : ''}`} role="status">{revealed ? chapter.punchline : ''}</p>
      </div>
    </section>
    <section className="art-stage" aria-label="TAM character artwork">
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="symbol" aria-hidden="true">{chapter.symbol}</div>
      <div className="sticker" aria-hidden="true"><span>{chapter.sticker[0]}</span><strong>{chapter.sticker[1]}</strong></div>
      <img className={`mascot ${mascotBounce ? 'boing' : ''}`} src="/img/x-avatar.jpg" alt="TΛM X profile avatar used as the story mascot" />
    </section>
  </main>
}
