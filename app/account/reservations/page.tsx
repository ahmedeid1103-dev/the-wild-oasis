import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { getAccountReservations } from "@/features/reservations/queries";

export const metadata: Metadata = {
  title: "Reservations",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeZone: "UTC",
});

function formatReservationDate(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return "Unknown date";
  }

  return dateFormatter.format(date);
}

export default function Page() {
  return (
    <Suspense fallback={<p aria-busy="true">Loading your reservations...</p>}>
      <ReservationsPageContent />
    </Suspense>
  );
}

async function ReservationsPageContent() {
  const { guest, reservations } = await getAccountReservations();

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-3 text-4xl font-medium text-accent-400">
          Your reservations
        </h1>

        <p className="text-lg text-primary-200">
          Here you can see all your reservations and manage your upcoming stays.
        </p>
      </div>

      {!guest ? (
        <div className="border border-primary-800 bg-primary-950 px-8 py-10">
          <p className="text-lg text-primary-200">
            Your sign-in is not linked to a guest profile, so reservations
            cannot be shown. Please contact the property to link your account;
            records are not linked automatically.
          </p>
        </div>
      ) : reservations.length === 0 ? (
        <div className="border border-primary-800 bg-primary-950 px-8 py-10">
          <p className="text-lg text-primary-200">
            You have no reservations yet. Check out our{" "}
            <Link
              href="/cabins"
              className="text-accent-500 underline underline-offset-4 transition-colors hover:text-accent-400"
            >
              luxury cabins &rarr;
            </Link>
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reservations.map((reservation) => (
            <article
              key={reservation.id}
              className="border border-primary-800 bg-primary-950"
            >
              <div className="flex items-center justify-between border-b border-primary-800 px-6 py-5">
                <div>
                  <p className="mb-1 text-sm text-primary-400">
                    Reservation #{reservation.id}
                  </p>
                  <h2 className="text-2xl font-medium text-primary-100">
                    Cabin {reservation.cabinNumber ?? reservation.cabinId}
                  </h2>
                </div>
                <span className="border border-accent-700 px-3 py-1 text-sm text-accent-400">
                  {reservation.status}
                </span>
              </div>

              <div className="grid gap-6 px-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="mb-1 text-sm text-primary-400">Check-in</p>
                  <p className="text-primary-200">
                    {formatReservationDate(reservation.startDate)}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-primary-400">Check-out</p>
                  <p className="text-primary-200">
                    {formatReservationDate(reservation.endDate)}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-primary-400">Guests</p>
                  <p className="text-primary-200">
                    {reservation.numGuests}{" "}
                    {reservation.numGuests === 1 ? "guest" : "guests"}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-primary-400">Total</p>
                  <p className="text-primary-200">${reservation.totalPrice}</p>
                </div>
              </div>

              <div className="border-t border-primary-800 px-6 py-4">
                <p className="text-sm text-primary-400">
                  {reservation.numNights}{" "}
                  {reservation.numNights === 1 ? "night" : "nights"}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
