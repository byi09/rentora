'use client';

import { LngLat } from "mapbox-gl";
import { createContext, useContext, useMemo } from "react";

interface GeolocationContextProps {
  coords: Promise<LngLat | null>;
}

const GeolocationContext = createContext<GeolocationContextProps | null>(null);

export const useGeolocationContext = () => {
  const context = useContext(GeolocationContext);
  if (!context) {
    throw new Error("useGeolocationContext must be used within a GeolocationProvider");
  }
  return context;
}

export function GeolocationProvider({ children }: { children: React.ReactNode; }) {
  const coords = useMemo(async () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      return null;
    }

    const navigatorPromise = new Promise<LngLat | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const lngLat = new LngLat(longitude, latitude);
          resolve(lngLat);
        },
        (error) => {
          console.warn("Error getting geolocation:", error);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });

    const lngLat = await navigatorPromise;
    if (lngLat) {
      return lngLat;
    }

    console.warn("Using fallback geolocation from IP API");
    const ipData = await fetch("https://ipapi.co/8.8.8.8/json/");
    if (!ipData.ok) {
      const response = await ipData.json();
      console.warn("Failed to fetch geolocation from IP API:", response);
      return null;
    }

    const ipLocation = await ipData.json();
    const { latitude, longitude } = ipLocation;
    const ipLngLat = new LngLat(longitude, latitude);
    return ipLngLat;
  }, []);

  return (
    <GeolocationContext.Provider value={{ coords }}>
      {children}
    </GeolocationContext.Provider>
  );
}
