"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import CabinList from "./CabinList";
import {
  capacityRanges,
  isCapacityFilter,
  type CabinFilter,
} from "../filter";
import type { Cabin } from "../types";

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
}: {
  cabins: Cabin[];
}) {
  const searchParams = useSearchParams();
  const capacityParams = searchParams.getAll("capacity");
  const filter: CabinFilter =
    capacityParams.length === 1 && isCapacityFilter(capacityParams[0])
      ? capacityParams[0]
      : "all";
  const previousFilter = useRef(filter);

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
    if (nextFilter === filter) {
      return;
    }

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
  }

  return (
    <section aria-label="Browse cabins">
      <div className="mb-6 border-y border-primary-800 py-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-baseline gap-3">
            <p className="font-medium text-primary-100">
              {visibleCabins.length}{" "}
              {visibleCabins.length === 1 ? "cabin" : "cabins"}
            </p>
            <span aria-hidden="true" className="text-primary-600">
              /
            </span>
            <p className="text-sm text-primary-400">Choose your mountain stay</p>
          </div>

          <div
            role="group"
            aria-label="Filter cabins by capacity"
            className="flex flex-wrap gap-2"
          >
            {filters.map((item) => {
              const isActive = filter === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleFilterChange(item.value)}
                  className={`ui-button min-h-10 px-4 py-2 text-xs sm:text-sm ${
                    isActive
                      ? "ui-button--primary"
                      : "ui-button--secondary"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <CabinList cabins={visibleCabins} />
    </section>
  );
}
