import type { CSSProperties } from 'react'

export function MoodSprite({ pose, className = '' }: { pose: number; className?: string }) {
  const row = Math.floor(pose / 5), col = pose % 5
  const edges = [0, 272, 514, 768, 1024], height = edges[row + 1] - edges[row]
  return <span role="img" aria-label={`Biểu cảm TΛM ${pose + 1}`} className={`mood-sprite ${className}`} style={{ aspectRatio: `307.2 / ${height}`, backgroundSize: `500% ${1024 / height * 100}%`, backgroundPosition: `${col * 25}% ${edges[row] / (1024 - height) * 100}%` } as CSSProperties} />
}
