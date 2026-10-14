export type Chapter = {
  kicker: string
  title: string
  body: string
  cta: string
  punchline: string
  symbol: string
  sticker: [string, string]
  color: string
}

export const chapters: Chapter[] = [
  {
    kicker: 'The midnight ping', title: 'TΛM & the lost block.',
    body: '11:59 PM. A block taps the window: “I got lost on the blockchain.” TΛM puts down his coffee, grabs his hoodie and asks the obvious question: “Have you tried refreshing?”',
    cta: 'Refresh the universe', punchline: '“Already did. The universe is still loading.”',
    symbol: '◈', sticker: ['STAY', 'CURIOUS'], color: '#9fd8bf',
  },
  {
    kicker: 'The Gas bridge', title: 'Pay the toll in giggles.',
    body: 'The bridge demands 300 ETH. TΛM tells a joke about his empty wallet. The bridge laughs so hard its rails bend, forgetting the toll. “Is this proof-of-humor?” whispers the block.',
    cta: 'One more joke', punchline: '“My wallet is so decentralized, even I cannot locate the funds.”',
    symbol: 'HA!', sticker: ['STAY', 'CURIOUS'], color: '#ffb87e',
  },
  {
    kicker: 'Consensus City', title: 'Names beat endless codes.',
    body: 'Every door asks for an impossibly long code. TΛM puts a giant @ on the gate. “Let us just use our names.” The city sighs with relief. A robot gets so emotional it sheds three screws.',
    cta: 'Say GM to everyone', punchline: '“GM, TΛM!” — the whole city, including the toaster.',
    symbol: '@', sticker: ['STAY', 'CURIOUS'], color: '#b0d9bf',
  },
  {
    kicker: 'The last block before dawn', title: 'Go far. Together.',
    body: 'TΛM finds a home for the block. It carries no treasure, just an invitation to build something good together. The sun rises. TΛM opens his laptop. The coffee is cold; the community feels warmer.',
    cta: 'Collect your GM badge', punchline: 'Badge unlocked: making the universe a little less serious ☀',
    symbol: 'GM', sticker: ['GOOD', 'MORNING'], color: '#f4d278',
  },
]
