
import { User, CreditCard, Clock, Settings, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";

const Profile = () => {
  // Sample user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    rating: 4.89,
    photoUrl: "https://randomuser.me/api/portraits/men/32.jpg"
  };

  const menuItems = [
    { icon: User, label: "Account", link: "#" },
    { icon: CreditCard, label: "Payment", link: "#" },
    { icon: Clock, label: "Ride history", link: "#" },
    { icon: Settings, label: "Settings", link: "#" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="max-w-md mx-auto pt-24 px-4">
        <div className="flex items-center space-x-4 mb-8">
          <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-primary">
            <img 
              src={user.photoUrl} 
              alt={user.name} 
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex items-center mt-1 text-sm">
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-4 h-4 text-yellow-400 mr-1"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span>{user.rating}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden mb-6">
          {menuItems.map((item, index) => (
            <a 
              key={index}
              href={item.link}
              className={`flex items-center px-4 py-3 hover:bg-secondary/50 ${
                index !== menuItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <item.icon className="h-5 w-5 mr-3 text-primary" />
              <span>{item.label}</span>
            </a>
          ))}
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <button className="w-full flex items-center px-4 py-3 hover:bg-secondary/50 text-left text-destructive">
            <LogOut className="h-5 w-5 mr-3" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
