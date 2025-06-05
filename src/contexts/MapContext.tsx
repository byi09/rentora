'use client'

import type { FilterOptions, PropertyListing, SortOption } from "@/lib/types";
import { searchPropertiesWithFilter } from "@/src/db/queries";
import { createContext, useContext, useEffect, useState, useTransition } from "react";

interface MapContextProps {
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  sortOption: SortOption;
  setSortOption: React.Dispatch<React.SetStateAction<SortOption>>;
  catalog: PropertyListing[];
  fetchingListings: boolean;
  setReady: React.Dispatch<React.SetStateAction<boolean>>;
}

const MapContext = createContext<MapContextProps | null>(null);

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapContextProvider");
  }
  return context;
}

export const MapContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [fetchingListings, startFetchingListings] = useTransition();
  const [ready, setReady] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    propertyTypes: {},
    priceRange: {
      min: 0,
      max: 0
    },
    bedrooms: 0,
    bathrooms: 0,
    petsAllowed: false,
    furnished: false,
    utilitiesIncluded: false,
    parking: false,
    leaseType: 'rent',
  });
  const [sortOption, setSortOption] = useState<SortOption>('priceAsc');

  const [catalog, setCatalog] = useState<PropertyListing[]>([]);

  // update catalog based on filter options
  useEffect(() => {
    if (!ready) return;
    startFetchingListings(async () => {
      // JSON stringify + parse to avoid mutating the original filterOptions object
      // and pass deep objects to server-side function
      const optionsBundle = JSON.parse(JSON.stringify(filterOptions));
      const properties = await searchPropertiesWithFilter(optionsBundle, sortOption);
      setCatalog(properties);
    });
  }, [filterOptions, ready, sortOption]);

  return (
    <MapContext.Provider value={{ filterOptions, setFilterOptions, fetchingListings, setReady, catalog, sortOption, setSortOption }}>
      {children}
    </MapContext.Provider>
  );
}

