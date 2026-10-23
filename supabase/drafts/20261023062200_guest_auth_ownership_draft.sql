-- DRAFT FOR REVIEW ONLY. This is a one-shot security migration for the
-- confirmed guests/bookings schema. It intentionally does not change either
-- table's ID generation.
--
-- No email-based backfill is performed. Auth-user deletion sets this nullable
-- link to NULL so legacy guest and booking history is preserved but inaccessible
-- to ordinary authenticated users until an explicit ownership process exists.
--
-- This migration revokes direct table and current-column grants from PUBLIC,
-- anon, and authenticated. It cannot safely remove privileges inherited through
-- other role memberships, change default privileges, or neutralize superuser,
-- BYPASSRLS, and table-owner access. Review those separately for the target DB.

BEGIN;

ALTER TABLE public.guests
  ADD COLUMN auth_user_id uuid,
  ADD CONSTRAINT guests_auth_user_id_fkey
    FOREIGN KEY (auth_user_id)
    REFERENCES auth.users (id)
    ON DELETE SET NULL,
  ADD CONSTRAINT guests_auth_user_id_key UNIQUE (auth_user_id);

ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop every SELECT-capable policy so no permissive public policy can combine
-- with the owner policies below. This also drops any ALL policies.
DO $migration$
DECLARE
  existing_policy record;
BEGIN
  FOR existing_policy IN
    SELECT tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('guests', 'bookings')
  LOOP
    EXECUTE format(
      'DROP POLICY %I ON %I.%I',
      existing_policy.policyname,
      'public',
      existing_policy.tablename
    );
  END LOOP;
END
$migration$;

-- Guests can read only the guest record explicitly linked to their auth user.
CREATE POLICY guests_select_own
  ON public.guests
  FOR SELECT
  TO authenticated
  USING (auth_user_id = (SELECT auth.uid()));

-- A booking is visible only when its guest record is linked to this auth user.
CREATE POLICY bookings_select_own
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.guests AS guest
      WHERE guest.id = bookings."guestId"
        AND guest.auth_user_id = (SELECT auth.uid())
    )
  );

-- The guests subquery is subject to guests_select_own; that policy does not
-- query bookings, so this does not create recursive RLS evaluation.
REVOKE ALL PRIVILEGES ON TABLE public.guests, public.bookings
  FROM PUBLIC, anon, authenticated;

-- Table-level REVOKE does not remove grants made on individual columns.
DO $migration$
DECLARE
  target record;
  column_list text;
BEGIN
  FOR target IN
    SELECT table_name
    FROM (VALUES ('guests'), ('bookings')) AS tables(table_name)
  LOOP
    SELECT string_agg(format('%I', attribute.attname), ', ' ORDER BY attribute.attnum)
    INTO column_list
    FROM pg_attribute AS attribute
    JOIN pg_class AS relation
      ON relation.oid = attribute.attrelid
    JOIN pg_namespace AS schema
      ON schema.oid = relation.relnamespace
    WHERE schema.nspname = 'public'
      AND relation.relname = target.table_name
      AND attribute.attnum > 0
      AND NOT attribute.attisdropped;

    IF column_list IS NOT NULL THEN
      EXECUTE format(
        'REVOKE ALL PRIVILEGES (%s) ON TABLE %I.%I FROM PUBLIC, anon, authenticated',
        column_list,
        'public',
        target.table_name
      );
    END IF;
  END LOOP;
END
$migration$;

-- SELECT is sufficient for the current account/reservation read paths. RLS
-- constrains authenticated reads to the owner policies; no client write access
-- or guest-claiming policy is introduced.
GRANT SELECT ON TABLE public.guests, public.bookings TO authenticated;

-- IDs have no defaults in the confirmed schema and remain unchanged here.
-- Future inserts must supply valid IDs until ID generation is designed
-- separately. This migration is intentionally one-shot: ADD COLUMN and named
-- constraints/policies are not guarded with IF NOT EXISTS, so a successful
-- application must not be replayed.

COMMIT;
