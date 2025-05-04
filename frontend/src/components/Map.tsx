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
          style: 'mapbox://styles/mapbox/dark-v11',
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

  // Add markers and draw route
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    const mapInstance = map.current;

    // Clear markers
    const markers = document.querySelectorAll('.mapboxgl-marker');
    markers.forEach(marker => marker.remove());

    // Add pickup marker
    if (pickupLocation) {
      const el = document.createElement('div');
      el.className = 'pickup-marker';
      el.style.backgroundColor = '#276EF1';
      el.style.width = '15px';
      el.style.height = '15px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      new mapboxgl.Marker(el).setLngLat(pickupLocation).addTo(mapInstance);
    }

    // Add dropoff marker
    if (dropoffLocation) {
      const el = document.createElement('div');
      el.className = 'dropoff-marker';
      el.style.backgroundColor = '#05A357';
      el.style.width = '15px';
      el.style.height = '15px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      new mapboxgl.Marker(el).setLngLat(dropoffLocation).addTo(mapInstance);
    }

    // Fit bounds
    if (pickupLocation && dropoffLocation) {
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(pickupLocation);
      bounds.extend(dropoffLocation);
      mapInstance.fitBounds(bounds, {
        padding: 100,
        maxZoom: 15
      });

      // Fetch and display route
      fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${pickupLocation[0]},${pickupLocation[1]};${dropoffLocation[0]},${dropoffLocation[1]}?geometries=geojson&access_token=${mapboxToken}`)
        .then(res => res.json())
        .then(data => {
          const route = data.routes[0]?.geometry;
          if (!route) return;

          const routeGeoJSON: GeoJSON.Feature<GeoJSON.Geometry> = {
            type: "Feature",
            properties: {},
            geometry: route,
          };

          if (mapInstance.getSource('route')) {
            (mapInstance.getSource('route') as mapboxgl.GeoJSONSource).setData(routeGeoJSON);
          } else {
            mapInstance.addSource('route', {
              type: 'geojson',
              data: routeGeoJSON,
            });

            mapInstance.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': '#fbb03b',
                'line-width': 5,
              },
            });
          }
        })
        .catch(err => {
          console.error("Route fetch error:", err);
        });
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
            onChange={(e) => setMapboxToken(e.target.value)}
          />
          <p className="text-xs text-muted-foreground text-center">
            You can get a token at <a href="https://mapbox.com" className="text-primary underline" target="_blank" rel="noopener noreferrer">mapbox.com</a>
          </p>
          {tokenError && (
            <p className="text-red-500 mt-2 text-sm">{tokenError}</p>
          )}
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden ${className}" />
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
