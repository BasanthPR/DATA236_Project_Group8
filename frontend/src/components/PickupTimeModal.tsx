
import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, AlertTriangle, CreditCard } from 'lucide-react';
import { Button } from "@/components/ui/button";

type PickupTimeModalProps = {
  onClose: () => void;
  onSelect: (time: string, date: string) => void;
};

const PickupTimeModal = ({ onClose, onSelect }: PickupTimeModalProps) => {
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('Now');

  const handleSubmit = () => {
    onSelect(time, date);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="p-4 max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={onClose} className="p-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Button variant="ghost" onClick={onClose} className="text-lg">
            Clear
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-6">
          When do you want to be picked up?
        </h1>

        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-between p-4 h-auto text-lg"
            onClick={() => setDate('Today')}
          >
            <div className="flex items-center">
              <Calendar className="h-6 w-6 mr-3" />
              <span>Today</span>
            </div>
            <ArrowLeft className="h-6 w-6 -rotate-90" />
          </Button>

          <Button 
            variant="outline" 
            className="w-full flex items-center justify-between p-4 h-auto text-lg"
            onClick={() => setTime('Now')}
          >
            <div className="flex items-center">
              <Clock className="h-6 w-6 mr-3" />
              <span>Now</span>
            </div>
            <ArrowLeft className="h-6 w-6 -rotate-90" />
          </Button>

          <div className="flex items-center gap-4 p-2">
            <Calendar className="h-6 w-6 text-gray-500" />
            <p className="text-gray-700">
              Choose your pickup time up to 90 days in advance
            </p>
          </div>

          <div className="flex items-center gap-4 p-2">
            <AlertTriangle className="h-6 w-6 text-gray-500" />
            <p className="text-gray-700">
              Extra wait time included to meet your ride
            </p>
          </div>

          <div className="flex items-center gap-4 p-2">
            <CreditCard className="h-6 w-6 text-gray-500" />
            <p className="text-gray-700">
              Cancel at no charge up to 60 minutes in advance
            </p>
          </div>

          <div className="py-2">
            <Button 
              variant="link" 
              className="text-black hover:text-gray-700 underline text-base p-0"
            >
              See terms
            </Button>
          </div>

          <Button 
            className="w-full bg-black hover:bg-gray-800 text-white p-4 h-auto text-lg mt-4"
            onClick={handleSubmit}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PickupTimeModal;
