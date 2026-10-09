"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { isCapacityFilter, type CabinFilter } from "@/app/lib/data";

const filters: Array<{ value: CabinFilter; label: string }> = [
  { value: "all", label: "All cabins" },
  { value: "2-3", label: "2—3 guests" },
  { value: "4-7", label: "4—7 guests" },
  { value: "8-12", label: "8—12 guests" },
];

export default function CabinBrowser() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const capacityParams = searchParams.getAll("capacity");
  const filter =
    capacityParams.length === 1 && isCapacityFilter(capacityParams[0])
      ? capacityParams[0]
      : "all";

  function handleFilterChange(nextFilter: CabinFilter) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextFilter === "all") {
      params.delete("capacity");
    } else {
      params.set("capacity", nextFilter);
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  return (
    <div className="mb-4 flex justify-end">
      <div className="flex border border-primary-800">
        {filters.map((item) => {
          const isActive = filter === item.value;

          return (
            <button
              key={item.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => handleFilterChange(item.value)}
              className={`px-5 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent-500 text-primary-900"
                  : "hover:bg-primary-900"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
