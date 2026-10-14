import type { Incident } from '../data/incidents'

export function IncidentVisual({ incident, responding = false, compact = false }: { incident: Incident; responding?: boolean; compact?: boolean }) {
  const id = incident.id
  const block = (x: number, y: number, label: string, accent = false) => <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}><rect width="88" height="64" rx="12" fill={accent ? 'var(--case-color)' : '#192128'} stroke={accent ? 'var(--case-color)' : '#40505d'} /><path d="M13 15h17m-17 8h27" stroke={accent ? '#18211d' : '#738592'} strokeWidth="2"/><text className={accent ? 'diagram-node-label active' : 'diagram-node-label'} x="44" y="48" fill={accent ? '#111b16' : '#e8eee9'} textAnchor="middle" fontSize="12" fontFamily="monospace">{label}</text></g>
  return <figure className={`incident-visual ${compact ? 'visual-compact' : ''}`}>
    <svg viewBox="0 0 520 380" role="img" aria-label={`Sơ đồ minh họa ${incident.chain}: ${responding ? 'phản ứng với sự cố' : 'tình huống sự cố'}`}>
      <defs><pattern id={`grid-${id}-${compact}`} width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#536470" opacity=".45"/></pattern></defs>
      <rect width="520" height="380" rx="24" fill={`url(#grid-${id}-${compact})`}/>
      <circle cx="260" cy="180" r="145" fill="none" stroke="currentColor" strokeOpacity=".12"/><circle cx="260" cy="180" r="112" fill="none" stroke="currentColor" strokeOpacity=".1" strokeDasharray="3 9"/>
      {id === 'bitcoin-2013' && <>
        <path className="diagram-flow" d={responding ? 'M90 170H435' : 'M90 170H240Q280 170 302 108H435M240 170Q280 170 302 240H435'} fill="none" stroke="var(--case-color)" strokeWidth="3" strokeDasharray="7 7"/>
        {block(50,138,'BLOCK')}{block(208,138,'0.7',responding)}{block(370,responding ? 138 : 76,responding ? 'CHUỖI CHUNG' : '0.8',responding)}
        {!responding && block(370,208,'0.7')}
        <text x="260" y="325" textAnchor="middle">{responding ? 'PHỐI HỢP ĐỂ TRỞ LẠI MỘT CHUỖI' : 'CÙNG BLOCK · KHÁC QUYẾT ĐỊNH'}</text>
      </>}
      {id === 'ethereum-dao' && <>
        <path className="diagram-flow" d="M115 177H410" fill="none" stroke="var(--case-color)" strokeWidth="3" strokeDasharray="7 7"/>
        {block(55,145,'THE DAO')}{block(370,145,responding ? 'WITHDRAW DAO' : 'LỖ HỔNG',responding)}
        <path d="m260 100 35 62-35 22-35-22zm-35 73 35 44 35-44-35 22z" fill="var(--case-color)" opacity=".85"/>
        <text x="260" y="325" textAnchor="middle">{responding ? 'DAO FORK · BLOCK 1.920.000' : 'HỢP ĐỒNG ỨNG DỤNG ≠ GIAO THỨC'}</text>
      </>}
      {id === 'bnb-token-hub' && <>
        <path d="M100 180H215M305 180H430" stroke="var(--case-color)" strokeWidth="3" fill="none"/>
        <path d="m215 180 16-18 15 36 15-36 15 36 15-18h14" stroke={responding ? 'var(--case-color)' : '#ed8f80'} strokeWidth="3" fill="none"/>
        {block(40,148,'BEACON')}{block(392,148,'BSC')}
        <circle cx="260" cy="180" r="48" fill="#141c22" stroke="var(--case-color)"/>
        {responding ? <path d="M246 159v42m28-42v42" stroke="var(--case-color)" strokeWidth="9" strokeLinecap="round"/> : <text x="260" y="193" textAnchor="middle" className="diagram-alert">!</text>}
        <text x="260" y="325" textAnchor="middle">{responding ? 'PHỐI HỢP VALIDATOR · TẠM DỪNG BSC' : 'BẰNG CHỨNG Ở CẦU NỐI BỊ GIẢ MẠO'}</text>
      </>}
      {id === 'solana-2024' && <>
        <circle className={responding ? 'diagram-ring' : ''} cx="260" cy="180" r="85" fill="none" stroke="var(--case-color)" strokeWidth="3" strokeDasharray={responding ? '8 9' : '340 194'} />
        {block(216,148,responding ? 'v1.17.20' : 'JIT CACHE',responding)}
        <path d="m324 116 10 25-27-2" fill="none" stroke="var(--case-color)" strokeWidth="5" strokeLinecap="round"/>
        <text x="260" y="325" textAnchor="middle">{responding ? 'BẢN VÁ + PHỐI HỢP KHỞI ĐỘNG LẠI' : 'BIÊN DỊCH LẠI · LẶP LẠI · MẮC KẸT'}</text>
      </>}
      <text x="24" y="30" className="diagram-corner">{incident.ticker} / CASE FILE</text>
      <circle cx="486" cy="26" r="4" fill="var(--case-color)"/>
    </svg>
    {!compact && <figcaption>Sơ đồ minh họa đơn giản hóa · không phải dữ liệu trực tiếp</figcaption>}
  </figure>
}
