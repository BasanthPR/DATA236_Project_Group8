import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import MainNavbar from "@/components/MainNavbar";
import Map from "@/components/Map";
import axios from "axios";

const HomePage = () => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [pickupLocation, setPickupLocation] = useState<[number, number]>();
  const [dropoffLocation, setDropoffLocation] = useState<[number, number]>();
  const [mapboxToken, setMapboxToken] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<any[]>([]);
  // Track which field is active for showing suggestions
  const [activeField, setActiveField] = useState<'pickup'|'dropoff'|null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("http://localhost:4001/api/mapbox-token");
        const data = await res.json();
        setMapboxToken(data.token);
      } catch (error) {
        console.error("Failed to fetch Mapbox token", error);
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (!mapboxToken || pickup.length < 3) return setPickupSuggestions([]);
    const controller = new AbortController();
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        pickup
      )}.json?access_token=${mapboxToken}&autocomplete=true&limit=5`,
      { signal: controller.signal }
    )
      .then((res) => res.json())
      .then((data) => setPickupSuggestions(data.features || []))
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });
    return () => controller.abort();
  }, [pickup, mapboxToken]);

  useEffect(() => {
    if (!mapboxToken || dropoff.length < 3) return setDropoffSuggestions([]);
    const controller = new AbortController();
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        dropoff
      )}.json?access_token=${mapboxToken}&autocomplete=true&limit=5`,
      { signal: controller.signal }
    )
      .then((res) => res.json())
      .then((data) => setDropoffSuggestions(data.features || []))
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });
    return () => controller.abort();
  }, [dropoff, mapboxToken]);

  const handleSeePrices = async () => {
    navigate("/login");
    if (!pickup || !dropoff || !pickupLocation || !dropoffLocation) {
      alert("Please enter both pickup and dropoff locations.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/rides", {
        pickup,
        dropoff,
        pickupCoords: pickupLocation,
        dropoffCoords: dropoffLocation,
        time: "Now",
        rider: "For me",
        additionalStops: [],
      });

      console.log("Ride saved from homepage:", res.data);
      navigate("/ride-options", { state: res.data });
    } catch (err) {
      console.error("Error saving ride from homepage:", err);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <MainNavbar />

      <main className="flex-1">
        <section className="pt-20 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-12 items-start">
            {/* Left: Form */}
            <div>
              <h1 className="text-5xl font-bold mb-8">
                Go anywhere with<br />Uber
              </h1>

              <div className="space-y-2 max-w-xl">
                {/* Pickup Input */}
                <div className="relative">
                  <span className="absolute top-1/2 -translate-y-1/2 left-3 w-2 h-2 bg-black rounded-full" />
                  <input
                    type="text"
                    placeholder="Pickup location"
                    className="w-full px-4 py-3 pl-8 border border-gray-300 rounded-md"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    onFocus={() => setActiveField('pickup')}
                    onBlur={() => setTimeout(() => setActiveField(null), 200)}
                  />
                  {activeField === 'pickup' && pickupSuggestions.length > 0 && (
                    <ul className="absolute z-50 top-full left-0 right-0 bg-white border rounded-md shadow mt-1 max-h-60 overflow-y-auto">
                      {pickupSuggestions.map((place) => (
                        <li
                          key={place.id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onMouseDown={() => {
                            setPickup(place.place_name);
                            setPickupLocation(place.center);
                            setPickupSuggestions([]);
                            setActiveField(null);
                          }}
                        >
                          {place.place_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Dropoff Input */}
                <div className="relative">
                  <span className="absolute top-1/2 -translate-y-1/2 left-3 w-2 h-2 bg-black rounded-full" />
                  <input
                    type="text"
                    placeholder="Dropoff location"
                    className="w-full px-4 py-3 pl-8 border border-gray-300 rounded-md"
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    onFocus={() => setActiveField('dropoff')}
                    onBlur={() => setTimeout(() => setActiveField(null), 200)}
                  />
                  {activeField === 'dropoff' && dropoffSuggestions.length > 0 && (
                    <ul className="absolute z-50 top-full left-0 right-0 bg-white border rounded-md shadow mt-1 max-h-60 overflow-y-auto">
                      {dropoffSuggestions.map((place) => (
                        <li
                          key={place.id}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onMouseDown={() => {
                            setDropoff(place.place_name);
                            setDropoffLocation(place.center);
                            setDropoffSuggestions([]);
                            setActiveField(null);
                          }}
                        >
                          {place.place_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Today
                  </Button>
                  <Button variant="outline" className="flex items-center justify-between gap-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Now
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="default"
                    className="bg-black hover:bg-gray-800 text-white"
                    onClick={handleSeePrices}
                  >
                    See prices
                  </Button>
                  <Link to="/login" className="text-black hover:text-gray-700 py-2 flex items-center">
                    Log in to see your recent activity
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Map Display */}
            <div className="w-full h-[400px]">
              <Map
                pickupLocation={pickupLocation}
                dropoffLocation={dropoffLocation}
                className="h-full"
              />
            </div>
          </div>
        </section>

        {/* Suggestions Section */}
        <section className="py-12 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Suggestions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: "courier", title: "Courier", description: "Uber makes same-day item delivery easier than ever.", link: "/deliver" },
              { id: "grocery", title: "Grocery", description: "Get groceries delivered to your door with Uber Eats.", link: "https://www.ubereats.com/" },
              { id: "hourly", title: "Hourly", description: "Request a trip for a block of time and make multiple stops.", link: "/ride" }
            ].map((suggestion) => (
              <div key={suggestion.id} className="bg-gray-100 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">{suggestion.title}</h3>
                <p className="text-gray-700 mb-6">{suggestion.description}</p>
                <div className="flex justify-between items-end">
                  {suggestion.id === "grocery" ? (
                    <a href={suggestion.link} target="_blank" rel="noopener noreferrer" className="text-black font-medium hover:underline">
                      Details
                    </a>
                  ) : (
                    <Link to={suggestion.link} className="text-black font-medium hover:underline">
                      Details
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
