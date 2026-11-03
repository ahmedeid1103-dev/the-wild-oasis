"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import { isUnauthenticatedAuthError } from "@/lib/auth-errors";
import type { ActionState } from "@/lib/action-state";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { reservationSchema } from "./schemas";

function getReservationSaveError(code: string | undefined): string {
  if (code === "42501" || code === "PGRST202") {
    return "Reservation creation isn't configured yet. Please try again later.";
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

  const { data: bookingResult, error: bookingError } = await supabase.rpc(
    "create_booking",
    {
      p_cabin_id: input.cabinId,
      p_start_date: input.startDate,
      p_end_date: input.endDate,
      p_num_guests: input.numGuests,
      p_observations: input.observations,
    },
  );

  if (bookingError) {
    return { error: getReservationSaveError(bookingError.code) };
  }

  if (bookingResult === "unauthenticated") {
    redirect(`/login?next=${encodeURIComponent(`/cabins/${input.cabinId}`)}`);
  }

  if (bookingResult === "guest_profile_missing") {
    return {
      error: "Complete your guest profile before reserving a cabin.",
    };
  }

  if (bookingResult === "cabin_unavailable") {
    return { error: "This cabin is no longer available." };
  }

  if (bookingResult === "guest_count_invalid") {
    return { error: "Choose a guest count within this cabin's capacity." };
  }

  if (bookingResult === "invalid_reservation") {
    return { error: "Enter valid reservation details and try again." };
  }

  if (bookingResult === "booking_unavailable") {
    return {
      error: "This cabin is already reserved for some of those dates.",
    };
  }

  if (bookingResult !== "created") {
    throw new Error("Unexpected result from the create_booking RPC.");
  }

  updateTag(`account-reservations-${guest.id}`);
  revalidatePath("/account/reservations");

  return { message: "Your reservation has been submitted." };
}
