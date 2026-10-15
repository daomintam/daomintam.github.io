export type Chapter = {
  kicker: string
  title: string
  body: string
  cta: string
  punchline: string
  symbol: string
  sticker: [string, string]
  color: string
  artwork: string
}

export const chapters: Chapter[] = [
  {
    artwork: '/img/fiction/lost-block.png',
    kicker: 'The midnight ping', title: 'TΛM & the lost block.',
    body: '11:59 PM. A block taps the window: “I got lost on the blockchain.” TΛM puts down his coffee, grabs his hoodie and asks the obvious question: “Have you tried refreshing?”',
    cta: 'Refresh the universe', punchline: '“Already did. The universe is still loading.”',
    symbol: '◈', sticker: ['STAY', 'CURIOUS'], color: '#9fd8bf',
  },
  {
    artwork: '/img/fiction/gas-bridge.png',
    kicker: 'The Gas bridge', title: 'Pay the toll in giggles.',
    body: 'The bridge demands 300 ETH. TΛM tells a joke about his empty wallet. The bridge laughs so hard its rails bend, forgetting the toll. “Is this proof-of-humor?” whispers the block.',
    cta: 'One more joke', punchline: '“My wallet is so decentralized, even I cannot locate the funds.”',
    symbol: 'HA!', sticker: ['STAY', 'CURIOUS'], color: '#ffb87e',
  },
  {
    artwork: '/img/fiction/consensus-city.png',
    kicker: 'Consensus City', title: 'Names beat endless codes.',
    body: 'Every door asks for an impossibly long code. TΛM puts a giant @ on the gate. “Let us just use our names.” The city sighs with relief. A robot gets so emotional it sheds three screws.',
    cta: 'Say GM to everyone', punchline: '“GM, TΛM!” — the whole city, including the toaster.',
    symbol: '@', sticker: ['STAY', 'CURIOUS'], color: '#b0d9bf',
  },
  {
    artwork: '/img/fiction/dawn-community.png',
    kicker: 'The last block before dawn', title: 'Go far. Together.',
    body: 'TΛM finds a home for the block. It carries no treasure, just an invitation to build something good together. The sun rises. TΛM opens his laptop. The coffee is cold; the community feels warmer.',
    cta: 'Collect your GM badge', punchline: 'Badge unlocked: making the universe a little less serious ☀',
    symbol: 'GM', sticker: ['GOOD', 'MORNING'], color: '#f4d278',
  },
]

export const chaptersVi: Chapter[] = [
  {
    artwork: '/img/fiction/lost-block.png',
    kicker: 'Tin nhắn lúc nửa đêm', title: 'TΛM & khối bị lạc.',
    body: '11:59 tối. Một khối gõ cửa sổ: “Tôi bị lạc trên blockchain.” TΛM đặt cốc cà phê xuống, kéo mũ áo lên rồi hỏi điều hiển nhiên: “Bạn thử làm mới chưa?”',
    cta: 'Làm mới vũ trụ', punchline: '“Thử rồi. Vũ trụ vẫn đang tải.”',
    symbol: '◈', sticker: ['LUÔN', 'TÒ MÒ'], color: '#9fd8bf',
  },
  {
    artwork: '/img/fiction/gas-bridge.png',
    kicker: 'Cây cầu Gas', title: 'Trả phí bằng tiếng cười.',
    body: 'Cây cầu đòi 300 ETH. TΛM kể một câu chuyện cười về chiếc ví trống rỗng. Cầu cười đến cong cả lan can rồi quên luôn phí qua đường. “Đây là bằng chứng hài hước à?” khối nhỏ thì thầm.',
    cta: 'Thêm một câu nữa', punchline: '“Ví của tôi phi tập trung đến mức chính tôi cũng không tìm thấy tiền.”',
    symbol: 'HA!', sticker: ['LUÔN', 'TÒ MÒ'], color: '#ffb87e',
  },
  {
    artwork: '/img/fiction/consensus-city.png',
    kicker: 'Thành phố Đồng thuận', title: 'Tên hay hơn mã dài.',
    body: 'Mọi cánh cửa đều hỏi một đoạn mã dài bất tận. TΛM đặt một ký hiệu @ khổng lồ lên cổng. “Dùng tên của chúng ta thôi.” Cả thành phố thở phào. Một robot xúc động đến rơi mất ba con ốc.',
    cta: 'Chào GM mọi người', punchline: '“GM, TΛM!” — cả thành phố đồng thanh, kể cả máy nướng bánh.',
    symbol: '@', sticker: ['LUÔN', 'TÒ MÒ'], color: '#b0d9bf',
  },
  {
    artwork: '/img/fiction/dawn-community.png',
    kicker: 'Khối cuối trước bình minh', title: 'Đi xa. Cùng nhau.',
    body: 'TΛM tìm được một mái nhà cho khối nhỏ. Nó không mang kho báu, chỉ mang lời mời cùng xây điều tốt đẹp. Mặt trời mọc. TΛM mở laptop. Cà phê đã nguội; cộng đồng thì ấm hơn.',
    cta: 'Nhận huy hiệu GM', punchline: 'Đã mở khóa huy hiệu: giúp vũ trụ bớt nghiêm túc một chút ☀',
    symbol: 'GM', sticker: ['CHÀO', 'BUỔI SÁNG'], color: '#f4d278',
  },
]
