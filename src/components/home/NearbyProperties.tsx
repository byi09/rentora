import { PropertyListing } from "@/lib/types";
import { useGeolocationContext } from "@/src/contexts/GeolocationContext";
import { getNearbyProperties } from "@/src/db/queries";
import { useEffect, useState } from "react";
import PropertyCard from "../MapCatalogItem";
import { CardSkeleton } from "../ui/LoadingSkeleton";
import { AlertTriangle } from "lucide-react";

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
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </>
      )}

      {!isLoading && properties.length === 0 && (
        <div className="col-span-3 flex justify-center">
          <div className="card text-center p-8 max-w-md">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Properties Found
            </h3>
            <p className="text-gray-600">
              We couldn&apos;t find any nearby properties at the moment. Please try again later or check back soon.
            </p>
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
