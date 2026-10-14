import { useEffect, useRef, useState } from 'react'

type OrientationAPI = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> }

export function DeviceTilt({ language }: { language: 'en' | 'vi' }) {
  const [available, setAvailable] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [message, setMessage] = useState('')
  const root = useRef<HTMLElement | null>(null)
  const vi = language === 'vi'

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setAvailable(isSecureContext && 'DeviceOrientationEvent' in window && matchMedia('(pointer: coarse)').matches && !reduced.matches)
      if (reduced.matches) setEnabled(false)
    }
    update()
    reduced.addEventListener('change', update)
    return () => reduced.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const plane = root.current?.closest<HTMLElement>('.app-shell')
    if (!plane) return
    let baseline: { beta: number; gamma: number } | null = null
    let frame = 0
    let targetX = 0, targetY = 0, x = 0, y = 0
    const clear = () => {
      cancelAnimationFrame(frame); frame = 0; baseline = null
      x = y = targetX = targetY = 0
      plane.style.removeProperty('--motion-x')
      plane.style.removeProperty('--motion-y')
      plane.style.removeProperty('--motion-angle')
    }
    const draw = () => {
      x += (targetX - x) * .15; y += (targetY - y) * .15
      const angle = Math.hypot(x, y)
      plane.style.setProperty('--motion-x', String(angle ? x / angle : 0))
      plane.style.setProperty('--motion-y', String(angle ? y / angle : 1))
      plane.style.setProperty('--motion-angle', `${angle}deg`)
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > .01 ? requestAnimationFrame(draw) : 0
    }
    const orient = (event: DeviceOrientationEvent) => {
      if (document.hidden || event.beta === null || event.gamma === null || !Number.isFinite(event.beta) || !Number.isFinite(event.gamma)) return
      baseline ??= { beta: event.beta, gamma: event.gamma }
      const radians = (screen.orientation?.angle ?? 0) * Math.PI / 180
      const beta = event.beta - baseline.beta, gamma = event.gamma - baseline.gamma
      const clamp = (value: number) => Math.max(-2.5, Math.min(2.5, value * .12))
      targetX = clamp(-beta * Math.cos(radians) + gamma * Math.sin(radians))
      targetY = clamp(gamma * Math.cos(radians) + beta * Math.sin(radians))
      if (!frame) frame = requestAnimationFrame(draw)
    }
    window.addEventListener('deviceorientation', orient)
    window.addEventListener('orientationchange', clear)
    document.addEventListener('visibilitychange', clear)
    return () => {
      window.removeEventListener('deviceorientation', orient)
      window.removeEventListener('orientationchange', clear)
      document.removeEventListener('visibilitychange', clear)
      clear()
    }
  }, [enabled])

  const toggle = async () => {
    setMessage('')
    if (enabled) { setEnabled(false); return }
    try {
      const api = DeviceOrientationEvent as OrientationAPI
      if (api.requestPermission && await api.requestPermission() !== 'granted') {
        setMessage(vi ? 'Chưa được cấp quyền cảm biến.' : 'Motion sensor permission was not granted.')
        return
      }
      setEnabled(true)
    } catch {
      setMessage(vi ? 'Thiết bị chưa cho phép dùng cảm biến.' : 'Motion sensors are unavailable on this device.')
    }
  }

  return <span className="device-tilt" ref={root}>
    {available && <button className="tilt-toggle" onClick={toggle} aria-pressed={enabled} aria-label={vi ? `${enabled ? 'Tắt' : 'Bật'} hiệu ứng nghiêng` : `${enabled ? 'Disable' : 'Enable'} device tilt`} title={vi ? 'Nghiêng thiết bị' : 'Tilt your device'}><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="3" width="10" height="18" rx="2" transform="rotate(15 12 12)"/><path d="m2 8 2-3 2 3m12 8 2 3 2-3"/></svg></button>}
    <span className="tilt-message" role="status">{message}</span>
  </span>
}
