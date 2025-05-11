import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

interface AdminProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
}

const AdminDashboard = () => {
  const [profile, setProfile] = useState<AdminProfile>({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load admin profile from localStorage initially
    const adminUser = localStorage.getItem("adminUser");
    if (adminUser) {
      const userData = JSON.parse(adminUser);
      setProfile(prev => ({
        ...prev,
        id: userData.id || "",
        firstName: userData.firstName || userData.name?.split(" ")[0] || "",
        lastName: userData.lastName || userData.name?.split(" ")[1] || "",
        email: userData.email || ""
      }));
    } else {
      navigate("/admin/login");
    }

    // Try to fetch complete admin profile from API
    fetchAdminProfile();
  }, [navigate]);

  const fetchAdminProfile = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    try {
      const response = await axios.get("http://localhost:4002/api/admin/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        "http://localhost:4002/api/admin/profile",
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast({
        title: "Profile Updated",
        description: "Your admin profile has been successfully updated.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was an error updating your profile.",
      });
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Administrator Information</h2>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                  Cancel
                </Button>
                <Button type="submit" form="profile-form" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>

          <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="id">Admin ID [SSN Format]</Label>
              <Input
                id="id"
                name="id"
                value={profile.id}
                onChange={handleChange}
                readOnly={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={profile.address}
                onChange={handleChange}
                readOnly={!isEditing}
                className={!isEditing ? "bg-muted" : ""}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={profile.state}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={profile.zipCode}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={!isEditing ? "bg-muted" : ""}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 