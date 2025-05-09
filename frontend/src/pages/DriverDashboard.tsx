// src/pages/DriverDashboardPage.tsx
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function DriverDashboardPage() {
  const navigate = useNavigate();
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const savedUser = JSON.parse(localStorage.getItem("driverData") || "{}") as {
    firstName?: string;
    lastName?: string;
    email?: string;
  };

  // Fetch profile photo on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/driver/login");
      return;
    }

    fetch("http://localhost:4004/api/driver/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not load profile");
        return res.json();
      })
      .then((data) => {
        if (data.imageUrl) setPhotoUrl(data.imageUrl);
      })
      .catch(console.error);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("driverLoggedIn");
    localStorage.removeItem("driverData");
    navigate("/driver/login");
  };

  const initials = `${savedUser.firstName?.[0] || ""}${savedUser.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top nav */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">Driver Dashboard</h1>
          <nav className="flex items-center space-x-6">
            <NavLink
              to="/driver/profile"
              className={({ isActive }) =>
                isActive
                  ? "text-black font-semibold"
                  : "text-gray-600 hover:text-black"
              }
            >
              Profile
            </NavLink>
            <NavLink
              to="/driver/trips"
              className={({ isActive }) =>
                isActive
                  ? "text-black font-semibold"
                  : "text-gray-600 hover:text-black"
              }
            >
              Trips
            </NavLink>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Driver"
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="flex items-center justify-center h-full text-gray-500">
                  {initials || "U"}
                </span>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Replace with <Outlet /> if using nested routes */}
        <p className="text-gray-700">
          Welcome, {savedUser.firstName} {savedUser.lastName}! Select a tab
          above to view your profile or trips.
        </p>
      </main>
    </div>
  );
}
