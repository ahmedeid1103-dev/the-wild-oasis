import "server-only";

import { getAccountGuest } from "@/features/profile/queries";

export async function getAccountReservations() {
  const { guest, supabase } = await getAccountGuest();

  if (!guest) {
    return { guest, reservations: [] };
  }

  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select(
      "id, startDate, endDate, numGuests, numNights, totalPrice, status, cabinId",
    )
    .eq("guestId", guest.id)
    .order("startDate", { ascending: false });

  if (bookingsError) {
    throw bookingsError;
  }

  const cabinIds = [...new Set(bookings.map((booking) => booking.cabinId))];
  const { data: cabins, error: cabinsError } = cabinIds.length
    ? await supabase
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

  return {
    guest,
    reservations: bookings.map((booking) => ({
      ...booking,
      cabinNumber: cabinNumbers.get(booking.cabinId),
    })),
  };
}
