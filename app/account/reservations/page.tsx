import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reservations",
};

const reservations = [
  {
    id: 1,
    cabin: "001",
    startDate: "September 10, 2026",
    endDate: "September 14, 2026",
    guests: 2,
    nights: 4,
    totalPrice: 1000,
    status: "Confirmed",
  },
  {
    id: 2,
    cabin: "004",
    startDate: "October 5, 2026",
    endDate: "October 10, 2026",
    guests: 4,
    nights: 5,
    totalPrice: 2250,
    status: "Confirmed",
  },
];

export default function Page() {
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

      {reservations.length === 0 ? (
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
                  <p className="mb-1 text-sm text-primary-500">
                    Reservation #{reservation.id}
                  </p>

                  <h2 className="text-2xl font-medium text-primary-100">
                    Cabin {reservation.cabin}
                  </h2>
                </div>

                <span className="border border-accent-700 px-3 py-1 text-sm text-accent-400">
                  {reservation.status}
                </span>
              </div>

              <div className="grid gap-6 px-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="mb-1 text-sm text-primary-500">Check-in</p>
                  <p className="text-primary-200">{reservation.startDate}</p>
                </div>

                <div>
                  <p className="mb-1 text-sm text-primary-500">Check-out</p>
                  <p className="text-primary-200">{reservation.endDate}</p>
                </div>

                <div>
                  <p className="mb-1 text-sm text-primary-500">Guests</p>
                  <p className="text-primary-200">
                    {reservation.guests}{" "}
                    {reservation.guests === 1 ? "guest" : "guests"}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-sm text-primary-500">Total</p>
                  <p className="text-primary-200">${reservation.totalPrice}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-primary-800 px-6 py-4">
                <p className="text-sm text-primary-500">
                  {reservation.nights}{" "}
                  {reservation.nights === 1 ? "night" : "nights"}
                </p>

                <Link
                  href={`/account/reservations/edit/${reservation.id}`}
                  className="text-accent-500 transition-colors hover:text-accent-400"
                >
                  Edit reservation &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
