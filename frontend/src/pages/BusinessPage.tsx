
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Filter, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BillingInfo } from "@/types/billing";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const BillingPage = () => {
  const navigate = useNavigate();
  const [billings, setBillings] = useState<BillingInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'week' | 'month'>('all');

  // Mock data for demonstration purposes
  useEffect(() => {
    const fetchBillings = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockBillings: BillingInfo[] = [
          {
            id: "B-12345",
            date: "2024-05-01",
            pickupTime: "14:30",
            dropoffTime: "15:10",
            distanceCovered: 12.5,
            totalAmount: 25.75,
            sourceLocation: "Downtown SF",
            destinationLocation: "San Francisco Airport",
            driverId: "D-5678",
            customerId: "C-1234",
            predictedPrice: 24.50,
            actualPrice: 25.75
          },
          {
            id: "B-12346",
            date: "2024-05-02",
            pickupTime: "09:15",
            dropoffTime: "09:45",
            distanceCovered: 8.3,
            totalAmount: 18.40,
            sourceLocation: "Marina District",
            destinationLocation: "Financial District",
            driverId: "D-5679",
            customerId: "C-1234",
            predictedPrice: 19.00,
            actualPrice: 18.40
          },
          {
            id: "B-12347",
            date: "2024-04-28",
            pickupTime: "18:20",
            dropoffTime: "19:05",
            distanceCovered: 15.2,
            totalAmount: 32.60,
            sourceLocation: "Golden Gate Park",
            destinationLocation: "Sunset District",
            driverId: "D-5680",
            customerId: "C-1234",
            predictedPrice: 30.00,
            actualPrice: 32.60
          },
          {
            id: "B-12348",
            date: "2024-04-25",
            pickupTime: "12:00",
            dropoffTime: "12:30",
            distanceCovered: 5.8,
            totalAmount: 14.25,
            sourceLocation: "UCSF Medical Center",
            destinationLocation: "Mission District",
            driverId: "D-5681",
            customerId: "C-1234",
            predictedPrice: 15.00,
            actualPrice: 14.25
          }
        ];
        
        setBillings(mockBillings);
      } catch (error) {
        console.error("Error fetching billing data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBillings();
  }, []);

  const filteredBillings = () => {
    if (filterType === 'all') return billings;
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    return billings.filter(bill => {
      const billDate = new Date(bill.date);
      if (filterType === 'week') {
        return billDate >= oneWeekAgo;
      } else if (filterType === 'month') {
        return billDate >= oneMonthAgo;
      }
      return true;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatAddress = (address: string) => {
    if (address.length > 25) {
      return address.substring(0, 22) + '...';
    }
    return address;
  };

  const calculateDuration = (pickup: string, dropoff: string) => {
    const [pickupHours, pickupMinutes] = pickup.split(':').map(Number);
    const [dropoffHours, dropoffMinutes] = dropoff.split(':').map(Number);
    
    const pickupTotalMinutes = pickupHours * 60 + pickupMinutes;
    const dropoffTotalMinutes = dropoffHours * 60 + dropoffMinutes;
    
    const diffMinutes = dropoffTotalMinutes - pickupTotalMinutes;
    
    if (diffMinutes < 0) {
      // Handle case where dropoff is next day
      return `${Math.floor((1440 + diffMinutes) / 60)}h ${(1440 + diffMinutes) % 60}m`;
    }
    
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    if (hours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 p-4 bg-background z-10 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold ml-2">Billing History</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  {filterType === 'all' ? 'All Time' : 
                   filterType === 'week' ? 'This Week' : 'This Month'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterType('all')}>
                  All Time
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('week')}>
                  This Week
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType('month')}>
                  This Month
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <div className="container max-w-3xl mx-auto pt-20 pb-10 px-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredBillings().length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-500">No billing information found</h3>
            <p className="text-gray-400 mt-2">Your billing history will appear here after your first ride</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBillings().map((bill) => (
              <div 
                key={bill.id}
                className="bg-card p-4 rounded-lg shadow border border-border hover:border-gray-400 transition-colors"
                onClick={() => navigate(`/billing/${bill.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(bill.date)}
                      </span>
                    </div>
                    <h3 className="font-medium">{formatAddress(bill.sourceLocation)} → {formatAddress(bill.destinationLocation)}</h3>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(bill.totalAmount)}</p>
                    <div className="flex items-center justify-end mt-1">
                      <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {calculateDuration(bill.pickupTime, bill.dropoffTime)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm text-muted-foreground">
                  <div>
                    <div className="flex items-center">
                      <span className="mr-2">Distance:</span>
                      <span className="font-medium">{bill.distanceCovered} mi</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="mr-2">Predicted:</span>
                      <span className="font-medium">{formatCurrency(bill.predictedPrice || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingPage;
