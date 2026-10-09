import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { CabinDetail } from "@/app/components";
import { getCabin, getCabins } from "@/app/lib/data-service";
import type { Cabin } from "@/app/types/cabin";

type PageProps = {
  params: Promise<{
    cabinId: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { cabinId } = await params;
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
  const cabin = await getCabin(cabinId);

  if (!cabin) {
    notFound();
  }

  return <CabinDetail cabin={cabin} />;
}
