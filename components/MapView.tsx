import React, { useEffect, useRef } from 'react';
import { Listing } from '../types';

interface MapViewProps {
  listings: Listing[];
  onListingClick: (listing: Listing) => void;
  center?: { lat: number; lng: number };
}

const MapView: React.FC<MapViewProps> = ({ listings, onListingClick, center }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any>(null);

  useEffect(() => {
    // Access L from window because it's loaded via CDN in index.html
    const L = (window as any).L;
    if (!L || !mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView(center ? [center.lat, center.lng] : [39.8283, -98.5795], 4);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(mapRef.current);

      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
      markersRef.current = L.layerGroup().addTo(mapRef.current);
    }

    if (center && mapRef.current) {
      mapRef.current.setView([center.lat, center.lng], 8);
    }

    if (markersRef.current && mapRef.current) {
      markersRef.current.clearLayers();
      listings.forEach(listing => {
        if (!listing.coordinates) return;
        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="price-marker">$${listing.pricePerDay}</div>`,
          iconSize: [40, 20],
          iconAnchor: [20, 10]
        });
        const marker = L.marker([listing.coordinates.lat, listing.coordinates.lng], { icon })
          .on('click', () => onListingClick(listing));
        markersRef.current?.addLayer(marker);
      });
    }
  }, [listings, center, onListingClick]);

  return <div ref={mapContainerRef} className="w-full h-full rounded-[2rem] overflow-hidden border border-stone-200" />;
};

export default MapView;