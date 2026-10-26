const bookingTimeZone = "Europe/Rome";
const bookingDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: bookingTimeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function getBookingDate(date = new Date()): string {
  const parts = bookingDateFormatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("Unable to determine the booking date.");
  }

  return `${year}-${month}-${day}`;
}

export function addDaysToBookingDate(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00.000Z`);

  if (!Number.isFinite(value.getTime()) || !Number.isSafeInteger(days)) {
    throw new RangeError("A valid booking date and day offset are required.");
  }

  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
