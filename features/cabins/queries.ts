import { cacheLife, cacheTag } from "next/cache";

import type { Cabin } from "./types";
import { supabase } from "@/lib/supabase/data-client";

// Keep the public catalog cached while limiting stale data to a short window.
// Cabin mutations should invalidate the shared tags immediately.

export async function getCabins(): Promise<Cabin[]> {
  "use cache";
  cacheLife({ stale: 30, revalidate: 60, expire: 300 });
  cacheTag("cabins");

  // Only fetch the fields we need for the public listing. The database uses snake_case,
  // while the app model exposes camelCase, so we map cabin_number to cabinNumber here.
  const query = supabase
    .from("cabins")
    .select(
      "id, name, maxCapacity, regularPrice, discount, image, description, cabin_number",
    );

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
  cacheLife({ stale: 30, revalidate: 60, expire: 300 });
  // Include the cabin ID in the cache key so each cabin is revalidated independently.
  cacheTag("cabins", `cabin-${cabinId}`);

  // Fetch one cabin by ID; return null when no row exists instead of throwing.
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
