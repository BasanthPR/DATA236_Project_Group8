
import { useState } from 'react';
import { ArrowLeft, User, Phone, Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type RiderSelectionModalProps = {
  onClose: () => void;
  onSelect: (rider: string) => void;
};

const RiderSelectionModal = ({ onClose, onSelect }: RiderSelectionModalProps) => {
  const [selectedRider, setSelectedRider] = useState<'me' | 'other'>('me');
  const [newRiderName, setNewRiderName] = useState('');
  const [newRiderPhone, setNewRiderPhone] = useState('');
  const [addingRider, setAddingRider] = useState(false);

  const handleSubmit = () => {
    if (selectedRider === 'me') {
      onSelect('For me');
    } else if (newRiderName) {
      onSelect(`For ${newRiderName}`);
    }
    onClose();
  };

  const startAddingRider = () => {
    setAddingRider(true);
    setSelectedRider('other');
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="p-4 max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={onClose} className="p-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-6">
          {addingRider ? 'Add a rider' : 'Who is this ride for?'}
        </h1>

        {addingRider ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <Input
                type="text"
                placeholder="Rider's full name"
                value={newRiderName}
                onChange={(e) => setNewRiderName(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
              <Input
                type="tel"
                placeholder="(123) 456-7890"
                value={newRiderPhone}
                onChange={(e) => setNewRiderPhone(e.target.value)}
                className="w-full"
              />
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              This person will get text updates about this ride.
            </p>
            
            <div className="flex space-x-4 mt-6">
              <Button 
                variant="outline"
                className="flex-1"
                onClick={() => setAddingRider(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-black text-white"
                disabled={!newRiderName || !newRiderPhone}
                onClick={handleSubmit}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button 
              variant={selectedRider === 'me' ? 'default' : 'outline'} 
              className="w-full flex items-center justify-between p-4 h-auto text-lg"
              onClick={() => setSelectedRider('me')}
            >
              <div className="flex items-center">
                <User className="h-6 w-6 mr-3" />
                <span>For me</span>
              </div>
              {selectedRider === 'me' && (
                <div className="h-4 w-4 rounded-full bg-white"></div>
              )}
            </Button>
            
            {/* Add saved riders here if there are any */}
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-start p-4 h-auto text-lg"
              onClick={startAddingRider}
            >
              <Plus className="h-6 w-6 mr-3" />
              <span>Add a rider</span>
            </Button>

            <Button 
              className="w-full bg-black hover:bg-gray-800 text-white p-4 h-auto text-lg mt-4"
              onClick={handleSubmit}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderSelectionModal;
