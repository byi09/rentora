import { searchPropertiesWithFilter } from "@/src/db/queries";

interface FilterOptions {
  swBounds?: {
    lat: number;
    lng: number;
  };
  neBounds?: {
    lat: number;
    lng: number;
  };
  leaseType?: string;
  propertyTypes: {
    apartment?: boolean;
    house?: boolean;
    condo?: boolean;
    townhouse?: boolean;
  };
  priceRange: {
    min: number;
    max: number;
  };
  bedrooms: number;
  bathrooms: number;
  petsAllowed?: boolean;
  furnished?: boolean;
  utilitiesIncluded?: boolean;
  parking?: boolean;
  ac?: boolean;
  inUnitLaundry?: boolean;
}

type SortOption =
  | "priceAsc"
  | "priceDesc"
  | "newest"
  | "oldest"
  | "bedrooms"
  | "bathrooms";

type PropertyListing = Awaited<
  ReturnType<typeof searchPropertiesWithFilter>
>[0];
