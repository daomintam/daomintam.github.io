import { xProfile } from '../data/xProfile'

export function XProfileCard({ language }: { language: 'en' | 'vi' }) {
  const vi = language === 'vi'
  return <a className="x-card" href={xProfile.url} target="_blank" rel="noreferrer" title={`${xProfile.bio} · ${xProfile.location}`} aria-label={`${vi ? 'Mở' : 'Open'} ${xProfile.displayName} ${vi ? 'trên' : 'on'} X`}>
    <div className="x-avatar-wrap">
      <img src="/img/x-avatar.jpg" alt={`${xProfile.displayName} X profile avatar`} />
    </div>
    <div className="x-main">
      <div className="x-card-top">
        <svg className="x-logo" viewBox="0 0 24 24" aria-label="X" role="img"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817-5.967 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" /></svg>
      </div>
      <div className="x-name-row"><h2>{xProfile.displayName}</h2>{xProfile.verified && <svg className="verified-badge" viewBox="0 0 22 22" role="img" aria-label={vi ? 'Tài khoản đã xác minh' : 'Verified account'}><circle cx="11" cy="11" r="10" /><path d="m6.7 11.2 2.7 2.7 5.9-6" /></svg>}</div>
      <p className="x-handle">{xProfile.handle}</p>
    </div>
  </a>
}
