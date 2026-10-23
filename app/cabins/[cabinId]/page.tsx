import { notFound } from "next/navigation";
import type { Metadata } from "next";

import CabinDetail from "@/features/cabins/components/CabinDetail";
import { getCabin, getCabins } from "@/features/cabins/queries";
import type { Cabin } from "@/features/cabins/types";

type PageProps = {
  params: Promise<{
    cabinId: string;
  }>;
};

const CABIN_ID_PATTERN = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i;

function isValidCabinId(cabinId: string): boolean {
  return CABIN_ID_PATTERN.test(cabinId);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { cabinId } = await params;

  if (!isValidCabinId(cabinId)) {
    return {
      title: "Cabin Not Found",
      description: "The cabin you are looking for does not exist.",
    };
  }

  const cabin = await getCabin(cabinId);

  if (!cabin) {
    return {
      title: "Cabin Not Found",
      description: "The cabin you are looking for does not exist.",
    };
  }

  return {
    title: `Cabin ${cabin.name}`,
    description: cabin.description,
  };
}

export async function generateStaticParams() {
  const cabins = await getCabins();

  return cabins.map((cabin: Cabin) => ({
    cabinId: String(cabin.id),
  }));
}

export default async function Page({ params }: PageProps) {
  const { cabinId } = await params;

  if (!isValidCabinId(cabinId)) {
    notFound();
  }

  const cabin = await getCabin(cabinId);

  if (!cabin) {
    notFound();
  }

  return <CabinDetail cabin={cabin} />;
}
