import { useEffect } from 'react'

/** Pointer motion stays outside React renders and is disabled on touch/reduced motion. */
export function useAmbientMotion(route: string) {
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.querySelector<HTMLElement>('.atlas-app, .day-app')
    if (!root) return
    let frame = 0, x = 0, y = 0, pending: HTMLElement | null = null, previous: HTMLElement | null = null
    const clear = () => { previous?.style.removeProperty('--tilt-x'); previous?.style.removeProperty('--tilt-y'); previous = null }
    const update = () => {
      frame = 0
      root.style.setProperty('--pointer-x', `${x}px`); root.style.setProperty('--pointer-y', `${y}px`)
      root.style.setProperty('--parallax-x', `${(x / innerWidth - .5) * 8}px`)
      root.style.setProperty('--parallax-y', `${(y / innerHeight - .5) * 6}px`)
      if (pending !== previous) clear()
      if (pending) {
        const rect = pending.getBoundingClientRect()
        pending.style.setProperty('--tilt-x', `${-(y - rect.top - rect.height / 2) / rect.height * 3}deg`)
        pending.style.setProperty('--tilt-y', `${(x - rect.left - rect.width / 2) / rect.width * 3}deg`)
        previous = pending
      }
    }
    const move = (event: PointerEvent) => {
      x = event.clientX; y = event.clientY
      pending = event.target instanceof Element ? event.target.closest<HTMLElement>('.topic-card') : null
      if (!frame) frame = requestAnimationFrame(update)
    }
    const leave = () => { cancelAnimationFrame(frame); frame = 0; clear(); root.style.removeProperty('--parallax-x'); root.style.removeProperty('--parallax-y') }
    root.addEventListener('pointermove', move, { passive: true }); root.addEventListener('pointerleave', leave)
    return () => { leave(); root.removeEventListener('pointermove', move); root.removeEventListener('pointerleave', leave) }
  }, [route])
}
