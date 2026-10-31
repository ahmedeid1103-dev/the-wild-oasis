import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { getCabins } from "@/features/cabins/queries";
import { getAccountGuest } from "@/features/profile/queries";
import { getPostgresPool } from "@/lib/database";

export async function getAccountReservations() {
  const { guest } = await getAccountGuest();

  if (!guest) {
    return { guest, reservations: [] };
  }

  const [bookings, cabins] = await Promise.all([
    getReservationsByUserId(guest.better_auth_user_id),
    getCabins(),
  ]);
  const cabinNumbers = new Map(
    cabins.map((cabin) => [cabin.id, cabin.cabinNumber]),
  );
  const reservations = bookings.map((booking) => ({
    ...booking,
    cabinNumber: cabinNumbers.get(booking.cabinId),
  }));

  return { guest, reservations };
}

async function getReservationsByUserId(userId: string) {
  "use cache: private";
  cacheLife("minutes");
  cacheTag(`account-reservations-${userId}`);

  const { rows: bookings } = await getPostgresPool().query(
    `SELECT booking.id, booking."startDate", booking."endDate",
            booking."numGuests", booking."numNights", booking."totalPrice",
            booking.status, booking."cabinId"
     FROM public.bookings AS booking
     INNER JOIN public.guests AS guest
       ON guest.id = booking."guestId"
     WHERE guest.better_auth_user_id = $1
     ORDER BY booking."startDate" DESC`,
    [userId],
  );

  return bookings;
}
