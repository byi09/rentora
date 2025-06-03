'use client';

import Map from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

export default function DefaultMap({
  children
}: {
  children?: React.ReactNode;
}) {
  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN)
    throw new Error('Mapbox access token is not defined.');

  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      style={{ width: '100%', height: '100%' }}
      initialViewState={{ latitude: 38.795521, longitude: -122.305651, zoom: 10 }}
      maxZoom={20}
      minZoom={3}
    >
      {children}
    </Map>
  )
}
