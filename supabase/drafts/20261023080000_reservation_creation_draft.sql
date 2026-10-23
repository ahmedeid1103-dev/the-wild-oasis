-- DRAFT FOR REVIEW ONLY. Do not apply until the reservation action, booking
-- columns, status values, RLS policies, and grants have been reviewed against
-- the target Supabase database.

BEGIN;

-- The security-definer helper returns only availability, so authenticated
-- users can check conflicts without weakening the owner-only booking SELECT
-- policy. It is a preflight check, not an atomic reservation operation.
CREATE FUNCTION public.is_booking_available(
  p_cabin_id uuid,
  p_start_date date,
  p_end_date date
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT
    (SELECT auth.uid()) IS NOT NULL
    AND p_start_date < p_end_date
    AND EXISTS (
      SELECT 1
      FROM public.cabins AS cabin
      WHERE cabin.id = p_cabin_id
    )
    AND NOT EXISTS (
      SELECT 1
      FROM public.bookings AS booking
      WHERE booking."cabinId" = p_cabin_id
        AND booking."startDate" < (p_end_date::timestamp AT TIME ZONE 'UTC')
        AND booking."endDate" > (p_start_date::timestamp AT TIME ZONE 'UTC')
        AND booking.status IN ('unconfirmed', 'checked-in')
    );
$function$;

REVOKE ALL PRIVILEGES ON FUNCTION public.is_booking_available(uuid, date, date)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_booking_available(uuid, date, date)
  TO authenticated;

GRANT INSERT (
  "guestId",
  "cabinId",
  "cabinPrice",
  "startDate",
  "endDate",
  "numGuests",
  "numNights",
  "totalPrice",
  status,
  "isPaid",
  observations
)
ON TABLE public.bookings TO authenticated;

CREATE POLICY bookings_insert_own
  ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.guests AS guest
      WHERE guest.id = bookings."guestId"
        AND guest.auth_user_id = (SELECT auth.uid())
    )
    AND EXISTS (
      SELECT 1
      FROM public.cabins AS cabin
      WHERE cabin.id = bookings."cabinId"
        AND bookings."numGuests" BETWEEN 1 AND cabin."maxCapacity"
        AND bookings."startDate" >= (
          timezone('UTC', now())::date::timestamp AT TIME ZONE 'UTC'
        )
        AND bookings."endDate" > bookings."startDate"
        AND (bookings."endDate" AT TIME ZONE 'UTC') =
          (bookings."startDate" AT TIME ZONE 'UTC')
            + bookings."numNights" * INTERVAL '1 day'
        AND bookings."cabinPrice" =
          GREATEST(cabin."regularPrice" - cabin.discount, 0)
        AND bookings."totalPrice" =
          bookings."cabinPrice" * bookings."numNights"
    )
    AND status = 'unconfirmed'
    AND "isPaid" = false
    AND "hasBreakfast" = false
    AND "extrasPrice" = 0
    AND char_length(COALESCE(observations, '')) <= 500
    AND public.is_booking_available(
      "cabinId",
      "startDate",
      "endDate"
    )
  );

-- The availability RPC and insert are separate requests, so two simultaneous
-- actions can still both pass the check. A reviewed exclusion constraint or a
-- single transaction-backed reservation function is required for race-free
-- overlap prevention; neither is added here because status semantics and
-- existing overlapping data must be verified first.

COMMIT;
