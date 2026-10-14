export const xProfile = {
  displayName: 'TΛM 🔶',
  handle: '@daomintam',
  bio: 'Part of the @vibevibefun squad #vibevibe · Debugging life by day, airdropping gain by night. · NFA. DYOR.',
  location: 'Dev | Web3 & Crypto | Creator',
  verified: true,
  following: '9,312',
  followers: '9,360',
  url: 'https://x.com/daomintam',
} as const

// The story identity follows the X display name: retain letters/numbers,
// remove whitespace and decorative symbols, then append VERSE.
export const tamName = xProfile.displayName.replace(/[^\p{L}\p{N}]/gu, '')
export const wordmark = `${tamName}VERSE`
