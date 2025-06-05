"use client";

import { SortOption } from "@/lib/types";
import Dropdown, { DropdownItem } from "../ui/Dropdown";
import Spinner from "../ui/Spinner";
import { useMapContext } from "../../contexts/MapContext";
import MapCatalogItem from "./MapCatalogItem";
import { listToMap } from "@/utils/converters";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "priceAsc", label: "Price: Low to High" },
  { value: "priceDesc", label: "Price: High to Low" },
  { value: "bedrooms", label: "Bedrooms" },
  { value: "bathrooms", label: "Bathrooms" }
];

const sortLabelMap = listToMap(sortOptions, "value");

export default function MapCatalog() {
  const { catalog, sortOption, setSortOption, fetchingListings } =
    useMapContext();

  return (
    <div className="flex flex-col px-6 py-4 gap-4 shadow-xl z-10 w-[400px] xl:w-[760px] h-full min-h-0 overflow-y-auto relative">
      {fetchingListings && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-20">
          <Spinner size="lg" />
        </div>
      )}

      <header>
        <h1 className="text-2xl font-bold text-blue-900">Rental Listings</h1>
        <div className="flex justify-between items-center">
          <strong className="font-semibold">
            {catalog.length} rental{catalog.length > 1 ? "s" : ""} available
          </strong>

          {/* sort dropdown */}
          <Dropdown
            trigger={sortLabelMap[sortOption].label}
            triggerClassName="border-0 text-blue-800"
            align="end"
          >
            {sortOptions.map((option) => (
              <DropdownItem
                key={option.value}
                onClick={() => setSortOption(option.value as SortOption)}
              >
                {option.label}
              </DropdownItem>
            ))}
          </Dropdown>
        </div>
      </header>

      {/* listings */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {catalog.map((item) => (
          <MapCatalogItem key={item.properties.id} item={item} />
        ))}
      </div>
    </div>
  );
}
