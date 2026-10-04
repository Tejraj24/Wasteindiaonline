# Studio Name — System Design Specification & Audit
**Reference Site:** [Odd Ritual Golf](https://oddritualgolf.com/)  
**Audit Viewports:** Desktop (1440px × 900px) & Mobile (390px × 844px)  
**Date of Audit:** October 2026  
**Auditor:** Senior Front-End Engineer & System Designer  

---

## 1. Design Tokens & Visual Hierarchy

### 1.1 Computed Colors & Swatches
From live computed styles and CSS custom properties:
- **Brand Accent Blue (`--swatch--brand`):** `#050fff` (`rgb(5, 15, 255)`) — Used for price highlights, selected variation states, active badges, and text selection background.
- **Brand Dark (`--swatch--dark` / Page Background):** `#000000` (`rgb(0, 0, 0)`) — Hero background, dark transitions, footer theme dark.
- **Page Light Main (`--_theme---background`):** `#ffffff` (`rgb(255, 255, 255)`) — Background for product grids, main editorial text, and modal containers.
- **Off-white / Light Grey (`--swatch--light-grey`):** `#f4f4f4` (`rgb(244, 244, 244)`) — Card backdrop, inputs inset fill.
- **Muted Text / Secondary (`--swatch--faded-text` / `--or-info`):** `#686060` & `#818181` — Subtitles, inactive menu links, metadata.
- **Subtle Dark Faded (`--swatch--dark-faded` scale):** 
  - `10%`: `rgba(2, 2, 2, 0.1)` (`#0202021a`)
  - `20%`: `rgba(2, 2, 2, 0.2)` (`#02020233`)
  - `30%`: `rgba(2, 2, 2, 0.3)` (`#0202024d`)
  - `80%`: `rgba(2, 2, 2, 0.8)` (`#020202cc`)
- **Border Subtle:** `rgba(255, 255, 255, 0.2)` on dark / `rgba(0, 0, 0, 0.1)` on light (`--_theme---border: #020202`).

### 1.2 Typography System
- **Primary Serif Family (`--_text-style---secondary-family`):**
  - Font: `Instrument Serif`, Georgia, serif (Google WebFont: `Instrument Serif:regular,italic`)
  - Roles: Hero slide numbers (`01`, `02`, `03`), section accents (`Scroll`, `Next`), sub-headers (`( FEATURED PRODUCTS )`), editorial flourishes.
- **Primary Sans / Grotesk Family (`--_text-style---font-family`):**
  - Font: `PP Neue Montreal` / fallback `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  - Roles: Brand logo, navigation, menu links, product headings, button labels, uppercase body.
- **Scale & Clamp Calculations:**
  - **Display / Big Hero Titles:** `clamp(2.625rem, 2.518rem + 0.536vw, 4rem)` (line-height: `0.95 - 1.0`, letter-spacing: `-0.03em`, weight: `600 - 800`)
  - **Slide Number (`.hero-slider_num`):** `clamp(1.75rem, 1.678rem + 0.357vw, 2rem)` (`Instrument Serif`, italic)
  - **Section Titles (`H2` / `H3`):** `clamp(1.75rem, 1.5rem + 1.25vw, 2.625rem)` (line-height: `1.1`, letter-spacing: `-0.02em`)
  - **Menu Links (`.menu-link`):** `clamp(2.5rem, 2rem + 2.5vw, 4.5rem)` (line-height: `0.95`, weight: `700`, uppercase, letter-spacing: `-0.03em`)
  - **Body Uppercase (`.body-upper`):** `0.875rem` - `1rem` (`14px - 16px`), letter-spacing: `0.05em - 0.1em`, weight: `500 - 600`, text-transform: `uppercase`
  - **Price Text:** `14px - 16px` (`.product-price_now`: `#050fff` bold, `.product-price_was`: line-through opacity 0.3)

### 1.3 Spacing Scale & Layout Grid
- 12-Column Responsive CSS Grid system:
  - `--site--max-width: min(150rem, 100vw)`
  - `--site--margin: clamp(1rem, 0.929rem + 0.357vw, 1.25rem)` (16px to 20px)
  - `--site--gutter: 0.625rem` (10px)
- **Fluid Sizing Scale:**
  - `--size--1rem`: `1rem` (16px)
  - `--size--1-5rem`: `1.5rem` (24px)
  - `--size--2rem`: `clamp(1.75rem, 1.679rem + 0.357vw, 2rem)`
  - `--size--3rem`: `clamp(2.625rem, 2.518rem + 0.536vw, 3rem)`
  - `--size--6rem`: `clamp(5rem, 4.714rem + 1.429vw, 6rem)`
  - `--size--10rem`: `clamp(8.75rem, 8.393rem + 1.786vw, 10rem)`
- **Border Radii:**
  - `--radius--small`: `0.5rem` (8px)
  - `--radius--main`: `1rem` (16px)
  - `--radius--round`: `100vw` (pill)
  - Buttons & card edges: `0px` (strict modernist brutalist edges) with rounded accents on specific pills/badges.

### 1.4 Z-Index Layer Stack
- `z-index: 1`: Background canvas & parallax image layers
- `z-index: 5`: Card hover overlays & product tag badges (`.product-tag`)
- `z-index: 10`: Standard page content sections
- `z-index: 50`: Fixed Header / Navigation (`.orgc-nav`)
- `z-index: 90`: Draggable gallery / swipe cursor overlay (`.cursor`)
- `z-index: 99`: Fullscreen Menu Overlay (`.nav[data-nav="open"]`)
- `z-index: 100`: Cart Drawer panel & backdrop
- `z-index: 110`: Newsletter Modal popup (`.signup-popup`)
- `z-index: 120`: Fullscreen Preloader overlay (`.preloader_wrap`)

---

## 2. Technical Libraries & Runtime Audit
Verified in window environment on live site:
- **GSAP:** v3.12.7 (`window.gsap`)
- **ScrollTrigger:** Registered (`window.ScrollTrigger`)
- **Observer:** Registered (`window.Observer`) for drag touch/pointer gestures
- **Flip:** Registered (`window.Flip`)
- **CustomEase:** Loaded (`ease-1`, `ease-2`, `ease-3`, `loaderEase`)
- **Lenis Smooth Scroll:** v1.2.3 (`window.Lenis`) synced with `gsap.ticker.add((time) => lenis.raf(time * 1000))`
- **SplitType:** Loaded for lines/words text reveal
- **Hammer.js:** Mobile swipe gesture detection for hero slides
- **Barba.js:** Page transitions (`@barba/core`) with clipping masks and coordinate shifts

---

## 3. Comprehensive Animation Timings & Easing Curves

### 3.1 Custom Bezier Easing Definitions
- `ease-1`: `M0,0 C0.15,0 0.15,1 1,1` (Swift mechanical smooth acceleration and clean settle)
- `ease-2`: `M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1` (Hero slide clip-path transition)
- `ease-3`: `cubic-bezier(0.65, 0.01, 0.05, 0.99)` (High-tension editorial slide reveal)
- `loaderEase`: `M0,0,C0,0,0.10,0.34,0.238,0.442,0.305,0.506,0.322,0.514,0.396,0.54,0.478,0.568,0.468,0.56,0.522,0.584,0.572,0.606,0.61,0.719,0.714,0.826,0.798,0.912,1,1,1,1`

### 3.2 Feature-by-Feature Animation Specifications

#### 1. Fullscreen Preloader
- **Trigger:** On initial session page load (`sessionStorage.getItem("visited") === null`)
- **Scroll Lock:** `lenis.stop()` on start; `lenis.start()` on complete.
- **Timeline Breakdown:**
  1. `loaderLogo`: `opacity: 0` -> `1`, delay `0.5s`, duration `1.0s`, ease `sine.in`.
  2. `loaderInnerBg`: `clipPath: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)` -> `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`, duration `1.0s`, ease `ease-3`.
  3. `loaderImageWrap`: `clipPath` wipe from top to bottom, duration `1.0s`, position `<15%`.
  4. `loaderImages`: `yPercent: -30` -> `0`, duration `1.0s`, position `<`.
  5. Exit wipe: `loaderInner` wipe bottom to top `polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)`, duration `1.0s`.
  6. `loader`: `clipPath` wipe out, duration `1.0s`, position `<30%`.
  7. On complete: `body.classList.remove('show-preloader')`, `sessionStorage.setItem("visited", "true")`.

#### 2. Hero 01/02/03 Slideshow
- **Trigger:** Click on slide index (`01`, `02`, `03`), click on Next arrow / indicator, or swipe left/right.
- **Duration:** `1.0s`, Easing: `ease-2`.
- **Forwards Transition:**
  - `nextItem`: `clipPath: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)` -> `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`
  - `prevItem`: `clipPath: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)` -> `polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)`
  - Parallax on inner imagery: `prevItemImg: yPercent 0 -> 10`, `nextItemImg: yPercent -10 -> 0`.
- **Backwards Transition:**
  - `nextItem`: `clipPath: polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)` -> `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`
  - `prevItem`: `clipPath: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)` -> `polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)`
  - Parallax: `prevItemImg: yPercent 0 -> -10`, `nextItemImg: yPercent 10 -> 0`.
- **Navigation Underline:** `[slide-underline]:after` scales from `scaleX(0)` to `scaleX(1)` with `transform-origin: left`, duration `400ms`.

#### 3. Fullscreen Menu Overlay
- **Trigger:** Hamburger / Menu button click; Close button click or `Escape` key.
- **Scroll Lock:** `lenis.stop()` on open; `lenis.start()` on close.
- **Open Timeline:**
  1. `overlay`: `autoAlpha: 0 -> 1`, ease `expo`.
  2. `menuLogoBg`: `yPercent: -101 -> 0`, ease `expo`.
  3. `bgPanels`: `yPercent: -101 -> 0`, stagger `0.1s`, duration `0.575s`, position `<15%`.
  4. `imgsWrap`: `clipPath` wipe from top + `yPercent: -50 -> 0`, duration `0.575s`, position `<20%`.
  5. `menuLinks`: `yPercent: -140 -> 0`, stagger `0.05s`, duration `0.575s`, position `<`.
  6. `fadeTargets`: `autoAlpha: 0 -> 1`, duration `0.575s`, ease `sine.out`, position `<70%`.
- **Hover on Menu Links:** Hovering any menu link dims siblings (`.menu-list-item.inactive { color: #686060 }`) and dynamically swaps the menu background image.
- **Close Timeline:** Reverse of open with `ease: expo.out`.

#### 4. Product Card Crossfade & Staggered Reveal
- **Hover State:** Card hover transitions primary image to secondary lifestyle image via `.product-overlay { opacity: 1 }` (duration `300ms ease-out`).
- **Scroll Reveal:** Staggered entrance (`0.15s` per card) using GSAP ScrollTrigger (`y: 40 -> 0`, `opacity: 0 -> 1`, duration `0.8s`).

#### 5. Cart Drawer Panel
- **Trigger:** "CART" button click in header.
- **Panel Motion:** Slides smoothly in from right `transform: translateX(100%) -> translateX(0%)`, duration `400ms cubic-bezier(0.25, 1, 0.5, 1)`.
- **Backdrop:** Fades in with dark blur overlay (`opacity: 0.5`).
- **Scroll Containment:** Drawer list has `data-lenis-prevent` to allow mouse wheel inside cart drawer without moving page scroll.

#### 6. Horizontal Draggable Gallery
- **Observer Gesture:** Detects `pointer,touch` events.
- **Drag Feedback:** Card scales slightly down to `0.95` (`duration: 0.3s`) while dragging; recovers on release.
- **Continuous Momentum:** `gsap.ticker` continuously animates subtle auto-scroll until user drags.
- **Wrap Mechanism:** Infinite wrap using `gsap.utils.wrap(-half, 0)`.

#### 7. Marquee / Ticker Band
- **Animation:** CSS Keyframes infinite horizontal translate `-50%`.
- **Pause on Hover:** `animation-play-state: paused` on `:hover`.
- **Accessibility:** `prefers-reduced-motion: reduce` stops continuous translate.

#### 8. Community / Partner Cards
- **Scroll Parallax:** `[img-scroll] img` travels `yPercent: 0 -> 20` over scroll range with `scrub: true`.
- **Hover Clip:** Outbound partner cards reveal image overlay with polygon clip `0% 0% -> 100% 100%`.

#### 9. Footer & Easter Egg Reveal
- **Header Hide on Footer:** When footer enters viewport (`ScrollTrigger start: "top 20%"`), navigation pulls up `transform: translateY(-100%)`.
- **Easter Egg:** Hovering `[easter-trigger]` animates floating follow images tracking cursor with `clip-path` and `yPercent`.

#### 10. Newsletter Modal
- **Trigger:** Automatic timer (10s) or manual trigger via footer/menu newsletter button.
- **Exit:** Click outside backdrop, close 'X' icon, or `Escape` key.
- **Validation:** Instant feedback for email format, success message upon submission.

#### 11. Page Transitions
- **GSAP / Barba Sync Animation:**
  - Exiting page: `yPercent: 0 -> 20`, `opacity: 1 -> 0.4`, duration `1.0s`, ease `ease-3`.
  - Entering page: starts at `marginTop: -20vh`, `clipPath: polygon(0% 0%, 100% 0%, 100% 0vh, 0% 0vh)` -> wipes down to full height `100vh`, duration `1.0s`.

#### 12. Custom Follow Cursor
- **Desktop Only:** Active on `(min-width: 992px) and (pointer: fine)`.
- **Motion:** `gsap.quickTo` with `power3` easing on `x` and `y`.
- **Edge Flip:** Inverts X/Y offset when within 10% of window edge (`xPercent: -100`, `yPercent: -100`).
- **Dynamic Text:** Reads `data-cursor` ("DRAG", "VIEW", "CLOSE", "EXPLORE").

---

## 4. Responsive Breakpoints & Adaptations

| Breakpoint | Target Screen | Key Layout & Behavior Changes |
| :--- | :--- | :--- |
| **Desktop (≥ 992px)** | 1440px+ Laptop & iMac | Full 12-col grid, interactive follow cursor enabled, 4-col product grid, hover clip-path image reveals, footer hover preview enabled. |
| **Tablet (768px – 991px)** | iPad / Small Laptops | 2-col product grid, follow cursor disabled, touch swipe enabled for hero, navigation stays simplified, footer links wrap into 2 columns. |
| **Mobile (≤ 767px / 390px)** | iPhone 12/13/14, Pixel | Mobile header layout: Left "MENU", Center "Studio Name", Right "CART". Hero slide navigation shows "01" left and "Next" right. Product grid becomes responsive 2-column or 1-column layout. Draggable gallery supports touch gestures. Drawer takes 100% width. |

---

## 5. Visual Reference & Screenshot Audit Log
Recorded in `/docs/screenshots/`:
1. `01_desktop_hero_01.png` — Hero slide 01 at 1440px desktop
2. `02_desktop_hero_02.png` — Hero slide 02 at 1440px desktop
3. `03_desktop_hero_03.png` — Hero slide 03 at 1440px desktop
4. `04_desktop_menu_open.png` — Fullscreen menu overlay with stacked bold typography & image panel
5. `05_desktop_cart_open.png` — Hero slide 03 & Cart drawer inspection
6. `06_desktop_product_grid.png` — Editorial manifesto statement & 4-column product grid
7. `07_desktop_product_hover.png` — Secondary lifestyle image crossfade on card hover
8. `08_desktop_gallery.png` — Horizontal drag carousel with bracketed view button
9. `09_desktop_community.png` — Community / Giving back section
10. `10_desktop_footer.png` — Full footer with emblem, newsletter signup, and 4-column site index
11. `11_desktop_newsletter_modal.png` — Two-column newsletter popup modal
12. `12_mobile_hero.png` — Mobile hero at 390px width with "01" and "Next" indicators
13. `13_mobile_menu.png` — Mobile fullscreen menu overlay with bottom image panel
14. `14_mobile_products.png` — Mobile product grid layout
15. `15_mobile_footer.png` — Mobile stacked footer

---
*Design specification complete and verified against the live production build.*
