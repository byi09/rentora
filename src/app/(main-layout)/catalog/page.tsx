'use client';

import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

// Define property type
interface PropertyType {
  id: number;
  lat: number;
  lng: number;
  price: string;
  address: string;
  image: string;
  beds: number;
  baths: number;
}

// Mock data - in real app this would come from an API
const properties: PropertyType[] = [
  {
    id: 1,
    lat: 40.7128,
    lng: -74.0060,
    price: '$2,500/mo',
    address: '123 Student Ave',
    image: '/sample-property-1.jpg',
    beds: 2,
    baths: 1
  },
  {
    id: 2, 
    lat: 40.7158,
    lng: -74.0090,
    price: '$3,200/mo',
    address: '456 College St',
    image: '/sample-property-2.jpg',
    beds: 3,
    baths: 2
  },
  // Add more properties as needed
];

const mapContainerStyle = {
  width: '100%',
  height: '85vh'
};

const center = {
  lat: 40.7128,
  lng: -74.0060
};

export default function CatalogPage() {
  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 right-0 h-16 bg-white z-10 shadow-md px-6 flex items-center">
        <input
          type="text"
          placeholder="Search for location..."
          className="w-full max-w-xl px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="pt-16">
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={13}
            options={{
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }]
                }
              ],
              fullscreenControl: false,
              streetViewControl: false
            }}
            onLoad={map => setMap(map)}
          >
            {properties.map(property => (
              <Marker
                key={property.id}
                position={{ lat: property.lat, lng: property.lng }}
                onClick={() => setSelectedProperty(property)}
              >
                {selectedProperty?.id === property.id && (
                  <InfoWindow
                    position={{ lat: property.lat, lng: property.lng }}
                    onCloseClick={() => setSelectedProperty(null)}
                  >
                    <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs">
                      <div className="relative h-32 w-full mb-3">
                        <img
                          src={property.image}
                          alt={property.address}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm font-semibold">
                          {property.price}
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{property.address}</h3>
                      <div className="flex items-center text-gray-600 text-sm">
                        <span>{property.beds} beds</span>
                        <span className="mx-2">•</span>
                        <span>{property.baths} baths</span>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
