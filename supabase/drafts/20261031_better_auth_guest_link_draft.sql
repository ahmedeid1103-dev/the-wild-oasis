-- DRAFT FOR REVIEW ONLY. Apply only after the Better Auth schema migration
-- creates better_auth.user and the deployed guests table has been verified.
--
-- This adds a separate ownership link for Better Auth. Existing
-- auth_user_id values, business records, and RLS policies are left unchanged.
-- The existing guests.id identity column manages its own sequence.

BEGIN;

ALTER TABLE public.guests
  ADD COLUMN IF NOT EXISTS better_auth_user_id uuid;

DO $migration$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'guests_better_auth_user_id_fkey'
      AND conrelid = 'public.guests'::regclass
  ) THEN
    ALTER TABLE public.guests
      ADD CONSTRAINT guests_better_auth_user_id_fkey
      FOREIGN KEY (better_auth_user_id)
      REFERENCES better_auth."user" (id)
      ON DELETE SET NULL;
  END IF;
END
$migration$;

CREATE UNIQUE INDEX IF NOT EXISTS guests_better_auth_user_id_key
  ON public.guests (better_auth_user_id);

COMMIT;
