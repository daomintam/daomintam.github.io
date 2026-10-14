export type Topic = {
  id: string
  kind: 'fact' | 'fiction'
  href: string
  title: string
  description: string
  tag: string
  index: string
}

export const topics: Topic[] = [
  { id: 'day', kind: 'fiction', href: '#/20-tab', title: 'Não mở 20 tab.', description: 'Định làm việc. Lại lướt điện thoại. Một ngày rất bạn, qua 20 phiên bản TΛM. Bạn chọn chuyện gì xảy ra tiếp.', tag: 'Mới · Hài đời thường', index: '01' },
  { id: 'incidents', kind: 'fact', href: '#/su-co', title: 'Khi blockchain gặp sự cố.', description: 'Bốn sự kiện có thật. Những giới hạn lộ ra, cách cộng đồng phản ứng và bài học còn lại.', tag: 'Chuyện có thật', index: '01' },
  { id: 'tamverse', kind: 'fiction', href: '#/hu-cau', title: 'Một chiếc hoodie. Cả vũ trụ.', description: 'Theo chân TΛM và một khối bị lạc trong chuyến phiêu lưu không quá nghiêm túc.', tag: 'Chuyện hư cấu', index: '02' },
]
