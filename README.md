# TΛMVERSE

A standalone fictional Web3 story experience built with React, TypeScript and CSS.

Each chapter fits within one viewport on desktop, laptop, tablet and phone. Use the mouse wheel, horizontal trackpad gestures, touch swipes, arrow keys or chapter buttons to move horizontally between chapters. The main page does not scroll vertically. All four chapters stay in one continuous horizontal strip: drag with a mouse or touch to move it directly, then release to settle into the nearest chapter. Buttons glide between chapters; reduced motion makes navigation immediate.

On supported touch devices, use the phone icon in the footer to enable device tilt. Permission is requested only after tapping it; motion is processed locally, can be switched off, and is disabled when reduced motion is preferred. Sensor access requires a secure context (HTTPS in deployment).

The original character artwork is preserved in `source/public/img/me.svg` and `img/me.svg`. Chapter buttons glide for 2.3 seconds; wheel sensitivity and release momentum are intentionally restrained.

## Development

```bash
cd source
npm install
npm run dev
```

## Production build

```bash
cd source
npm run build
```

The generated static website is written to `dist/` and copied to the repository root for GitHub Pages.
