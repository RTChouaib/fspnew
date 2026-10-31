# Public site design (tasteskill v2)

- Mode: overhaul. Direction dealt with `draw.mjs` (seed 1908948470): "The sentence is the layout".
- Kept from the brand: accent `#1857d1` (dark `#123e9e`), ink `#16232e`, DM Serif Display + Manrope, text wordmark with blue dot.
- Dropped: JetBrains Mono, the second blue (`#2563eb`, `#1d4ed8`), eyebrows, section numbers, italic accent words, icon cards,
  gradients, resting shadows, mock-ups with invented numbers.
- Product pictures are interface fragments built in HTML (`data-ui`) with real terms. They are labelled "Beispiel" where the
  content is sample content. No photographs are used.
- New pieces: `Reveal` (entrances), `TermFinder` (live demo of patient word to doctor term), `StageSlider`.
- Cookie banner: same wording, now a bar in the page flow instead of an overlay (it covered headlines while scrolling).
- All new styles live in `styles/site.css`; legacy marketing styles were pruned.

Not touched: payment, login and API code, checkout markup, legal copy, URLs, form field names.
App screens (dashboard, study, chat) keep their layout; they follow in a second pass.
