# Bacaress Villa Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A single-page, mobile-friendly landing site for Bacaress Villa with a date-range booking calendar and a mock payment flow.

**Architecture:** Plain static files. Pure booking logic lives in `booking.js` (an ES module, tested with Node's built-in runner). `app.js` wires that logic to the DOM. No framework, no build step, no backend. Taken dates are a hardcoded list plus bookings saved in `localStorage`.

**Tech Stack:** HTML, CSS, vanilla JS (ES modules), `node --test` for the one logic test. No dependencies.

**Spec:** `docs/superpowers/specs/2026-11-12-bacaress-villa-landing-design.md`

## Global Constraints

- Villa name: "Bacaress Villa". Price: ₱15,000 per night, whole villa, one group per booking.
- Style "Tropical Resort", recolored to photo palette: olive-lime green (primary), pool blue (buttons, available dates), gold (accents), warm wood brown (text/footer), cream backgrounds. Serif headings, sans-serif body. Sample exact hex values from the photos.
- Page order: sticky header with Book now, hero (pool photo), Perfect for (Birthdays, Friends/Barkada, Family reunions, Small events), gallery (4 photos), amenities, booking, mock checkout (inline), footer.
- Booking is a date range (check-in, check-out); a booked night blocks the villa. The check-out day stays available for the next guest.
- Payment is UI only (GCash, card, bank transfer). Never collect, store or send card data.
- Photos source: `/tmp/claude-1000/-home-rquirap-projects-dsa/60b968cb-cfad-4f5d-b063-f6c0782a729e/images/` (`1.jpg` bedroom, `2.jpg` living area, `3.jpg` terrace, `4.jpg` pool, which is the hero). Copy to `images/`.
- Placeholders, kept in one `VILLA` constant in `app.js`: location, contact number, max guests, check-in/out times.
- Works at phone width (about 400px) with at least 16px side gutters. Accessibility basics: alt text, labelled form fields, keyboard-usable calendar buttons.
- Includes a "Reset demo" control that clears saved bookings.
- No dependencies, no build step.

## Review Focus

- Check-out date earlier than or equal to check-in: rejected, no price shown.
- Range that spans a taken night: rejected with a visible message.
- Back-to-back bookings (new check-in equals an existing check-out): allowed.
- Past dates: not selectable.
- Refresh after confirming: the booking stays blocked; Reset demo clears it.

## File Structure

- `index.html`: all sections and the booking/checkout markup.
- `styles.css`: palette variables, layout, responsive rules.
- `booking.js`: pure functions (no DOM): `nightsBetween`, `isRangeFree`, `totalPrice`.
- `app.js`: calendar render, selection, form, mock checkout, localStorage, reset.
- `booking.test.js`: the one logic test file.
- `images/`: the four compressed photos.
- `.gitignore`: ignores `.superpowers/`.

---

### Task 1: Save the project state and add the photos

**Files:**
- Create: `.gitignore`, `images/1.jpg` to `images/4.jpg`

- [ ] **Step 1:** `git init` in `/home/rquirap/projects/dsa`; create `.gitignore` containing `.superpowers/`.
- [ ] **Step 2:** Copy the four photos into `images/` with the names above. If any is over about 400 KB, downscale it to at most 1600px wide.
- [ ] **Step 3:** Commit the existing `docs/` (spec and this plan) together with the above.

```bash
git add -A && git commit -m "chore: init repo with spec, plan, photos"
```

### Task 2: Booking logic (TDD)

**Files:**
- Create: `booking.js`
- Test: `booking.test.js`

**Interfaces:**
- Produces:
  - `nightsBetween(checkIn: string, checkOut: string): number`, with ISO `YYYY-MM-DD` inputs. Returns the number of nights, which is 0 or negative for invalid ranges.
  - `isRangeFree(checkIn: string, checkOut: string, takenNights: string[]): boolean`. `takenNights` lists each blocked night's date, the night starting that day. The range occupies nights `checkIn` up to but excluding `checkOut`.
  - `totalPrice(nights: number, rate = 15000): number`

- [ ] **Step 1: Write the failing tests** in `booking.test.js` using `node:test` and `node:assert`:
  - `nightsBetween("2026-12-01","2026-12-04") === 3`
  - `nightsBetween("2026-12-04","2026-12-04") === 0`
  - `nightsBetween("2026-12-05","2026-12-04") < 0`
  - `isRangeFree("2026-12-01","2026-12-03",["2026-12-02"]) === false`
  - `isRangeFree("2026-12-01","2026-12-03",["2026-12-03"]) === true` (back-to-back)
  - `isRangeFree("2026-12-03","2026-12-05",["2026-12-01","2026-12-02"]) === true`
  - `totalPrice(3) === 45000`
- [ ] **Step 2:** Run `node --test`. Expected: FAIL (module not found).
- [ ] **Step 3: Implement** the three functions in `booking.js` as named ES exports. Use `Date.UTC` parsing to avoid timezone and DST drift.
- [ ] **Step 4:** Run `node --test`. Expected: all PASS.
- [ ] **Step 5:** Commit: `git add booking.js booking.test.js && git commit -m "feat: booking logic"`

### Task 3: Static page (layout, palette, sections)

**Files:**
- Create: `index.html`, `styles.css`

**Interfaces:**
- Produces element ids used by Task 4: `#calendar`, `#range-summary`, `#booking-form` (fields `name`, `email`, `phone`, `guests`), `#pay-step`, `#confirm-step`, `#reset-demo`, plus nav and hero links to `#book`.

- [ ] **Step 1:** Write `index.html` with the sections in Global Constraints. Every Book now button links to `#book`. Include `<script type="module" src="app.js">` at the end. Each photo gets meaningful `alt` text.
- [ ] **Step 2:** Write `styles.css` with CSS variables for the palette (sample hex values from the photos), a sticky header, responsive grids for the occasion cards and gallery, and at least 16px side gutters.
- [ ] **Step 3:** Open `index.html` in a browser at desktop width and at a 400px-wide window. Expected: no horizontal scroll, all four photos load, and Book now is always reachable.
- [ ] **Step 4:** Commit: `git add index.html styles.css && git commit -m "feat: landing page layout"`

### Task 4: Calendar, booking form, mock checkout

**Files:**
- Create: `app.js`
- Modify: `index.html`, `styles.css` (only for calendar and checkout states)

**Interfaces:**
- Consumes: `nightsBetween`, `isRangeFree`, `totalPrice` from `booking.js`, and the ids from Task 3.
- Produces: `VILLA` constant (name, rate, maxGuests, location, contact, checkIn/checkOut times); `TAKEN` (hardcoded array of ISO nights); `loadBookings(): string[]` and `saveBooking(checkIn, checkOut): void`, backed by `localStorage` under the key `bacaress.bookings`. Wrap storage access in try/catch and fall back to in-memory.

- [ ] **Step 1:** Render a two-month calendar into `#calendar` using `<button>` elements per day. Past days are disabled, taken nights are marked unavailable, and free nights are marked available (pool blue). Next/previous month buttons.
- [ ] **Step 2:** Click-to-select range: first click sets check-in, second sets check-out. If the range is invalid (not after check-in, or `isRangeFree` is false), show an inline message in `#range-summary` and do not advance. Otherwise show the nights and total in pesos (`₱45,000` format via `toLocaleString("en-PH")`).
- [ ] **Step 3:** The guest form shows only after a valid range. Validate required fields, and `guests` between 1 and `VILLA.maxGuests`. On submit, show `#pay-step` with GCash, Card and Bank transfer options. Card shows no input fields; the whole step is labelled "Demo only, no real payment".
- [ ] **Step 4:** "Pay" shows `#confirm-step` with a generated reference like `BV-` plus 6 random characters, saves the booking via `saveBooking` for every night in the range, and re-renders the calendar so those nights are blocked.
- [ ] **Step 5:** `#reset-demo` clears `bacaress.bookings` and re-renders.
- [ ] **Step 6: Verify manually** (serve with `python3 -m http.server`, open in a browser):
  - Pick a valid range, then fill the form, pay, and see the confirmation and blocked dates.
  - Refresh: the dates stay blocked.
  - Reset demo: the dates free up.
  - Select a range spanning a taken night: the message appears.
  - Select a past date: nothing happens.
  - Select a check-in equal to an existing check-out: allowed.
- [ ] **Step 7:** Commit: `git add -A && git commit -m "feat: booking calendar and mock checkout"`

### Task 5: Final pass

- [ ] **Step 1:** Run `node --test` (must pass), and re-check the page at 400px and desktop. Tab through the page with the keyboard to confirm the calendar and form are reachable.
- [ ] **Step 2:** Replace any leftover placeholder text that looks unfinished, and keep the `VILLA` placeholders clearly marked for the owners.
- [ ] **Step 3:** Commit: `git add -A && git commit -m "chore: final polish"`
