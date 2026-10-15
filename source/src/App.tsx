import { useEffect, useState } from 'react'
import { useAmbientMotion } from './hooks/useAmbientMotion'
import Story from './pages/Story'
import Hub from './pages/Hub'
import DayStories from './pages/DayStories'
import IncidentStories from './pages/IncidentStories'
import './styles/atlas.css'
import './styles/polish.css'
import './styles/home.css'
import './styles/creative.css'

function currentRoute() {
  const hash = location.hash
  if (hash === '#story' || hash.startsWith('#/hu-cau')) return 'fiction'
  if ((hash.startsWith('#/20-tab') || hash.startsWith('#/mot-ngay'))) return 'day'
  if (hash.startsWith('#/su-co')) return 'incidents'
  return 'hub'
}

export default function App() {
  const [route, setRoute] = useState(currentRoute)
  const [dark, setDark] = useState(() => localStorage.getItem('tamverse-theme') !== 'light')
  useAmbientMotion(route)
  useEffect(() => {
    const update = () => {
      setRoute(currentRoute())
      setDark(localStorage.getItem('tamverse-theme') !== 'light')
    }
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  useEffect(() => {
    document.title = route === 'day' ? 'Một ngày, bảy sắc thái · TΛM ATLAS' : route === 'fiction' ? 'TΛMVERSE · Chuyện hư cấu' : route === 'incidents' ? 'Hồ sơ sự cố blockchain · TΛM ATLAS' : 'TΛM ATLAS · Chọn một câu chuyện'
    if (route !== 'fiction') document.documentElement.lang = 'vi'
  }, [route])
  useEffect(() => {
    if (route === 'fiction') return
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    localStorage.setItem('tamverse-theme', dark ? 'dark' : 'light')
  }, [dark, route])
  if (route === 'fiction') return <Story />
  const page = route === 'day' ? <DayStories /> : route === 'incidents' ? <IncidentStories /> : <Hub />
  return <>{page}<button className="global-theme-toggle" onClick={() => setDark(value => !value)} aria-label={`Chuyển sang giao diện ${dark ? 'sáng' : 'tối'}`} title="Đổi giao diện">{dark ? '☀' : '☾'}</button></>
}
