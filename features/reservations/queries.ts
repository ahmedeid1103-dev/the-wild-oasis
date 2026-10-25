import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { getAccountGuest } from "@/features/profile/queries";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAccountReservations() {
  const { guest } = await getAccountGuest();

  if (!guest) {
    return { guest, reservations: [] };
  }

  const reservations = await getReservationsByGuestId(guest.id);

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

  const cabinIds = [...new Set(bookings.map((booking) => booking.cabinId))];
  const { data: cabins, error: cabinsError } = cabinIds.length
    ? await accountSupabase
        .from("cabins")
        .select("id, cabin_number")
        .in("id", cabinIds)
    : { data: [], error: null };

  if (cabinsError) {
    throw cabinsError;
  }

  const cabinNumbers = new Map(
    cabins.map((cabin) => [cabin.id, cabin.cabin_number]),
  );

  return bookings.map((booking) => ({
    ...booking,
    cabinNumber: cabinNumbers.get(booking.cabinId),
  }));
}
