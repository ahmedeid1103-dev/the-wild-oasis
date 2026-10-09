import { cacheLife, cacheTag } from "next/cache";

import { capacityRanges, type CabinFilter } from "./data";
import type { Cabin } from "../types/cabin";
import { supabase } from "./supabase/client";

export async function getCabins(filter: CabinFilter = "all"): Promise<Cabin[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("cabins");

  let query = supabase
    .from("cabins")
    .select(
      "id, name, maxCapacity, regularPrice, discount, image, description, cabin_number",
    );

  if (filter !== "all") {
    const [minCapacity, maxCapacity] = capacityRanges[filter];
    query = query
      .gte("maxCapacity", minCapacity)
      .lte("maxCapacity", maxCapacity);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Cabins could not be loaded");
  }

  return data.map((cabin) => ({
    ...cabin,
    cabinNumber: cabin.cabin_number,
  }));
}

export async function getCabin(cabinId: string): Promise<Cabin | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("cabins", `cabin-${cabinId}`);

  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", cabinId)
    .maybeSingle();

  if (error) {
    throw new Error("Cabin could not be loaded");
  }

  if (!data) {
    return null;
  }

  return {
    ...data,
    cabinNumber: data.cabin_number,
  };
}
