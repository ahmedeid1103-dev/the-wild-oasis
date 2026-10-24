import type { Cabin } from "@/features/cabins/types";

import CabinReservationForm from "./CabinReservationForm";

export default function CabinReservation({ cabin }: { cabin: Cabin }) {
  const discountedPrice = Math.max(cabin.regularPrice - cabin.discount, 0);

  return (
    <aside className="ui-card h-fit border-accent-700/60 bg-gradient-to-b from-primary-900 to-primary-950 p-5 sm:p-6 lg:sticky lg:top-6">
      <p className="ui-eyebrow">Plan your stay</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-medium text-primary-50">
          ${discountedPrice.toLocaleString("en-US")}
        </span>
        <span className="text-sm text-primary-400">/ night</span>
      </div>

      {cabin.discount > 0 && (
        <p className="mt-2 text-sm text-primary-400">
          Regular price:{" "}
          <span className="line-through">
            ${cabin.regularPrice.toLocaleString("en-US")}
          </span>
        </p>
      )}

      <CabinReservationForm
        cabinId={cabin.id}
        maxCapacity={cabin.maxCapacity}
        discountedPrice={discountedPrice}
      />
    </aside>
  );
}
