const paths: Record<string, string> = {
  sun: 'M24 12v-7m0 38v-7M12 24H5m38 0h-7M10 10l5 5m18 18 5 5M10 38l5-5m18-18 5-5M33 24a9 9 0 1 1-18 0 9 9 0 0 1 18 0',
  spark: 'M24 4l5 15 15 5-15 5-5 15-5-15-15-5 15-5Z',
  cloud: 'M13 35a9 9 0 1 1 0-18 12 12 0 0 1 23-1 10 10 0 0 1 0 20H13',
  bean: 'M36 9C20-1 1 22 12 37 25 51 47 25 36 9ZM34 9c-16 4-2 24-21 28',
  check: 'M10 25l10 10L39 13',
  paper: 'M10 5h22l6 7v31H10ZM18 19h13M18 26h13M18 33h8M31 5v9h7',
  code: 'm17 12-12 12 12 12m14-24 12 12-12 12M27 8l-6 32',
  heart: 'M24 40 7 24C-5 8 15-1 24 13 33-1 53 8 41 24Z',
  note: 'M20 34V12l20-5v22M20 16l20-5M20 34c0 8-13 10-13 3s13-10 13-3ZM40 29c0 8-13 10-13 3s13-10 13-3Z',
  moon: 'M33 5a19 19 0 1 0 10 29C23 41 12 18 33 5Z',
}

export function DayAtmosphere({ icons, label }: { icons: readonly string[]; label: string }) {
  return <div className="day-atmosphere" aria-hidden="true">
    <span className="day-dashed-orbit" />
    {icons.map((icon, i) => <span key={i} className={`day-floating day-floating-${i}`}><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={paths[icon]} /></svg></span>)}
    <span className="day-ticket">{label}<i>↗</i></span>
    <span className="day-dust dust-one" /><span className="day-dust dust-two" /><span className="day-dust dust-three" />
  </div>
}
