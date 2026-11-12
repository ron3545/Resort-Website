# Bacaress Villa Landing Page: Design

## Intent
Bacaress Villa is a single private villa (indoor pool with jacuzzi, bedroom with queen + two bunk beds, living area, terrace). The owners are just starting out. They need a high-converting landing page that shows what the villa offers and who it is for, and lets a visitor pick a date and "book and pay" in a few clicks. This is a **sample/demo**: no real backend or payment processing yet.

## Audience
Everyone: birthdays, barkada/friends bonding, family reunions, small events. One group/family per booking (one villa, no shared stays).

## Goals
- Visitor understands in 5 seconds: private villa with a pool, rentable for any occasion.
- Clear "Book now" button visible at all times (sticky header + every section).
- Calendar shows available vs. taken dates; picking dates leads to a guest form and a mock payment step.
- Looks modern and premium, works well on phones (most Filipino traffic is mobile).

## Non-goals
- Real payments, real availability storage, accounts, admin dashboard, multi-villa support, CMS.

## Anti-goals
- Slow, heavy page; stock-looking visuals that hide the real photos; a calendar that looks bookable but dead-ends with no confirmation.

## Look (decided with owner)
Direction **A "Tropical Resort"**, recolored to the photos' brand palette (builder may fine-tune exact hex values by sampling the photos):
- Olive-lime green (curtains): primary brand color, headings, highlights
- Pool blue (mosaic tiles): buttons, "available" dates
- Gold (ceiling trim, photo frame): small accents, price tag
- Warm wood brown (bed frames, floor): text, footer
- Cream/white backgrounds so photos lead
- Serif headings, clean sans-serif body, large photos

## Page flow (assistant's proposal, not yet confirmed)
1. Sticky header: logo "Bacaress Villa" + Book now
2. Hero: pool photo, headline, price (₱15,000), Book now
3. "Perfect for…": cards for Birthdays, Friends/Barkada, Family reunions, Small events
4. Gallery: the 4 provided photos (bedroom, living area, terrace, pool)
5. Amenities: pool + jacuzzi, bedroom with queen + 2 bunk beds, living area, terrace, etc.
6. Booking: calendar (available/taken), guest form, price summary
7. Mock checkout: GCash / card / bank transfer options, ending in a confirmation screen
8. Footer: contact, location

## Constraints and decisions
- Pricing: ₱15,000 for the whole villa. **Assumed per night** (assistant's call, unconfirmed).
- Booking is per whole villa; a booked date blocks it for everyone.
- Mock availability: a hardcoded list of taken dates; "confirmed" bookings in the session are blocked in the browser only (localStorage is fine). No server.
- Payment step is a fake UI only; no card data is collected or sent anywhere.
- Photos: the four provided images, copied into the project.
- Stack (assistant's call, following the minimal-dependency preference): plain HTML/CSS/JS, one page, no framework or build step, calendar built by hand or a native date control. Upgrade to a framework + backend only when real payments/bookings are needed.
- Project is saved as a git repository from the start.

## Calls made after review (assistant's, easy to change)
- Photos live at `/tmp/claude-1000/-home-rquirap-projects-dsa/60b968cb-cfad-4f5d-b063-f6c0782a729e/images/`: `1.jpg` bedroom, `2.jpg` living area, `3.jpg` terrace, `4.jpg` pool + jacuzzi (hero). Copy into the project's `images/`, compress to reasonably sized JPEG/WebP.
- Palette hex values: sample from the photos.
- Mock checkout is an inline step on the same page (no separate page/modal), ending in a confirmation with a made-up reference number.
- A small "Reset demo" control clears locally saved bookings so the calendar can be demoed repeatedly.
- Hosting: any static host (e.g. GitHub Pages); relative asset paths.
- Taken date = the night starting that day; check-out day stays available for the next guest (only matters if range booking, see below).

## Open item for the owner
- Per night, per stay, or day-use? Decides single-date vs. date-range calendar. (Default if unanswered: per night, range selection, price = nights × ₱15,000.)

## Unknowns left to the builder (with defaults)
- Location/address, contact number, social links: placeholders.
- Guest capacity: placeholder (e.g. "up to 10 guests"), editable in one place.
- Check-in/check-out times, minimum stay, extra-guest fees: placeholders.
- Copywriting, exact hex colors, section order tweaks.
