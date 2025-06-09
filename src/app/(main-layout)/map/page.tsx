import { MapContextProvider } from "@/src/contexts/MapContext";
import DefaultMap from "@/src/components/map/DefaultMap";
// import MapCatalog from "@/src/components/map/MapCatalog";
import MapControls from "@/src/components/map/MapControls";
import MapFilters from "@/src/components/map/MapFilters";
import MapMarkers from "@/src/components/map/MapMarkers";
import MapCatalogComingSoon from "@/src/components/map/MapCatalogComingSoon";

export default function MapPage() {
  return (
    <MapContextProvider>
      <div className="flex flex-col h-[calc(100%-64.8px)] min-h-0">
        <MapFilters />
        <div className="flex w-full h-[calc(100%-49.6px)]">
          <div className="flex-1">
            <DefaultMap>
              <MapControls />
              <MapMarkers />
            </DefaultMap>
          </div>
          {/* <MapCatalog /> */}
          <MapCatalogComingSoon />
        </div>
      </div>
    </MapContextProvider>
  );
}
