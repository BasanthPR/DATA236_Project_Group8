import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from "@/components/ui/use-toast";

type MapProps = {
  pickupLocation?: [number, number];
  dropoffLocation?: [number, number];
  className?: string;
};

const Map = ({ pickupLocation, dropoffLocation, className = '' }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [tokenError, setTokenError] = useState<string>('');

  // Fetch token
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('http://localhost:4001/api/mapbox-token');
        const data = await response.json();
        setMapboxToken(data.token);
      } catch (error) {
        console.error("Failed to fetch Mapbox token:", error);
        toast({
          title: "Token Fetch Error",
          description: "Failed to fetch Mapbox token from backend",
          variant: "destructive"
        });
      }
    };
    fetchToken();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapboxToken) return;
    if (!mapboxToken.startsWith('pk.')) {
      setTokenError('Please use a public access token (starts with pk.)');
      toast({
        title: "Invalid Mapbox Token",
        description: "Please use a public access token that starts with 'pk.'",
        variant: "destructive"
      });
      return;
    } else {
      setTokenError('');
    }

    if (mapContainer.current && !map.current) {
      try {
        mapboxgl.accessToken = mapboxToken;
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11', // full-color streets
          center: [-74.006, 40.7128],
          zoom: 12,
        });

        map.current.on('load', () => {
          setMapLoaded(true);
        });
      } catch (error) {
        console.error('Mapbox initialization error:', error);
        toast({
          title: "Map Error",
          description: error instanceof Error ? error.message : 'Failed to initialize map',
          variant: "destructive"
        });
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);

  // Draw route & markers
  useEffect(() => {
    if (!mapLoaded || !map.current) return;
    const mapInstance = map.current;

    // Cleanup existing layers and sources
    if (mapInstance.getLayer('route-halo')) {
      mapInstance.removeLayer('route-line');
      mapInstance.removeLayer('route-halo');
      mapInstance.removeSource('route');
    }
    // Clear old markers/popups
    document.querySelectorAll('.mapboxgl-marker').forEach(m => m.remove());
    document.querySelectorAll('.mapboxgl-popup').forEach(p => p.remove());

    if (pickupLocation && dropoffLocation) {
      // Fit bounds
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(pickupLocation);
      bounds.extend(dropoffLocation);
      mapInstance.fitBounds(bounds, { padding: 100, maxZoom: 15 });

      // Fetch route
      fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupLocation[0]},${pickupLocation[1]};` +
        `${dropoffLocation[0]},${dropoffLocation[1]}?geometries=geojson&access_token=${mapboxToken}`
      )
        .then(res => res.json())
        .then(data => {
          const coords = data.routes?.[0]?.geometry;
          if (!coords) return;

          const routeGeoJSON: GeoJSON.Feature<GeoJSON.Geometry> = {
            type: 'Feature',
            properties: {},
            geometry: coords,
          };

          // Add source
          mapInstance.addSource('route', { type: 'geojson', data: routeGeoJSON });

          // White halo
          mapInstance.addLayer({
            id: 'route-halo',
            type: 'line',
            source: 'route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#ffffff', 'line-width': 8 }
          });

          // Black core
          mapInstance.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#000000', 'line-width': 4 }
          });

          // Start marker
          new mapboxgl.Marker({ color: '#000000' })
            .setLngLat(pickupLocation)
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('Start'))
            .addTo(mapInstance);

          // End marker
          new mapboxgl.Marker({ color: '#000000' })
            .setLngLat(dropoffLocation)
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('End'))
            .addTo(mapInstance);
        })
        .catch(err => console.error('Route fetch error:', err));
    }
  }, [pickupLocation, dropoffLocation, mapLoaded]);

  return (
    <div className={`relative ${className}`}>
      {!mapboxToken && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10 p-4">
          <p className="mb-4 text-center">Please enter your Mapbox public token to use the map</p>
          <input
            type="text"
            className="uber-input w-full max-w-sm mb-2"
            placeholder="Enter your Mapbox public token (starts with pk.)"
            onChange={e => setMapboxToken(e.target.value)}
          />
          <p className="text-xs text-muted-foreground text-center">
            You can get a token at <a href="https://mapbox.com" className="text-primary underline" target="_blank" rel="noopener noreferrer">mapbox.com</a>
          </p>
          {tokenError && <p className="text-red-500 mt-2 text-sm">{tokenError}</p>}
        </div>
      )}

      <div ref={mapContainer} className={`w-full h-full rounded-lg overflow-hidden ${className}`} />

      {(!mapboxToken || !mapLoaded) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-0">
          <div className="text-4xl font-bold mb-4">Uber</div>
          <div className="text-muted-foreground">Map loading...</div>
        </div>
      )}
    </div>
  );
};

export default Map;
