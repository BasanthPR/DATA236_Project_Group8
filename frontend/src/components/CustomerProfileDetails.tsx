
import { useState } from "react";
import { Star, Phone, Mail, CreditCard, Clock, Car, Menu } from "lucide-react";
import { CustomerProfile } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface CustomerProfileDetailsProps {
  profile: CustomerProfile;
}

const CustomerProfileDetails = ({ profile }: CustomerProfileDetailsProps) => {
  const [activeTab, setActiveTab] = useState<'rides' | 'cards' | 'reviews'>('rides');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (halfStar) {
      stars.push(
        <div key="half" className="relative inline-block">
          <Star className="h-4 w-4 text-yellow-400" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-yellow-400" />);
    }
    
    return <div className="flex">{stars}</div>;
  };

  return (
    <div>
      {/* Basic Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">
            <span className="text-xl font-bold text-primary">
              {profile.firstName?.[0]}{profile.lastName?.[0]}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{profile.firstName} {profile.lastName}</h2>
            <div className="flex items-center mt-1">
              {renderStars(profile.rating)}
              <span className="ml-2 text-sm text-muted-foreground">{profile.rating.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center">
          <Phone className="h-5 w-5 mr-3 text-gray-500" />
          <span>{profile.phoneNumber}</span>
        </div>
        <div className="flex items-center">
          <Mail className="h-5 w-5 mr-3 text-gray-500" />
          <span>{profile.email}</span>
        </div>
        <div className="border-t border-border pt-4 mt-4">
          <p className="text-sm text-muted-foreground mb-1">Home Address</p>
          <p>{profile.address}</p>
          <p>{profile.city}, {profile.state} {profile.zipCode}</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border">
        <div className="flex space-x-8">
          <button
            className={`py-2 relative ${
              activeTab === 'rides' ? 'text-primary font-medium' : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('rides')}
          >
            Ride History
            {activeTab === 'rides' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
            )}
          </button>
          <button
            className={`py-2 relative ${
              activeTab === 'cards' ? 'text-primary font-medium' : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('cards')}
          >
            Payment Methods
            {activeTab === 'cards' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
            )}
          </button>
          <button
            className={`py-2 relative ${
              activeTab === 'reviews' ? 'text-primary font-medium' : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
            {activeTab === 'reviews' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'rides' && (
          <div className="space-y-4">
            {profile.ridesHistory.length === 0 ? (
              <p className="text-muted-foreground">No ride history available.</p>
            ) : (
              profile.ridesHistory.map((ride) => (
                <div key={ride.id} className="flex justify-between items-center p-3 border border-border rounded-md">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-3 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">{ride.destination}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(ride.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(ride.price)}</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Menu className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Receipt</DropdownMenuItem>
                        <DropdownMenuItem>Report an Issue</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'cards' && (
          <div className="space-y-4">
            <div className="bg-primary/5 border border-border rounded-md p-4">
              <div className="flex justify-between items-start">
                <div className="flex">
                  <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center mr-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{profile.cardDetails.cardType}</p>
                    <p className="text-sm text-muted-foreground">•••• {profile.cardDetails.last4Digits}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Expires {profile.cardDetails.expiryMonth}/{profile.cardDetails.expiryYear}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              + Add Payment Method
            </Button>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {profile.reviews.length === 0 ? (
              <p className="text-muted-foreground">No reviews available.</p>
            ) : (
              profile.reviews.map((review) => (
                <div key={review.id} className="border border-border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                        <Car className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                          <span className="ml-2 text-sm text-muted-foreground">{review.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDate(review.date)}</span>
                  </div>
                  <p className="text-sm">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfileDetails;
