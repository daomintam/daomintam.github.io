import { useCallback, useEffect, useRef, type PointerEvent } from 'react'

export function useChapterRail(onActive: (index: number) => void, total: number) {
  const rail = useRef<HTMLDivElement>(null)
  const frame = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const destination = useRef(0)
  const drag = useRef<{ id: number; x: number; y: number; left: number; lastX: number; lastTime: number; velocity: number; moved: boolean } | null>(null)
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches
  const stop = useCallback(() => { cancelAnimationFrame(frame.current); frame.current = 0; clearTimeout(timer.current) }, [])
  const animate = useCallback((target: number, duration = 1450) => {
    const el = rail.current
    if (!el) return
    stop()
    destination.current = Math.max(0, Math.min(el.scrollWidth - el.clientWidth, target))
    const start = el.scrollLeft, distance = destination.current - start, started = performance.now()
    if (reduced()) { el.scrollLeft = destination.current; return }
    const tick = (now: number) => {
      if (reduced()) { el.scrollLeft = destination.current; frame.current = 0; return }
      const t = Math.min(1, (now - started) / duration)
      const progress = duration >= 1400 ? t * t * (3 - 2 * t) : 1 - Math.pow(1 - t, 3)
      el.scrollLeft = start + distance * progress
      if (t < 1) frame.current = requestAnimationFrame(tick)
      else frame.current = 0
    }
    frame.current = requestAnimationFrame(tick)
  }, [stop])
  const navigate = useCallback((index: number) => {
    if (rail.current) animate(Math.max(0, Math.min(total - 1, index)) * rail.current.clientWidth)
  }, [animate, total])

  useEffect(() => {
    const el = rail.current
    if (!el) return
    let width = el.clientWidth
    let index = Math.round(el.scrollLeft / width)
    const scroll = () => {
      if (el.clientWidth !== width) return
      const next = Math.max(0, Math.min(total - 1, Math.round(el.scrollLeft / width)))
      if (next !== index) { index = next; onActive(next) }
    }
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || document.querySelector('.analytics-overlay')) return
      event.preventDefault()
      if (drag.current) return
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? el.clientWidth : 1
      const delta = (horizontal ? event.deltaX : event.deltaY) * unit * (horizontal ? 1 : 1.8)
      const target = (frame.current ? destination.current : el.scrollLeft) + delta
      animate(target, 600)
      timer.current = setTimeout(() => {
        animate(Math.round(destination.current / el.clientWidth) * el.clientWidth, 1000)
      }, 220)
    }
    const resize = new ResizeObserver(() => {
      if (width === el.clientWidth) return
      width = el.clientWidth
      if (drag.current && el.hasPointerCapture(drag.current.id)) el.releasePointerCapture(drag.current.id)
      drag.current = null; delete el.dataset.dragging
      stop(); el.scrollLeft = index * width; destination.current = el.scrollLeft
    })
    resize.observe(el)
    el.addEventListener('scroll', scroll, { passive: true })
    window.addEventListener('wheel', wheel, { passive: false })
    return () => { stop(); resize.disconnect(); el.removeEventListener('scroll', scroll); window.removeEventListener('wheel', wheel) }
  }, [animate, onActive, stop, total])

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || e.isPrimary === false || (e.target as Element).closest('button, a, input, textarea, select')) return
    const el = rail.current
    if (!el) return
    stop()
    el.setPointerCapture(e.pointerId)
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, left: el.scrollLeft, lastX: e.clientX, lastTime: performance.now(), velocity: 0, moved: false }
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const state = drag.current, el = rail.current
    if (!state || !el || state.id !== e.pointerId) return
    const dx = e.clientX - state.x, dy = e.clientY - state.y
    if (!state.moved) {
      if (Math.abs(dx) < 8) return
      if (Math.abs(dy) > Math.abs(dx)) { drag.current = null; return }
      state.moved = true; el.setPointerCapture(e.pointerId); el.dataset.dragging = 'true'
    }
    e.preventDefault()
    const now = performance.now()
    state.velocity = -(e.clientX - state.lastX) / Math.max(1, now - state.lastTime)
    state.lastX = e.clientX; state.lastTime = now
    el.scrollLeft = state.left - dx
    destination.current = el.scrollLeft
  }
  const finish = (e: PointerEvent<HTMLDivElement>) => {
    const state = drag.current, el = rail.current
    if (!state || !el || state.id !== e.pointerId) return
    drag.current = null; delete el.dataset.dragging
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
    const velocity = performance.now() - state.lastTime < 100 ? state.velocity : 0
    const projected = el.scrollLeft + Math.max(-el.clientWidth * .35, Math.min(el.clientWidth * .35, velocity * 120))
    animate(Math.round(projected / el.clientWidth) * el.clientWidth, 1100)
  }
  return { rail, navigate, onPointerDown, onPointerMove, onPointerUp: finish, onPointerCancel: finish }
}
