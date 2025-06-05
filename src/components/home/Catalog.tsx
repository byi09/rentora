'use client';

import { useGeolocationContext } from "@/src/contexts/GeolocationContext";
import { useEffect, useMemo, useState, useTransition } from "react";

export default function Catalog() {
  const { coords } = useGeolocationContext();
  const [loading, startLoading] = useTransition();
  const [nearbyProperties, setNearbyProperties] = useState([]);

  useEffect(() => {
    startLoading(async () => {
      const c = await coords;
      // TODO: fetch nearby properties
    });
  }, [coords]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-xl text-gray-600">
            Handpicked rentals that offer exceptional value and prime locations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* TODO: render catalog cards */}
        </div>
      </div>
    </section>
  )
}
