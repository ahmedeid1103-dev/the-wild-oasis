export type CabinFilter = "all" | "2-3" | "4-7" | "8-12";

export type Cabin = {
  id: string;
  cabinNumber: string;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string;
  description: string;
};
