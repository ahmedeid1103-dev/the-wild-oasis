import type { Cabin } from "../types";
import CabinCard from "./CabinCard";

type CabinListProps = {
  cabins: Cabin[];
};

export default function CabinList({ cabins }: CabinListProps) {
  if (cabins.length === 0) {
    return (
      <div className="ui-card px-8 py-10 text-center">
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
    <div className="grid items-stretch gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
      {cabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}
