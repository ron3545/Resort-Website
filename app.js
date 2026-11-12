import { nightsBetween, isRangeFree, totalPrice } from "./booking.js";

export const VILLA = {
  name: "Bacaress Villa",
  rate: 15000,
  maxGuests: 10,
  location: "Philippines, exact address to be announced (placeholder)",
  contact: "+63 900 000 0000 (placeholder)",
  checkIn: "2:00 PM",
  checkOut: "12:00 PM",
};

// Hardcoded demo nights (a night = the date it starts; check-out day stays free).
export const TAKEN = [
  "2026-11-20", "2026-11-21", "2026-11-22",
  "2026-12-05", "2026-12-06",
  "2026-12-24", "2026-12-25", "2026-12-26", "2026-12-27",
  "2027-01-09", "2027-01-10",
];

const KEY = "bacaress.bookings";
let memory = []; // fallback when localStorage is unavailable

export function loadBookings() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    return [...new Set([...memory, ...(Array.isArray(v) ? v : [])])];
  } catch {
    return memory;
  }
}
const store = (nights) => {
  memory = nights;
  try { localStorage.setItem(KEY, JSON.stringify(nights)); } catch { /* in-memory only */ }
};
const nightsOf = (a, b) => {
  const [y, m, d] = a.split("-").map(Number);
  return Array.from({ length: nightsBetween(a, b) }, (_, i) => iso(new Date(Date.UTC(y, m - 1, d + i))));
};
export function saveBooking(checkIn, checkOut) {
  store([...new Set([...loadBookings(), ...nightsOf(checkIn, checkOut)])]);
}
const clearBookings = () => {
  memory = [];
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
};

function iso(d) { return d.toISOString().slice(0, 10); }
const peso = (n) => "₱" + n.toLocaleString("en-PH");
const taken = () => [...TAKEN, ...loadBookings()];

if (typeof document !== "undefined") init();

function init() {
  const $ = (id) => document.getElementById(id);
  const cal = $("calendar"), summary = $("range-summary"), form = $("booking-form");
  const pay = $("pay-step"), confirm = $("confirm-step");
  const t = new Date();
  const today = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
  let view = new Date(Date.UTC(+today.slice(0, 4), +today.slice(5, 7) - 1, 1));
  let checkIn = null, checkOut = null;

  const msg = document.createElement("p");
  msg.id = "form-msg"; msg.setAttribute("role", "alert");
  form.insertBefore(msg, form.querySelector("button"));
  form.noValidate = true;
  form.guests.max = VILLA.maxGuests;

  const hideSteps = () => { form.hidden = pay.hidden = confirm.hidden = true; msg.textContent = ""; };

  function monthEl(first) {
    const y = first.getUTCFullYear(), m = first.getUTCMonth();
    const box = document.createElement("div");
    box.className = "month";
    box.innerHTML = `<h3>${first.toLocaleDateString("en-PH", { month: "long", year: "numeric", timeZone: "UTC" })}</h3>`;
    const grid = document.createElement("div");
    grid.className = "days";
    for (const w of ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]) grid.insertAdjacentHTML("beforeend", `<span class="dow" aria-hidden="true">${w}</span>`);
    for (let i = 0; i < first.getUTCDay(); i++) grid.append(document.createElement("span"));
    const taking = taken(), pickingOut = checkIn && !checkOut;
    for (let n = 1, last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate(); n <= last; n++) {
      const d = iso(new Date(Date.UTC(y, m, n)));
      const past = d < today, isTaken = taking.includes(d);
      // A taken day is still a valid check-out when picking the end of a range.
      const asCheckOut = pickingOut && d > checkIn && !past;
      const inRange = checkIn && d >= checkIn && (checkOut ? d < checkOut : d === checkIn);
      const b = document.createElement("button");
      b.type = "button"; b.textContent = n; b.dataset.date = d;
      b.className = "day " + (past ? "past" : isTaken ? "taken" : "free") + (inRange ? " selected" : "") + (d === checkOut ? " out" : "");
      b.disabled = past || (isTaken && !asCheckOut);
      const label = new Date(d + "T00:00:00Z").toLocaleDateString("en-PH", { dateStyle: "full", timeZone: "UTC" });
      b.setAttribute("aria-label", `${label}, ${past ? "past" : isTaken ? (asCheckOut ? "booked night, available as check-out" : "unavailable") : "available"}${inRange ? ", selected" : ""}`);
      grid.append(b);
    }
    box.append(grid);
    return box;
  }

  function render() {
    const focusId = document.activeElement?.closest("#calendar") && (document.activeElement.id || document.activeElement.dataset.date);
    const next = new Date(Date.UTC(view.getUTCFullYear(), view.getUTCMonth() + 1, 1));
    cal.replaceChildren();
    cal.innerHTML = `<div class="cal-nav"><button type="button" id="prev" aria-label="Previous month">&larr;</button><button type="button" id="next" aria-label="Next month">&rarr;</button></div>`;
    cal.querySelector("#prev").disabled = view <= new Date(Date.UTC(+today.slice(0, 4), +today.slice(5, 7) - 1, 1));
    const wrap = document.createElement("div");
    wrap.className = "months";
    wrap.append(monthEl(view), monthEl(next));
    cal.append(wrap);
    if (focusId) (cal.querySelector(`#${CSS.escape(focusId)}, [data-date="${focusId}"]`))?.focus();
  }

  const shift = (n) => { view = new Date(Date.UTC(view.getUTCFullYear(), view.getUTCMonth() + n, 1)); render(); };

  cal.addEventListener("click", (e) => {
    const nav = e.target.closest("#prev, #next");
    if (nav) return shift(nav.id === "next" ? 1 : -1);
    const btn = e.target.closest("button.day");
    if (!btn || btn.disabled) return;
    const d = btn.dataset.date;
    hideSteps();
    if (!checkIn || checkOut) {
      checkIn = d; checkOut = null;
      summary.textContent = `Check-in ${d}. Now pick your check-out date.`;
      return render();
    }
    if (nightsBetween(checkIn, d) <= 0) {
      summary.textContent = `Check-in ${checkIn}. Check-out must be after check-in. Pick a later date.`;
      return;
    }
    if (!isRangeFree(checkIn, d, taken())) {
      summary.textContent = "Those dates include a night that is already booked. Please choose another range.";
      return;
    }
    checkOut = d;
    const n = nightsBetween(checkIn, checkOut);
    summary.textContent = `${checkIn} to ${checkOut}: ${n} night${n > 1 ? "s" : ""}, total ${peso(totalPrice(n, VILLA.rate))}`;
    form.hidden = false;
    render();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = form.elements, g = Number(f.guests.value);
    const err = !f.name.value.trim() || !f.email.value.trim() || !f.phone.value.trim() ? "Please fill in your name, email and phone."
      : !f.email.validity.valid ? "Please enter a valid email address."
      : !(Number.isInteger(g) && g >= 1 && g <= VILLA.maxGuests) ? `Guests must be a whole number from 1 to ${VILLA.maxGuests}.` : "";
    msg.textContent = err;
    if (!err) pay.hidden = false;
  });

  $("pay-btn").addEventListener("click", () => {
    if (!checkIn || !checkOut || nightsBetween(checkIn, checkOut) <= 0 || !isRangeFree(checkIn, checkOut, taken())) {
      summary.textContent = "Those dates are no longer available. Please pick again.";
      hideSteps();
      return;
    }
    const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", r = crypto.getRandomValues(new Uint8Array(6));
    $("ref").textContent = "BV-" + Array.from(r, (x) => c[x % 36]).join("");
    saveBooking(checkIn, checkOut);
    checkIn = checkOut = null;
    summary.textContent = "";
    form.reset();
    form.hidden = pay.hidden = true;
    confirm.hidden = false;
    render();
  });

  $("reset-demo").addEventListener("click", () => {
    clearBookings();
    checkIn = checkOut = null;
    summary.textContent = "";
    hideSteps();
    render();
  });

  render();
}
