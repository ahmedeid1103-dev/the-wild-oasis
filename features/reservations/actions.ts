"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

import type { ActionState } from "@/lib/action-state";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getPostgresPool } from "@/lib/database";
import { reservationSchema } from "./schemas";

function getReservationSaveError(code: string | undefined): string | null {
  if (code === "42501") {
    return "Reservation creation is unavailable until the database permissions are configured.";
  }

  return null;
}

function getDatabaseErrorCode(error: unknown): string | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code;
  }

  return undefined;
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
  const { user } = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/cabins/${input.cabinId}`)}`);
  }

  const client = await getPostgresPool().connect();
  let transactionOpen = false;

  try {
    await client.query("BEGIN");
    transactionOpen = true;
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [
      input.cabinId,
    ]);

    const { rows: cabins } = await client.query<{
      regularPrice: number | string;
      discount: number | string;
      maxCapacity: number | string;
    }>(
      `SELECT "regularPrice", discount, "maxCapacity"
       FROM public.cabins
       WHERE id = $1
       FOR SHARE`,
      [input.cabinId],
    );
    const cabin = cabins[0];

    if (!cabin) {
      await client.query("ROLLBACK");
      transactionOpen = false;
      return { error: "This cabin is no longer available." };
    }

    const { rows: guests } = await client.query<{ id: string | number }>(
      `SELECT id
       FROM public.guests
       WHERE better_auth_user_id = $1
       LIMIT 1`,
      [user.id],
    );
    const guest = guests[0];

    if (!guest) {
      await client.query("ROLLBACK");
      transactionOpen = false;
      return {
        error: "Complete your guest profile before reserving a cabin.",
      };
    }

    const maxCapacity = Number(cabin.maxCapacity);

    if (
      !Number.isSafeInteger(input.numGuests) ||
      input.numGuests < 1 ||
      !Number.isSafeInteger(maxCapacity) ||
      input.numGuests > maxCapacity
    ) {
      await client.query("ROLLBACK");
      transactionOpen = false;
      return { error: "Choose a guest count within this cabin's capacity." };
    }

    const regularPrice = Number(cabin.regularPrice);
    const discount = Number(cabin.discount);
    const nightlyRate = Math.max(regularPrice - discount, 0);
    const numNights =
      (Date.parse(`${input.endDate}T00:00:00Z`) -
        Date.parse(`${input.startDate}T00:00:00Z`)) /
      86_400_000;
    const totalPrice = nightlyRate * numNights;

    if (
      !Number.isFinite(regularPrice) ||
      !Number.isFinite(discount) ||
      !Number.isSafeInteger(nightlyRate) ||
      !Number.isSafeInteger(numNights) ||
      !Number.isSafeInteger(totalPrice)
    ) {
      await client.query("ROLLBACK");
      transactionOpen = false;
      return { error: "Choose valid reservation dates and try again." };
    }

    const { rows: availability } = await client.query<{ available: boolean }>(
      `SELECT NOT EXISTS (
         SELECT 1
         FROM public.bookings AS booking
         WHERE booking."cabinId" = $1
           AND booking."startDate" < ($3::date::timestamp AT TIME ZONE 'UTC')
           AND booking."endDate" > ($2::date::timestamp AT TIME ZONE 'UTC')
           AND booking.status IN ('unconfirmed', 'checked-in')
       ) AS available`,
      [input.cabinId, input.startDate, input.endDate],
    );

    if (availability[0]?.available !== true) {
      await client.query("ROLLBACK");
      transactionOpen = false;
      return {
        error: "This cabin is already reserved for some of those dates.",
      };
    }

    await client.query(
      `INSERT INTO public.bookings (
         "guestId", "cabinId", "cabinPrice", "startDate", "endDate",
         "numGuests", "numNights", "totalPrice", status, "isPaid",
         observations
       )
       VALUES (
         $1, $2, $3, $4::date::timestamp AT TIME ZONE 'UTC',
         $5::date::timestamp AT TIME ZONE 'UTC', $6, $7, $8,
         'unconfirmed', false, $9
       )`,
      [
        guest.id,
        input.cabinId,
        nightlyRate,
        input.startDate,
        input.endDate,
        input.numGuests,
        numNights,
        totalPrice,
        input.observations,
      ],
    );
    await client.query("COMMIT");
    transactionOpen = false;
  } catch (error) {
    if (transactionOpen) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        throw new AggregateError(
          [error, rollbackError],
          "The reservation transaction failed and could not be rolled back.",
        );
      }
    }

    const message = getReservationSaveError(getDatabaseErrorCode(error));

    if (message) {
      return { error: message };
    }

    throw error;
  } finally {
    client.release();
  }

  updateTag(`account-reservations-${user.id}`);
  revalidatePath("/account/reservations");

  return { message: "Your reservation has been submitted." };
}
