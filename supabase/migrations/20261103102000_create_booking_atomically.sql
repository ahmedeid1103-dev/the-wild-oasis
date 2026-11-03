BEGIN;

CREATE OR REPLACE FUNCTION public.create_booking(
  p_cabin_id uuid,
  p_start_date date,
  p_end_date date,
  p_num_guests integer,
  p_observations text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_guest_id public.guests.id%TYPE;
  v_regular_price numeric;
  v_discount numeric;
  v_max_capacity integer;
  v_num_nights integer;
  v_nightly_rate numeric;
  v_total_price numeric;
  v_start_date timestamptz;
  v_end_date timestamptz;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN 'unauthenticated';
  END IF;

  IF p_start_date IS NULL
    OR p_end_date IS NULL
    OR p_start_date < timezone('Europe/Rome', now())::date
    OR p_end_date <= p_start_date
    OR p_num_guests IS NULL
    OR p_num_guests < 1
    OR char_length(COALESCE(p_observations, '')) > 500
  THEN
    RETURN 'invalid_reservation';
  END IF;

  SELECT guest.id
  INTO v_guest_id
  FROM public.guests AS guest
  WHERE guest.auth_user_id = v_user_id;

  IF NOT FOUND THEN
    RETURN 'guest_profile_missing';
  END IF;

  -- Serialize booking attempts for this cabin through the transaction.
  SELECT cabin."regularPrice", cabin.discount, cabin."maxCapacity"
  INTO v_regular_price, v_discount, v_max_capacity
  FROM public.cabins AS cabin
  WHERE cabin.id = p_cabin_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN 'cabin_unavailable';
  END IF;

  IF p_num_guests > v_max_capacity THEN
    RETURN 'guest_count_invalid';
  END IF;

  v_num_nights := p_end_date - p_start_date;
  v_nightly_rate := greatest(v_regular_price - v_discount, 0);
  v_total_price := v_nightly_rate * v_num_nights;

  IF v_num_nights <= 0
    OR v_nightly_rate IS NULL
    OR v_total_price > 9007199254740991::numeric
  THEN
    RETURN 'invalid_reservation';
  END IF;

  v_start_date := p_start_date::timestamp AT TIME ZONE 'UTC';
  v_end_date := p_end_date::timestamp AT TIME ZONE 'UTC';

  IF EXISTS (
    SELECT 1
    FROM public.bookings AS booking
    WHERE booking."cabinId" = p_cabin_id
      AND booking."startDate" < v_end_date
      AND booking."endDate" > v_start_date
      AND booking.status IN ('unconfirmed', 'checked-in')
  ) THEN
    RETURN 'booking_unavailable';
  END IF;

  INSERT INTO public.bookings (
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
    "hasBreakfast",
    "extrasPrice",
    observations
  )
  VALUES (
    v_guest_id,
    p_cabin_id,
    v_nightly_rate,
    v_start_date,
    v_end_date,
    p_num_guests,
    v_num_nights,
    v_total_price,
    'unconfirmed',
    false,
    false,
    0,
    btrim(COALESCE(p_observations, ''))
  );

  RETURN 'created';
END;
$function$;

REVOKE ALL ON FUNCTION public.create_booking(uuid, date, date, integer, text)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.create_booking(uuid, date, date, integer, text)
  TO authenticated;

REVOKE INSERT ON TABLE public.bookings
  FROM PUBLIC, anon, authenticated;

REVOKE INSERT (
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
  "hasBreakfast",
  "extrasPrice",
  observations
)
ON TABLE public.bookings
FROM PUBLIC, anon, authenticated;

COMMIT;
