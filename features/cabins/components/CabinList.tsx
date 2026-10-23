import type { Cabin } from "../types";
import CabinCard from "./CabinCard";

type CabinListProps = {
  cabins: Cabin[];
};

export default function CabinList({ cabins }: CabinListProps) {
  if (cabins.length === 0) {
    return (
      <div className="border border-primary-800 p-8 text-center">
        <h2 className="mb-2 text-lg font-medium text-primary-100">
          No cabins available
        </h2>

        <p className="text-sm text-primary-400">
          There are currently no cabins available. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:gap-12 xl:gap-14">
      {cabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}
