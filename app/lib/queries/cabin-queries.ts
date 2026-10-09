// app/lib/queries/cabin-queries.ts
import { queryOptions } from "@tanstack/react-query";

import { getCabin, getCabins } from "../data-service";

export const cabinQueries = {
  list: () =>
    queryOptions({
      queryKey: ["cabins", "list"],
      queryFn: () => getCabins(),
    }),

  detail: (cabinId: string) =>
    queryOptions({
      queryKey: ["cabins", "detail", cabinId],
      queryFn: () => getCabin(cabinId),
    }),
};
