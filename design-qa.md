# Design QA

## Reference

- Primary interaction and layout reference: `https://mchiu.co.uk/`
- Source captures: `public/qa/mchiu-source-desktop-*.png`
- Side-by-side comparison: `public/qa/source-vs-implementation.png`

## Result

Status: PASSED

- Recreated the warm light background, asymmetrical Bento grid, centered filter pill, quiet card surfaces, and in-page detail expansion behavior.
- Replaced all source branding, illustrations, copy, and project media with WIN portfolio content and assets.
- Verified 1440px, 1024px, and 390px layouts with no horizontal overflow.
- Verified all four filters and all six project open, summary-switch, and close flows.
- Verified production build completes and runtime reports no console errors.
- Added reduced-motion support, image aspect constraints, and responsive detail layouts.
- Rebuilt all six project covers from real portfolio screens, removed duplicate cover titles, and verified the same compositions in home cards and detail heroes.
- Stabilized filter changes with held grid height and spatial card transitions, preventing document-height clamping during category changes.
- Added shared cover transitions between project cards and detail heroes, plus a stable scrollbar gutter and exact scroll restoration on close and browser back.
- Matched the supplied detail-motion reference with a two-layer transition: the selected card surface expands into the detail canvas while its cover moves independently into the hero position; surrounding cards dim and blur, then detail copy enters after the spatial transition. Closing reverses both layers back to the original card.
- Reduced the home action cards to icon-only entrances with contextual hover/focus labels; contact details now open in an in-page modal with independent copy actions and no explanatory filler copy.
- Unified all project-card media and copy heights, aligned periods with the top metadata row, and made project arrows appear only on hover/focus.
- Reworked case studies into a single editorial column with a smaller hero, restrained title scale, and one consistent `760px` text/image boundary.
- Motion regression test confirms detail width remains unchanged and the original `665px` scroll position is restored exactly.

## Intentional Differences

- WIN uses a stronger editorial project hierarchy because the portfolio has longer case-study narratives.
- Contact cards expose WeChat and phone directly rather than linking to third-party networks.
- Project details use structured case sections instead of copying the reference site's content layout verbatim.
