
import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Define props interface
interface MapProps {
  className?: string;
  pickupLocation?: [number, number];
  dropoffLocation?: [number, number];
  driverLocation?: [number, number];
}

const Map = ({ className, pickupLocation, dropoffLocation, driverLocation }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize the map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Replace this with your actual Mapbox token
    mapboxgl.accessToken = "pk.eyJ1IjoibG92YWJsZXRlc3QiLCJhIjoiY2xwcmU1cnVwMDE2MDJpcW82am9qc3MxZSJ9.ptj7HqFOxrYzmXlH4S8SBw";

    const initialCoordinates: [number, number] = [-122.4194, 37.7749]; // San Francisco

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: initialCoordinates,
      zoom: 12,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing markers
    const markers = document.querySelectorAll(".mapboxgl-marker");
    markers.forEach((marker) => marker.remove());

    // Add pickup marker
    if (pickupLocation) {
      const pickupEl = document.createElement("div");
      pickupEl.className = "w-5 h-5 bg-primary rounded-full border-2 border-white";
      new mapboxgl.Marker({ element: pickupEl })
        .setLngLat(pickupLocation)
        .addTo(map.current);

      // Center on the pickup location
      map.current.flyTo({ center: pickupLocation, zoom: 14 });
    }

    // Add dropoff marker
    if (dropoffLocation) {
      const dropoffEl = document.createElement("div");
      dropoffEl.className = "w-5 h-5 bg-uber-green rounded-full border-2 border-white";
      new mapboxgl.Marker({ element: dropoffEl })
        .setLngLat(dropoffLocation)
        .addTo(map.current);

      // If we have both pickup and dropoff, fit the map to show both
      if (pickupLocation) {
        const bounds = new mapboxgl.LngLatBounds()
          .extend(pickupLocation)
          .extend(dropoffLocation);

        map.current.fitBounds(bounds, { padding: 80 });
      } else {
        map.current.flyTo({ center: dropoffLocation, zoom: 14 });
      }
    }

    // Add driver marker
    if (driverLocation) {
      const driverEl = document.createElement("div");
      driverEl.className = "w-6 h-6 bg-black rounded-full border-2 border-white flex items-center justify-center";
      
      // Create car icon
      const carIcon = document.createElement("div");
      carIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2V5H3v12h2"/><path d="M14 17H9"/><circle cx="6" cy="17" r="2"/><circle cx="18" cy="17" r="2"/><path d="M6 15V5h12v10"/></svg>`;
      driverEl.appendChild(carIcon);
      
      new mapboxgl.Marker({ element: driverEl })
        .setLngLat(driverLocation)
        .addTo(map.current);

      // Center on the driver location if no other points
      if (!pickupLocation && !dropoffLocation) {
        map.current.flyTo({ center: driverLocation, zoom: 14 });
      }
    }

  }, [pickupLocation, dropoffLocation, driverLocation, mapLoaded]);

  return <div ref={mapContainer} className={className} />;
};

export default Map;
