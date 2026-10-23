-- DRAFT FOR REVIEW ONLY. Do not apply until the profile creation and editing
-- flow and its permissions have been reviewed.
--
-- Generate IDs for new guest rows while preserving all existing IDs.
-- The table lock prevents concurrent writes between sequence initialization
-- and installing the new default.

BEGIN;

LOCK TABLE public.guests IN ACCESS EXCLUSIVE MODE;

CREATE SEQUENCE public.guests_id_seq AS bigint;
ALTER SEQUENCE public.guests_id_seq OWNED BY public.guests.id;

SELECT setval(
  'public.guests_id_seq',
  GREATEST(COALESCE(MAX(id), 1), 1),
  COALESCE(MAX(id), 0) >= 1
)
FROM public.guests;

ALTER TABLE public.guests
  ALTER COLUMN id SET DEFAULT nextval('public.guests_id_seq'::regclass);

REVOKE ALL PRIVILEGES ON SEQUENCE public.guests_id_seq
  FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SEQUENCE public.guests_id_seq TO authenticated;

GRANT INSERT ("fullName", email, nationality, "nationalID", "countryFlag", auth_user_id)
  ON TABLE public.guests TO authenticated;
GRANT UPDATE ("fullName", nationality, "nationalID", "countryFlag")
  ON TABLE public.guests TO authenticated;

CREATE POLICY guests_insert_own
  ON public.guests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth_user_id = (SELECT auth.uid())
    AND email = (SELECT auth.jwt() ->> 'email')
  );

CREATE POLICY guests_update_own
  ON public.guests
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = (SELECT auth.uid()))
  WITH CHECK (auth_user_id = (SELECT auth.uid()));

COMMIT;
