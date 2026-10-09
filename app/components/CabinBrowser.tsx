"use client";

import { useEffect, useRef, useState } from "react";

import CabinList from "./CabinList";
import {
  capacityRanges,
  isCapacityFilter,
  type CabinFilter,
} from "@/app/lib/data";
import type { Cabin } from "../types/cabin";

const filters: Array<{ value: CabinFilter; label: string }> = [
  { value: "all", label: "All cabins" },
  { value: "2-3", label: "2—3 guests" },
  { value: "4-7", label: "4—7 guests" },
  { value: "8-12", label: "8—12 guests" },
];

function getSelectionMarkName(filter: CabinFilter) {
  return `cabin-filter-selected:${filter}`;
}

export default function CabinBrowser({
  cabins,
  initialFilter,
}: {
  cabins: Cabin[];
  initialFilter: CabinFilter;
}) {
  const [filter, setFilter] = useState(initialFilter);
  const previousFilter = useRef(initialFilter);

  useEffect(() => {
    function syncFilterFromUrl() {
      const capacityParams = new URLSearchParams(
        window.location.search,
      ).getAll("capacity");

      setFilter(
        capacityParams.length === 1 && isCapacityFilter(capacityParams[0])
          ? capacityParams[0]
          : "all",
      );
    }

    window.addEventListener("popstate", syncFilterFromUrl);

    return () => window.removeEventListener("popstate", syncFilterFromUrl);
  }, []);

  useEffect(() => {
    if (previousFilter.current === filter) {
      return;
    }

    previousFilter.current = filter;

    const startMark = getSelectionMarkName(filter);
    const [startEntry] = performance.getEntriesByName(startMark, "mark");

    if (!startEntry) {
      return;
    }

    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        if (!performance.getEntriesByName(startMark, "mark").length) {
          return;
        }

        const endMark = `cabin-filter-results-visible:${filter}`;
        performance.mark(endMark);
        performance.measure(
          `cabin-filter-results-visible:${filter}`,
          startMark,
          endMark,
        );

        console.info(
          "[cabin-perf]",
          JSON.stringify({
            event: "results-visible",
            filter,
            durationMs: Number(
              (performance.now() - startEntry.startTime).toFixed(1),
            ),
          }),
        );

        performance.clearMarks(startMark);
        performance.clearMarks(endMark);
      });
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [filter]);

  let visibleCabins = cabins;

  if (filter !== "all") {
    const [minCapacity, maxCapacity] = capacityRanges[filter];
    visibleCabins = cabins.filter(
      (cabin) =>
        cabin.maxCapacity >= minCapacity && cabin.maxCapacity <= maxCapacity,
    );
  }

  function handleFilterChange(nextFilter: CabinFilter) {
    for (const item of filters) {
      performance.clearMarks(getSelectionMarkName(item.value));
    }
    performance.mark(getSelectionMarkName(nextFilter));

    const params = new URLSearchParams(window.location.search);

    if (nextFilter === "all") {
      params.delete("capacity");
    } else {
      params.set("capacity", nextFilter);
    }

    const queryString = params.toString();
    const url = new URL(window.location.href);
    url.search = queryString;
    window.history.pushState(null, "", url);
    setFilter(nextFilter);
  }

  return (
    <>
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

      <CabinList cabins={visibleCabins} />
    </>
  );
}
