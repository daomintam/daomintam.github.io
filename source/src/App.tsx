import { useEffect, useState } from 'react'
import Story from './pages/Story'
import Hub from './pages/Hub'
import IncidentStories from './pages/IncidentStories'
import './styles/atlas.css'

function currentRoute() {
  const hash = location.hash
  if (hash === '#story' || hash.startsWith('#/hu-cau')) return 'fiction'
  if (hash.startsWith('#/su-co')) return 'incidents'
  return 'hub'
}

export default function App() {
  const [route, setRoute] = useState(currentRoute)
  useEffect(() => {
    const update = () => setRoute(currentRoute())
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  useEffect(() => {
    document.title = route === 'fiction' ? 'TΛMVERSE · Chuyện hư cấu' : route === 'incidents' ? 'Hồ sơ sự cố blockchain · TΛM ATLAS' : 'TΛM ATLAS · Chọn một câu chuyện'
    if (route !== 'fiction') {
      document.documentElement.lang = 'vi'
      document.documentElement.dataset.theme = 'dark'
    }
  }, [route])
  if (route === 'fiction') return <Story />
  if (route === 'incidents') return <IncidentStories />
  return <Hub />
}
