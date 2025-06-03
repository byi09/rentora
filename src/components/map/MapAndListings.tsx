'use client';

import Map from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import MapFilters from "./MapFilters";
import { MapContextProvider } from "./map-context";
import MapCatalog from "./MapCatalog";
import MapControls from "./MapControls";
import MapMarkers from "./MapMarkers";

export default function MapAndListings() {
  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN)
    throw new Error('Mapbox access token is not defined.');

  return (
    <MapContextProvider>
      <div className="flex flex-col h-full">
        <MapFilters />
        <div className="flex w-full h-[calc(100%-49.6px)]">
          <div className="flex-1">
            <Map
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
              mapStyle="mapbox://styles/mapbox/streets-v12"
              style={{ width: '100%', height: '100%' }}
              initialViewState={{ latitude: 37.795521, longitude: -122.305651, zoom: 10 }}
              maxZoom={20}
              minZoom={3}
            >
              <MapControls />
              <MapMarkers />
            </Map>
          </div>
          <MapCatalog />
        </div>
      </div>
    </MapContextProvider>
  )
}
