import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { getCabins } from "@/features/cabins/queries";
import { getAccountGuest } from "@/features/profile/queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAccountReservations() {
  const { guest } = await getAccountGuest();

  if (!guest) {
    return { guest, reservations: [] };
  }

  const [bookings, cabins] = await Promise.all([
    getReservationsByGuestId(guest.id),
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

async function getReservationsByGuestId(guestId: string) {
  "use cache: private";
  cacheLife("minutes");
  cacheTag(`account-reservations-${guestId}`);

  const accountSupabase = await createServerSupabaseClient();
  const { data: bookings, error: bookingsError } = await accountSupabase
    .from("bookings")
    .select(
      "id, startDate, endDate, numGuests, numNights, totalPrice, status, cabinId",
    )
    .eq("guestId", guestId)
    .order("startDate", { ascending: false });

  if (bookingsError) {
    throw bookingsError;
  }

  return bookings;
}
