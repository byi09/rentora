"use client";

import { ClientLocation } from "@/lib/types";
import { reverseGeocode } from "@/utils/geocoding";
import { LngLat } from "mapbox-gl";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition
} from "react";

interface GeolocationContextProps {
  coords: LngLat | null;
  location: ClientLocation | null;
  isLoading: boolean;
}

const GeolocationContext = createContext<GeolocationContextProps | null>(null);

export const useGeolocationContext = () => {
  const context = useContext(GeolocationContext);
  if (!context) {
    throw new Error(
      "useGeolocationContext must be used within a GeolocationProvider"
    );
  }
  return context;
};

export function GeolocationProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [isLoading, startLoading] = useTransition();
  const [coords, setCoords] = useState<LngLat | null>(null);
  const [location, setLocation] = useState<ClientLocation | null>(null);

  useEffect(() => {
    startLoading(async () => {
      if (typeof window === "undefined") {
        return;
      }

      if (!navigator || !navigator.geolocation) {
        return;
      }

      // attempt to use browser geolocation API
      const navigatorPromise = new Promise<LngLat | null>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const lngLat = new LngLat(longitude, latitude);
            resolve(lngLat);
          },
          () => {
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      });

      const lngLat = await navigatorPromise;
      let coords = lngLat;

      // fallback to IP geolocation
      if (!coords) {
        const ipData = await fetch("https://ipapi.co/8.8.8.8/json/");
        if (!ipData.ok) return;

        const ipLocation = await ipData.json();
        const { latitude, longitude } = ipLocation;
        const ipLngLat = new LngLat(longitude, latitude);
        coords = ipLngLat;
      }

      if (!coords) {
        console.warn("Unable to retrieve geolocation coordinates.");
        return;
      }

      setCoords(coords);

      // start reverse geocoding
      const { lat, lng } = coords;
      const location = await reverseGeocode(lat, lng);
      if (!location) {
        console.warn("Failed to reverse geocode coordinates.");
        return;
      }

      setLocation(location);
    });
  }, []);

  return (
    <GeolocationContext.Provider value={{ coords, location, isLoading }}>
      {children}
    </GeolocationContext.Provider>
  );
}
