import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock, Phone } from "lucide-react";

interface Facility {
  id: number;
  name: string;
  type: string;
  lat: number;
  lng: number;
  description: string;
}

interface FacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  facility: Facility | null;
  distance: number;
}

export const FacilityModal = ({ isOpen, onClose, facility, distance }: FacilityModalProps) => {
  if (!facility) return null;

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case "Homeless Shelter":
        return "🏠";
      case "Rehabilitation":
        return "🏥";
      case "Education":
        return "📚";
      default:
        return "📍";
    }
  };

  const getFacilityColor = (type: string) => {
    switch (type) {
      case "Homeless Shelter":
        return "bg-blue-100 text-blue-800";
      case "Rehabilitation":
        return "bg-green-100 text-green-800";
      case "Education":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}`;
    window.open(url, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{getFacilityIcon(facility.type)}</span>
            {facility.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className={getFacilityColor(facility.type)}>
              {facility.type}
            </Badge>
            <span className="text-sm text-gray-500">{distance.toFixed(1)} miles away</span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">{facility.description}</p>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-sm mb-3">Travel Time</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl mb-1">🚗</div>
                <p className="font-semibold text-blue-600">{Math.ceil(distance * 3)} min</p>
                <p className="text-xs text-gray-500">Driving</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border">
                <div className="text-2xl mb-1">🚶</div>
                <p className="font-semibold text-green-600">{Math.ceil(distance * 20)} min</p>
                <p className="text-xs text-gray-500">Walking</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Close
            </Button>
            <Button 
              onClick={openDirections}
              className="flex-1"
            >
              Get Directions
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};