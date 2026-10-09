"use client";

import { useMemo, useState, type FormEvent } from "react";

import type { Cabin } from "@/app/types/cabin";

function getDefaultDates() {
  const start = new Date();
  start.setDate(start.getDate() + 3);

  const end = new Date(start);
  end.setDate(end.getDate() + 4);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

export default function CabinReservation({ cabin }: { cabin: Cabin }) {
  const defaultDates = useMemo(() => getDefaultDates(), []);
  const [reservation, setReservation] = useState({
    startDate: defaultDates.startDate,
    endDate: defaultDates.endDate,
    guests: Math.min(cabin.maxCapacity, 2),
    notes: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  const nights = useMemo(() => {
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 0;
    }

    const diffInMs = end.getTime() - start.getTime();
    return Math.max(Math.ceil(diffInMs / (1000 * 60 * 60 * 24)), 0);
  }, [reservation.startDate, reservation.endDate]);

  const discountedPrice = Math.max(cabin.regularPrice - cabin.discount, 0);
  const totalPrice = nights > 0 ? nights * discountedPrice : 0;

  const guestOptions = useMemo(() => {
    return Array.from({ length: cabin.maxCapacity }, (_, index) => index + 1);
  }, [cabin.maxCapacity]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!reservation.startDate || !reservation.endDate || nights <= 0) {
      setStatusMessage("Choose a valid check-in and check-out date.");
      return;
    }

    setStatusMessage(
      `Reservation summary for ${cabin.name}: ${nights} ${
        nights === 1 ? "night" : "nights"
      } for ${reservation.guests} ${
        reservation.guests === 1 ? "guest" : "guests"
      }.`,
    );
  };

  return (
    <aside className="border border-primary-800 bg-primary-900/50 p-5">
      <p className="text-sm font-medium text-primary-400">Price per night</p>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-semibold text-primary-50">
          ${discountedPrice}
        </span>
        <span className="text-sm text-primary-400">/ night</span>
      </div>

      {cabin.discount > 0 && (
        <p className="mt-2 text-sm text-primary-400">
          Regular price: <span className="line-through">${cabin.regularPrice}</span>
        </p>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-primary-200">
            <span className="mb-1 block text-xs uppercase tracking-wide text-primary-500">
              Check-in
            </span>
            <input
              type="date"
              value={reservation.startDate}
              onChange={(event) =>
                setReservation((current) => ({
                  ...current,
                  startDate: event.target.value,
                }))
              }
              className="w-full border border-primary-700 bg-primary-950 px-3 py-2 text-primary-100 outline-none transition-colors focus:border-accent-500"
            />
          </label>

          <label className="block text-sm text-primary-200">
            <span className="mb-1 block text-xs uppercase tracking-wide text-primary-500">
              Check-out
            </span>
            <input
              type="date"
              value={reservation.endDate}
              onChange={(event) =>
                setReservation((current) => ({
                  ...current,
                  endDate: event.target.value,
                }))
              }
              className="w-full border border-primary-700 bg-primary-950 px-3 py-2 text-primary-100 outline-none transition-colors focus:border-accent-500"
            />
          </label>
        </div>

        <label className="block text-sm text-primary-200">
          <span className="mb-1 block text-xs uppercase tracking-wide text-primary-500">
            Guests
          </span>
          <select
            value={reservation.guests}
            onChange={(event) =>
              setReservation((current) => ({
                ...current,
                guests: Number(event.target.value),
              }))
            }
            className="w-full border border-primary-700 bg-primary-950 px-3 py-2 text-primary-100 outline-none transition-colors focus:border-accent-500"
          >
            {guestOptions.map((option) => (
              <option key={option} value={option}>
                {option} {option === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm text-primary-200">
          <span className="mb-1 block text-xs uppercase tracking-wide text-primary-500">
            Notes
          </span>
          <textarea
            value={reservation.notes}
            onChange={(event) =>
              setReservation((current) => ({
                ...current,
                notes: event.target.value,
              }))
            }
            rows={3}
            className="w-full resize-none border border-primary-700 bg-primary-950 px-3 py-2 text-primary-100 outline-none transition-colors focus:border-accent-500"
            placeholder="Anything we should know?"
          />
        </label>

        <div className="rounded border border-primary-700 bg-primary-950 p-3 text-sm text-primary-200">
          <div className="flex items-center justify-between gap-2">
            <span>{nights} nights</span>
            <span>${totalPrice}</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-accent-500 px-4 py-2.5 text-sm font-semibold text-primary-900 transition-colors hover:bg-accent-600"
        >
          Reserve cabin
        </button>

        {statusMessage ? (
          <p className="text-sm text-accent-400">{statusMessage}</p>
        ) : null}
      </form>
    </aside>
  );
}
