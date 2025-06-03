'use client';

import { useCallback, useEffect } from "react";
import { useMap } from "react-map-gl/mapbox";
import { useMapContext } from "./map-context";
import { MapEvent } from "mapbox-gl";

export default function MapControls() {
  const { current: map } = useMap();
  const { setFilterOptions, setReady } = useMapContext();

  const updateBounds = useCallback((e: MapEvent) => {
    const bounds = e.target.getBounds();
    if (!bounds) return;

    // Update filter options with the new bounds
    setFilterOptions(prev => ({
      ...prev,
      swBounds: bounds.getSouthWest(),
      neBounds: bounds.getNorthEast()
    }));
  }, [setFilterOptions]);

  useEffect(() => {
    if (!map) return;

    map.on('load', e => {
      updateBounds(e);
      e.target.on('moveend', updateBounds);
      setReady(true);
    });
  }, [map, updateBounds, setReady]);

  return null;
}
