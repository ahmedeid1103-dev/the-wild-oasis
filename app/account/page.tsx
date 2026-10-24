import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

import { getAccountGuest } from "@/features/profile/queries";

export const metadata: Metadata = {
  title: "Account overview",
};

export default function Page() {
  return <AccountPageContent />;
}

async function AccountPageContent() {
  const { guest } = await getAccountGuest();

  if (!guest) {
    return (
      <section>
        <p className="ui-eyebrow mb-3">
          Your account
        </p>
        <h1 className="ui-page-title mb-4 text-primary-50">
          Welcome to your stay.
        </h1>
        <p className="mb-8 max-w-2xl text-lg leading-8 text-primary-200">
          Set up your guest profile to make managing your Wild Oasis stays
          easier.
        </p>

        <div className="border border-accent-700/70 bg-gradient-to-br from-primary-900 to-primary-950 p-6 shadow-xl shadow-black/20 sm:p-8">
          <div className="mb-6 flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center border border-accent-700/70 bg-accent-900/30">
              <UserIcon
                aria-hidden="true"
                className="size-6 text-accent-400"
              />
            </div>
            <div>
              <h2 className="mb-2 text-xl font-medium text-primary-50">
                Create your guest profile
              </h2>
              <p className="max-w-xl leading-7 text-primary-300">
                Add your guest details to get started. Existing guest records
                are not linked automatically.
              </p>
            </div>
          </div>
          <Link
            href="/account/profile"
            className="inline-flex min-h-12 items-center gap-3 bg-accent-500 px-5 py-3 font-semibold text-primary-950 transition-colors hover:bg-accent-400"
          >
            Set up your profile
            <ArrowRightIcon aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <Link
          href="/cabins"
          className="mt-6 inline-flex min-h-11 items-center gap-2 text-primary-200 transition-colors hover:text-accent-300"
        >
          Explore our cabins
          <ArrowRightIcon aria-hidden="true" className="size-4" />
        </Link>
      </section>
    );
  }

  return (
    <section>
      <p className="ui-eyebrow mb-3">
        Your account
      </p>
      <h1 className="ui-page-title mb-4 text-primary-50">
        Welcome back, {guest.fullName}.
      </h1>
      <p className="mb-10 max-w-2xl text-lg leading-8 text-primary-200">
        Your next escape is just around the corner. Manage your stays and guest
        details here.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/account/reservations"
          className="group flex min-h-48 flex-col justify-between border border-primary-800 bg-primary-950 p-6 transition-colors hover:border-accent-700 hover:bg-primary-900"
        >
          <div className="flex size-11 items-center justify-center border border-primary-700 bg-primary-900 transition-colors group-hover:border-accent-700 group-hover:bg-accent-900/30">
            <CalendarDaysIcon
              aria-hidden="true"
              className="size-5 text-accent-400"
            />
          </div>
          <div className="mt-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="mb-2 text-xl font-medium text-primary-50">
                Your reservations
              </h2>
              <p className="text-sm leading-6 text-primary-300">
                View the details of your stays.
              </p>
            </div>
            <ArrowRightIcon
              aria-hidden="true"
              className="mb-1 size-5 shrink-0 text-accent-400 transition-transform group-hover:translate-x-1"
            />
          </div>
        </Link>

        <Link
          href="/account/profile"
          className="group flex min-h-48 flex-col justify-between border border-primary-800 bg-primary-950 p-6 transition-colors hover:border-accent-700 hover:bg-primary-900"
        >
          <div className="flex size-11 items-center justify-center border border-primary-700 bg-primary-900 transition-colors group-hover:border-accent-700 group-hover:bg-accent-900/30">
            <UserIcon aria-hidden="true" className="size-5 text-accent-400" />
          </div>
          <div className="mt-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="mb-2 text-xl font-medium text-primary-50">
                Guest profile
              </h2>
              <p className="text-sm leading-6 text-primary-300">
                Review or update your guest details.
              </p>
            </div>
            <ArrowRightIcon
              aria-hidden="true"
              className="mb-1 size-5 shrink-0 text-accent-400 transition-transform group-hover:translate-x-1"
            />
          </div>
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-5 border border-accent-700/60 bg-gradient-to-r from-primary-900 to-primary-950 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4">
          <HomeIcon
            aria-hidden="true"
            className="mt-1 size-6 shrink-0 text-accent-400"
          />
          <div>
            <h2 className="mb-1 text-xl font-medium text-primary-50">
              Find your next hideaway
            </h2>
            <p className="text-primary-300">
              Explore the cabins and plan a little time in nature.
            </p>
          </div>
        </div>
        <Link
          href="/cabins"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 border border-accent-500 px-5 py-3 font-semibold text-accent-300 transition-colors hover:bg-accent-500 hover:text-primary-950"
        >
          Explore cabins
          <ArrowRightIcon aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </section>
  );
}
