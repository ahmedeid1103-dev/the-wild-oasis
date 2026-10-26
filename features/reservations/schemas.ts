import { z } from "zod";

import { getBookingDate } from "./dates";

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function isCalendarDate(value: string): boolean {
  const match = DATE_PATTERN.exec(value);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (year < 1 || month < 1 || month > 12) {
    return false;
  }

  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [
    31,
    isLeapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  return day >= 1 && day <= daysInMonth[month - 1];
}

const reservationDateSchema = z
  .string()
  .regex(DATE_PATTERN)
  .refine(isCalendarDate);

export const reservationSchema = z
  .object({
    cabinId: z.string().uuid(),
    startDate: reservationDateSchema,
    endDate: reservationDateSchema,
    numGuests: z
      .string()
      .regex(/^[1-9]\d*$/)
      .transform(Number)
      .refine((numGuests) => Number.isSafeInteger(numGuests)),
    observations: z.string().trim().max(500),
  })
  .refine(
    ({ startDate }) => startDate >= getBookingDate(),
    { path: ["startDate"] },
  )
  .refine(({ startDate, endDate }) => endDate > startDate, {
    path: ["endDate"],
  });
