const moods = ['hello', 'focus', 'work', 'phone', 'coffee', 'music', 'sleep']
const labels = ['chào ngày mới', 'quyết tâm', 'làm việc', 'lướt điện thoại', 'cầm cà phê muối', 'nghe nhạc', 'ngủ ngon']

export function MoodSprite({ pose, className = '' }: { pose: number; className?: string }) {
  return <img className={`mood-sprite ${className}`} src={`/img/moods/${moods[pose] ?? moods[0]}.png`} alt={`TΛM ${labels[pose] ?? labels[0]}`} width={1254} height={1254} draggable={false} decoding="async" />
}
