import { PropertyListing } from "@/lib/types";
import { useGeolocationContext } from "@/src/contexts/GeolocationContext";
import { getNearbyProperties } from "@/src/db/queries";
import { useEffect, useState } from "react";
import PropertyCard from "../MapCatalogItem";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NearbyProperties() {
  const { coords } = useGeolocationContext();
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<PropertyListing[]>([]);

  useEffect(() => {
    if (!coords) return;
    (async () => {
      const nearbyProperties = await getNearbyProperties(
        coords.lat,
        coords.lng,
        10000
      );
      setProperties(nearbyProperties);
      setIsLoading(false);
    })();
  }, [coords]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      {isLoading && (
        <>
          <div className="h-[250px] rounded-md shadow-md bg-gray-300 animate-pulse"></div>
          <div className="h-[250px] rounded-md shadow-md bg-gray-300 animate-pulse"></div>
          <div className="h-[250px] rounded-md shadow-md bg-gray-300 animate-pulse"></div>
        </>
      )}

      {!isLoading && properties.length === 0 && (
        <div className="col-span-3 grid place-items-center">
          <div className="text-gray-500 flex gap-4 items-center justify-center px-16 py-8 rounded-md shadow-md bg-white md:w-[500px]">
            <FaExclamationTriangle className="text-3xl" />
            We couldn&apos;t find any nearby properties at the time. Please try
            again later or check back soon.
          </div>
        </div>
      )}

      {!isLoading &&
        properties.length > 0 &&
        properties.map((property) => (
          <PropertyCard key={property.properties.id} item={property} />
        ))}
    </div>
  );
}
