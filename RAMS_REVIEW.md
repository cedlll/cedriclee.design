# Rams Design Review: src/ + galaga/

---

## src/App.tsx

### CRITICAL (0 issues)
- All interactive elements have accessible names (theme toggle: `aria-label`; links: text; section more: "More ↓"/"Less ↑"; Galaga link: `aria-label="Play Galaga"`).
- All `<img>` have `alt` (profile photo uses `alt=""` — correct for decorative image in `aria-hidden` wrapper).
- All links use proper `href`; external links use `rel="noopener noreferrer"`.

### SERIOUS (1 issue)
- **Touch target too small (2.5.5)** — Line 96: Section "More" button has `min-height: 24px`; WCAG 2.5.5 recommends at least 44×44px for touch targets.
  - **Fix:** Increase tap area (e.g. `min-height: 44px`, `padding` so total ≥ 44px, or use `min-block-size: 44px` and adequate padding).

### MODERATE (0 issues)
- Heading hierarchy: single h1 (profile title), section labels as h2 — OK.
- No positive `tabIndex` or non-semantic click handlers found.

---

## src/components/InnerPage.tsx

### CRITICAL (0 issues)
- Images in point/image/carousel blocks use `alt` from data.
- Carousel prev/next have `aria-label="Previous slide"` / `"Next slide"`.
- Dot buttons have `aria-label={`Slide ${i + 1}`}` and `aria-selected` on container `tablist`.

### SERIOUS (2 issues)
- **Focus outline missing (2.4.7)** — Carousel dot buttons (`.inner-page-carousel-dot`) have no `:focus-visible` style in InnerPage.css. Keyboard users may not see focus.
  - **Fix:** Add `.inner-page-carousel-dot:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }` (and ensure outline is visible in both themes).
- **Touch target too small (2.5.5)** — Carousel dots are 8×8px (InnerPage.css ~L201). Below 44×44px minimum.
  - **Fix:** Use a larger hit area with same visual size, e.g. `padding: 18px; width: 8px; height: 8px; box-sizing: content-box;` so the control is 44×44px, or wrap in a 44×44px button with the dot as visual only.

### MODERATE (0 issues)
- Carousel uses `role="tablist"` / `role="tab"` with `aria-selected` — appropriate.

---

## galaga/index.html + galaga/style.css + galaga/game.js

### CRITICAL (0 issues)
- Close control is an `<a>` with `aria-label="Close and return to cclee.design"` and valid `href="/"`.
- START GAME and PLAY AGAIN are `<button>` with visible text — accessible names OK.
- Canvas is not focusable; game uses document-level keydown — acceptable for this game pattern.

### SERIOUS (1 issue)
- **Focus style on game buttons (2.4.7)** — `.start-screen button` and `.game-over-screen button` have `:hover` but no explicit `:focus` or `:focus-visible`. If any global CSS removes default outline, focus would be invisible.
  - **Fix:** Add e.g. `.start-screen button:focus-visible, .game-over-screen button:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 4px; }` in galaga/style.css (match close button pattern).

### MODERATE (0 issues)
- Close button uses `:focus`; prefer `:focus-visible` for keyboard-only focus indication (avoids visible outline on mouse click). Not critical.

---

## Visual design (brief)

- **Layout:** Consistent spacing (gaps, padding) in App and InnerPage; no obvious overflow or z-index issues.
- **Typography:** System fonts + DM Sans / DM Mono with fallbacks; line-heights set.
- **Color:** CSS variables used; hover/focus generally defined. Carousel dots and Galaga start/restart buttons need explicit focus as above.
- **Components:** Theme toggle, section more, Galaga link, back link, and carousel prev/next have focus styles; carousel dots and Galaga modal buttons need focus styles and (for dots) larger touch targets.

---

═══════════════════════════════════════════════════
SUMMARY
═══════════════════════════════════════════════════

- **Critical:** 0
- **Serious:** 4 (section-more touch target; carousel dot focus + touch target; Galaga start/restart focus)
- **Moderate:** 0

**Score: 82/100** — Solid base (good labels, links, and most focus states). Deductions mainly for touch target size and missing focus on carousel dots and Galaga buttons.

═══════════════════════════════════════════════════
