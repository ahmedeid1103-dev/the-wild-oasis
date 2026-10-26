"use client";

import {
  useActionState,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";

import LoadingIndicator from "@/components/LoadingIndicator";
import { createReservationAction } from "@/features/reservations/actions";
import {
  addDaysToBookingDate,
  getBookingDate,
} from "@/features/reservations/dates";
import type { ActionState } from "@/lib/action-state";

const initialState: ActionState = {};
const noSubscribe = () => () => {};
const getServerBookingDate = () => "";

function getDefaultDates(today: string) {
  const startDate = addDaysToBookingDate(today, 3);

  return {
    startDate,
    endDate: addDaysToBookingDate(startDate, 4),
  };
}

type CabinReservationFormProps = {
  cabinId: string;
  maxCapacity: number;
  discountedPrice: number;
};

type ReservationState = {
  startDate?: string;
  endDate?: string;
  guests: number;
  notes: string;
};

export default function CabinReservationForm({
  cabinId,
  maxCapacity,
  discountedPrice,
}: CabinReservationFormProps) {
  const [state, formAction, pending] = useActionState(
    createReservationAction,
    initialState,
  );
  const today = useSyncExternalStore(
    noSubscribe,
    getBookingDate,
    getServerBookingDate,
  );
  const defaultDates = useMemo(
    () =>
      today
        ? getDefaultDates(today)
        : { startDate: "", endDate: "" },
    [today],
  );
  const [reservation, setReservation] = useState<ReservationState>({
    guests: Math.min(maxCapacity, 2),
    notes: "",
  });
  const startDate = reservation.startDate ?? defaultDates.startDate;
  const endDate = reservation.endDate ?? defaultDates.endDate;

  const nights = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return 0;
    }

    const diffInMs = end.getTime() - start.getTime();
    return Math.max(Math.ceil(diffInMs / (1000 * 60 * 60 * 24)), 0);
  }, [startDate, endDate]);

  const totalPrice = nights > 0 ? nights * discountedPrice : 0;
  const guestOptions = useMemo(() => {
    return Array.from({ length: maxCapacity }, (_, index) => index + 1);
  }, [maxCapacity]);

  const checkoutMinimum =
    startDate &&
    Number.isFinite(Date.parse(`${startDate}T00:00:00Z`))
      ? addDaysToBookingDate(startDate, 1)
      : today;

  const formattedNightlyPrice = discountedPrice.toLocaleString("en-US");
  const formattedTotalPrice = totalPrice.toLocaleString("en-US");

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="cabinId" value={cabinId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="ui-field">
          <span className="ui-field__label text-xs uppercase tracking-wide text-primary-400">
            Check-in
          </span>
          <input
            type="date"
            name="startDate"
            min={today}
            required
            value={startDate}
            onChange={(event) =>
              setReservation((current) => ({
                ...current,
                startDate: event.target.value,
              }))
            }
            className="ui-input"
          />
        </label>

        <label className="ui-field">
          <span className="ui-field__label text-xs uppercase tracking-wide text-primary-400">
            Check-out
          </span>
          <input
            type="date"
            name="endDate"
            min={checkoutMinimum}
            required
            value={endDate}
            onChange={(event) =>
              setReservation((current) => ({
                ...current,
                endDate: event.target.value,
              }))
            }
            className="ui-input"
          />
        </label>
      </div>

      <label className="ui-field">
        <span className="ui-field__label text-xs uppercase tracking-wide text-primary-400">
          Guests
        </span>
        <select
          name="numGuests"
          value={reservation.guests}
          onChange={(event) =>
            setReservation((current) => ({
              ...current,
              guests: Number(event.target.value),
            }))
          }
          className="ui-input"
        >
          {guestOptions.map((option) => (
            <option key={option} value={option}>
              {option} {option === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </label>

      <label className="ui-field">
        <span className="ui-field__label text-xs uppercase tracking-wide text-primary-400">
          Notes
        </span>
        <textarea
          name="observations"
          value={reservation.notes}
          maxLength={500}
          onChange={(event) =>
            setReservation((current) => ({
              ...current,
              notes: event.target.value,
            }))
          }
          rows={3}
          className="ui-input resize-none"
          placeholder="Anything we should know?"
        />
      </label>

      <div className="border-t border-primary-700 pt-4 text-sm">
        <div className="flex items-center justify-between gap-2 text-primary-300">
          <span>
            ${formattedNightlyPrice} × {nights}{" "}
            {nights === 1 ? "night" : "nights"}
          </span>
          <span>${formattedTotalPrice}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-primary-800 pt-3">
          <span className="font-semibold text-primary-100">Total</span>
          <span className="text-lg font-semibold text-primary-50">
            ${formattedTotalPrice}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending || Boolean(state.message)}
        aria-busy={pending}
        className="ui-button ui-button--primary w-full text-sm"
      >
        {pending ? (
          <LoadingIndicator label="Submitting..." />
        ) : state.message ? (
          "Reservation submitted"
        ) : (
          "Reserve cabin"
        )}
      </button>

      {state.error ? (
        <p role="alert" className="ui-notice ui-notice--error text-sm">
          {state.error}
          {state.error ===
            "Complete your guest profile before reserving a cabin." && (
            <>
              {" "}
              <Link href="/account/profile" className="ui-link">
                Complete your profile
              </Link>
            </>
          )}
        </p>
      ) : state.message ? (
        <p
          role="status"
          aria-live="polite"
          className="ui-notice ui-notice--success text-sm"
        >
          {state.message}{" "}
          <Link href="/account/reservations" className="ui-link">
            View reservations
          </Link>
        </p>
      ) : null}
    </form>
  );
}
