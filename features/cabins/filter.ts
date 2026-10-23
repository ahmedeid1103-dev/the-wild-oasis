import type { CabinFilter } from "./types";

export type { CabinFilter } from "./types";

export const capacityRanges: Record<
  Exclude<CabinFilter, "all">,
  readonly [number, number]
> = {
  "2-3": [2, 3],
  "4-7": [4, 7],
  "8-12": [8, 12],
};

export function isCapacityFilter(
  value: unknown,
): value is Exclude<CabinFilter, "all"> {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(capacityRanges, value)
  );
}
