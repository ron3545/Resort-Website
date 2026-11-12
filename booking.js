const day = (s) => Date.UTC(...s.split("-").map((n, i) => n - (i === 1)));

export const nightsBetween = (checkIn, checkOut) =>
  Math.round((day(checkOut) - day(checkIn)) / 864e5);

export const isRangeFree = (checkIn, checkOut, takenNights) =>
  !takenNights.some((d) => d >= checkIn && d < checkOut); // ISO dates compare lexically

export const totalPrice = (nights, rate = 15000) => nights * rate;
