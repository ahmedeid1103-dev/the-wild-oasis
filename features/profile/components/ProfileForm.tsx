"use client";

import { useActionState, useState } from "react";

import LoadingIndicator from "@/components/LoadingIndicator";
import { saveProfileAction } from "@/features/profile/actions";
import type { ActionState } from "@/lib/action-state";
import type { GuestProfile } from "../schemas";

type ProfileFormProps = {
  email?: string;
  profile?: GuestProfile;
};

const initialState: ActionState = {};
const inputClassName = "ui-input";

export default function ProfileForm({ email, profile }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    saveProfileAction,
    initialState,
  );
  const [isEditing, setIsEditing] = useState(!profile);

  if (profile && !isEditing) {
    return (
      <article
        aria-label="Saved guest profile"
        className="ui-card relative max-w-3xl overflow-hidden"
      >
        <div className="h-1 bg-linear-to-r from-accent-700 via-accent-400 to-accent-700" />

        <div className="flex flex-col gap-5 border-b border-primary-800 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center border border-accent-700/70 bg-accent-900/30 text-2xl text-accent-300">
              {profile.countryFlag}
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold tracking-widest text-accent-400 uppercase">
                The Wild Oasis
              </p>
              <h2 className="text-2xl font-medium text-primary-50">
                {profile.fullName}
              </h2>
              <p className="mt-1 text-sm text-primary-300">Guest profile</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="ui-button ui-button--outline"
          >
            Update profile
          </button>
        </div>

        <dl className="grid gap-x-8 gap-y-6 px-6 py-6 sm:grid-cols-2 sm:px-8 sm:py-8">
          <div className="min-w-0">
            <dt className="mb-2 text-xs font-semibold tracking-widest text-primary-400 uppercase">
              Email address
            </dt>
            <dd className="wrap-break-word text-primary-100">{email}</dd>
            <p className="mt-1 text-sm text-primary-400">
              Managed by your sign-in account
            </p>
          </div>
          <div>
            <dt className="mb-2 text-xs font-semibold tracking-widest text-primary-400 uppercase">
              Nationality
            </dt>
            <dd className="text-primary-100">{profile.nationality}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="mb-2 text-xs font-semibold tracking-widest text-primary-400 uppercase">
              National ID
            </dt>
            <dd className="break-all font-mono text-primary-100">
              {profile.nationalID}
            </dd>
          </div>
        </dl>
      </article>
    );
  }

  return (
    <form
      action={formAction}
      className="ui-card ui-card--raised max-w-2xl space-y-5 p-6 sm:p-8"
    >
      {email ? (
        <div className="text-sm text-primary-300">
          <p className="mb-1 font-medium">Email address</p>
          <p className="text-primary-100">{email}</p>
          <p className="mt-1 text-primary-400">
            Your email is managed by your sign-in account.
          </p>
        </div>
      ) : (
        <p className="text-sm text-primary-300">
          Your email address will come from your authenticated sign-in account.
        </p>
      )}

      <label className="ui-field">
        <span className="ui-field__label">Full name</span>
        <input
          name="fullName"
          type="text"
          autoComplete="name"
          maxLength={150}
          defaultValue={profile?.fullName}
          required
          className={inputClassName}
        />
      </label>

      <label className="ui-field">
        <span className="ui-field__label">Nationality</span>
        <input
          name="nationality"
          type="text"
          autoComplete="country-name"
          maxLength={100}
          defaultValue={profile?.nationality}
          required
          className={inputClassName}
        />
      </label>

      <label className="ui-field">
        <span className="ui-field__label">National ID</span>
        <input
          name="nationalID"
          type="text"
          maxLength={100}
          defaultValue={profile?.nationalID}
          required
          className={inputClassName}
        />
      </label>

      <label className="ui-field">
        <span className="ui-field__label">Country flag</span>
        <input
          name="countryFlag"
          type="text"
          maxLength={16}
          defaultValue={profile?.countryFlag}
          required
          className={inputClassName}
        />
      </label>

      {state.error && (
        <p role="alert" className="ui-notice ui-notice--error text-sm">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="ui-button ui-button--primary"
        >
          {pending ? (
            <LoadingIndicator label="Saving..." />
          ) : profile ? (
            "Save profile changes"
          ) : (
            "Create profile"
          )}
        </button>

        {profile && (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="ui-button ui-button--secondary"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
