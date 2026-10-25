"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { isUnauthenticatedAuthError } from "@/lib/auth-errors";
import type { ActionState } from "@/lib/action-state";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { reservationSchema } from "./schemas";

function getReservationSaveError(code: string | undefined): string {
  if (code === "42501") {
    return "Reservation creation is unavailable until the reservation permissions migration has been applied.";
  }

  return "We couldn't create this reservation. Please try again.";
}

export async function createReservationAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = reservationSchema.safeParse({
    cabinId: formData.get("cabinId"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    numGuests: formData.get("numGuests"),
    observations: formData.get("observations"),
  });

  if (!result.success) {
    return { error: "Enter valid reservation details and try again." };
  }

  const input = result.data;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError && isUnauthenticatedAuthError(authError)) {
    redirect(`/login?next=${encodeURIComponent(`/cabins/${input.cabinId}`)}`);
  }

  if (authError) {
    return { error: "We couldn't verify your sign-in. Please try again." };
  }

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/cabins/${input.cabinId}`)}`);
  }

  const { data: guest, error: guestError } = await supabase
    .from("guests")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (guestError) {
    return { error: "We couldn't verify your guest profile. Please try again." };
  }

  if (!guest) {
    return {
      error: "Complete your guest profile before reserving a cabin.",
    };
  }

  const { data: cabin, error: cabinError } = await supabase
    .from("cabins")
    .select("regularPrice, discount, maxCapacity")
    .eq("id", input.cabinId)
    .maybeSingle();

  if (cabinError) {
    return { error: "We couldn't verify this cabin. Please try again." };
  }

  if (!cabin) {
    return { error: "This cabin is no longer available." };
  }

  if (
    !Number.isSafeInteger(input.numGuests) ||
    input.numGuests < 1 ||
    input.numGuests > cabin.maxCapacity
  ) {
    return { error: "Choose a guest count within this cabin's capacity." };
  }

  const nightlyRate = Math.max(cabin.regularPrice - cabin.discount, 0);

  if (!Number.isFinite(nightlyRate) || nightlyRate < 0) {
    return { error: "We couldn't calculate this cabin's price." };
  }

  const numNights =
    (Date.parse(`${input.endDate}T00:00:00Z`) -
      Date.parse(`${input.startDate}T00:00:00Z`)) /
    86_400_000;
  const totalPrice = nightlyRate * numNights;

  if (
    !Number.isSafeInteger(numNights) ||
    !Number.isSafeInteger(totalPrice)
  ) {
    return { error: "Choose valid reservation dates and try again." };
  }

  const { data: isAvailable, error: availabilityError } = await supabase.rpc(
    "is_booking_available",
    {
      p_cabin_id: input.cabinId,
      p_start_date: input.startDate,
      p_end_date: input.endDate,
    },
  );

  if (availabilityError) {
    return {
      error:
        "We couldn't verify cabin availability. Please try again later.",
    };
  }

  if (isAvailable !== true) {
    return {
      error: "This cabin is already reserved for some of those dates.",
    };
  }

  const { error: insertError } = await supabase.from("bookings").insert({
    cabinId: input.cabinId,
    guestId: guest.id,
    cabinPrice: nightlyRate,
    startDate: `${input.startDate}T00:00:00.000Z`,
    endDate: `${input.endDate}T00:00:00.000Z`,
    numGuests: input.numGuests,
    numNights,
    totalPrice,
    status: "unconfirmed",
    isPaid: false,
    observations: input.observations,
  });

  if (insertError) {
    return { error: getReservationSaveError(insertError.code) };
  }

  revalidatePath("/account/reservations");

  return { message: "Your reservation has been submitted." };
}
