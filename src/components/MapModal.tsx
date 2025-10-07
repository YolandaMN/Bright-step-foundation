import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Navigation } from "lucide-react";

declare global {
  interface Window {
    L: any;
  }
}

interface Facility {
  id: number;
  name: string;
  type: string;
  lat: number;
  lng: number;
  description: string;
}

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilityType: string;
  onFacilityClick: (facility: Facility, distance: number) => void;
}

// Sample facility data - in a real app, this would come from an API
const facilitiesData: Record<string, Facility[]> = {
  "Homeless Shelter": [
    { id: 1, name: "Downtown Emergency Shelter", type: "Homeless Shelter", lat: 40.7589, lng: -73.9851, description: "24/7 emergency housing and meals" },
    { id: 2, name: "Family Housing Center", type: "Homeless Shelter", lat: 40.7505, lng: -73.9934, description: "Family-focused shelter with childcare" },
    { id: 3, name: "Veterans Support Shelter", type: "Homeless Shelter", lat: 40.7614, lng: -73.9776, description: "Specialized support for veterans" },
    { id: 4, name: "Women's Safe Haven", type: "Homeless Shelter", lat: 40.7549, lng: -73.9840, description: "Safe housing for women and children" },
    { id: 5, name: "Youth Transitional Home", type: "Homeless Shelter", lat: 40.7580, lng: -73.9855, description: "Support for homeless youth 18-24" }
  ],
  "Rehabilitation": [
    { id: 6, name: "Hope Recovery Center", type: "Rehabilitation", lat: 40.7505, lng: -73.9888, description: "Substance abuse treatment and counseling" },
    { id: 7, name: "New Life Rehabilitation", type: "Rehabilitation", lat: 40.7620, lng: -73.9790, description: "Comprehensive addiction recovery programs" },
    { id: 8, name: "Phoenix Rising Center", type: "Rehabilitation", lat: 40.7565, lng: -73.9825, description: "Mental health and addiction services" },
    { id: 9, name: "Pathway Recovery Hub", type: "Rehabilitation", lat: 40.7542, lng: -73.9912, description: "Outpatient and residential treatment" },
    { id: 10, name: "Sunrise Treatment Facility", type: "Rehabilitation", lat: 40.7598, lng: -73.9845, description: "Holistic approach to recovery" }
  ],
  "Education": [
    { id: 11, name: "Community Learning Center", type: "Education", lat: 40.7580, lng: -73.9820, description: "Adult education and job training" },
    { id: 12, name: "Skills Development Institute", type: "Education", lat: 40.7532, lng: -73.9895, description: "Vocational training and certifications" },
    { id: 13, name: "Literacy & Life Skills Hub", type: "Education", lat: 40.7605, lng: -73.9865, description: "Basic education and life skills training" },
    { id: 14, name: "Tech Training Academy", type: "Education", lat: 40.7558, lng: -73.9880, description: "Computer and technology skills" },
    { id: 15, name: "Career Advancement Center", type: "Education", lat: 40.7575, lng: -73.9805, description: "Professional development and career coaching" }
  ]
};

export const MapModal = ({ isOpen, onClose, facilityType, onFacilityClick }: MapModalProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Generate facilities near the user's actual location
  const generateNearbyFacilities = (userLocation: { lat: number; lng: number }, facilityType: string): Facility[] => {
    const facilities: Facility[] = [];
    const baseNames = {
      "Homeless Shelter": ["Emergency Shelter", "Family Housing Center", "Safe Haven", "Community Shelter", "Transitional Housing"],
      "Rehabilitation": ["Recovery Center", "Treatment Facility", "Wellness Center", "Support Center", "Healing Hub"],
      "Education": ["Learning Center", "Skills Academy", "Training Institute", "Education Hub", "Development Center"]
    };
    
    const descriptions = {
      "Homeless Shelter": ["24/7 emergency housing", "Family-focused shelter", "Safe housing for all", "Temporary accommodation", "Supportive housing"],
      "Rehabilitation": ["Comprehensive treatment", "Recovery programs", "Mental health support", "Addiction services", "Holistic healing"],
      "Education": ["Job training programs", "Adult education", "Skill development", "Career coaching", "Life skills training"]
    };

    const names = baseNames[facilityType as keyof typeof baseNames] || [];
    const descs = descriptions[facilityType as keyof typeof descriptions] || [];

    for (let i = 0; i < 5; i++) {
      // Generate coordinates within ~2 miles of user location
      const latOffset = (Math.random() - 0.5) * 0.04; // ~2 miles in latitude
      const lngOffset = (Math.random() - 0.5) * 0.04; // ~2 miles in longitude
      
      facilities.push({
        id: i + 1,
        name: names[i] || `${facilityType} ${i + 1}`,
        type: facilityType,
        lat: userLocation.lat + latOffset,
        lng: userLocation.lng + lngOffset,
        description: descs[i] || `Professional ${facilityType.toLowerCase()} services`
      });
    }
    
    return facilities;
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getUserLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error("Unable to retrieve your location"));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  };

  const initializeMap = async () => {
    if (!mapRef.current || !window.L) {
      console.log('Leaflet not loaded yet');
      return;
    }

    setIsLoading(true);

    try {
      // Get user's current location
      const location = await getUserLocation();
      setUserLocation(location);
      console.log('User location:', location);

      // Initialize map with high zoom level for detailed street view
      const map = window.L.map(mapRef.current).setView([location.lat, location.lng], 15);
      mapInstanceRef.current = map;

      // Add MapTiler tile layer
      window.L.tileLayer('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=e9kHfvSJ1xETNEKD8n5W', {
        attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Add zoom controls
      map.zoomControl.setPosition('topright');

      // Wait for map to be ready
      map.whenReady(() => {
        console.log('Map is ready');
        
        // Add user location marker
        const userIcon = window.L.divIcon({
          html: '<div style="background: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);"></div>',
          className: 'user-location-marker',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        const userMarker = window.L.marker([location.lat, location.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center; padding: 8px;">
              <h3 style="margin: 0 0 4px 0; font-weight: 600; color: #3b82f6;">Your Location</h3>
              <p style="margin: 0; font-size: 12px; color: #666;">Current position</p>
            </div>
          `)
          .openPopup();

        // Generate facilities near the user's location
        const facilities = generateNearbyFacilities(location, facilityType);
        console.log('Generated facilities:', facilities);
        markersRef.current = [];

        const getFacilityColor = (type: string) => {
          const colors = {
            "Homeless Shelter": "#3b82f6",
            "Rehabilitation": "#10b981",
            "Education": "#8b5cf6"
          };
          return colors[type as keyof typeof colors] || "#ef4444";
        };

        facilities.forEach((facility, index) => {
          const distance = calculateDistance(location.lat, location.lng, facility.lat, facility.lng);
          const walkingTime = Math.ceil(distance * 20);
          const drivingTime = Math.ceil(distance * 3);
          
          const facilityColor = getFacilityColor(facility.type);
          
          const facilityIcon = window.L.divIcon({
            html: `
              <div style="
                background: ${facilityColor};
                width: 20px; height: 20px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                cursor: pointer;
              "></div>
            `,
            className: 'facility-marker',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });

          const marker = window.L.marker([facility.lat, facility.lng], { icon: facilityIcon })
            .addTo(map)
            .bindPopup(`
              <div style="min-width: 250px; padding: 16px; font-family: system-ui;">
                <h3 style="margin: 0 0 8px 0; font-weight: 600; font-size: 16px; color: #1f2937;">${facility.name}</h3>
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280; line-height: 1.4;">${facility.description}</p>
                
                <div style="display: flex; gap: 16px; margin-bottom: 16px; padding: 12px; background: #f9fafb; border-radius: 8px;">
                  <div style="text-align: center;">
                    <div style="font-size: 14px; font-weight: 600; color: #1f2937;">${distance.toFixed(1)} mi</div>
                    <div style="font-size: 12px; color: #6b7280;">Distance</div>
                  </div>
                  <div style="text-align: center;">
                    <div style="font-size: 14px; font-weight: 600; color: #1f2937;">${drivingTime} min</div>
                    <div style="font-size: 12px; color: #6b7280;">Driving</div>
                  </div>
                  <div style="text-align: center;">
                    <div style="font-size: 14px; font-weight: 600; color: #1f2937;">${walkingTime} min</div>
                    <div style="font-size: 12px; color: #6b7280;">Walking</div>
                  </div>
                </div>
                
                <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}', '_blank')" 
                        style="width: 100%; padding: 10px; background: ${facilityColor}; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
                  Get Directions
                </button>
              </div>
            `)
            .on('click', () => {
              onFacilityClick(facility, distance);
            });

          markersRef.current.push(marker);
        });
      });

    } catch (error: any) {
      console.error('Map initialization error:', error);
      toast({
        title: "Location Error",
        description: error.message || "Could not get your location. Please enable location services.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Wait for Leaflet to be available and modal to be rendered
      const checkLeafletAndInit = () => {
        if (window.L && mapRef.current) {
          console.log('Leaflet available, initializing map');
          initializeMap();
        } else {
          console.log('Waiting for Leaflet...');
          setTimeout(checkLeafletAndInit, 100);
        }
      };
      
      // Small delay to ensure modal DOM is ready
      setTimeout(checkLeafletAndInit, 200);
    }

    return () => {
      if (mapInstanceRef.current) {
        console.log('Cleaning up map');
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
    };
  }, [isOpen, facilityType]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {facilityType} Facilities Near You
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
              <div className="flex items-center gap-2">
                <Navigation className="h-5 w-5 animate-spin" />
                <span>Getting your location...</span>
              </div>
            </div>
          )}
          
          <div 
            ref={mapRef} 
            className="w-full h-96 rounded-lg border"
            style={{ minHeight: '400px' }}
          />
          
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Click any marker to see facility details and get directions
            </p>
            <Button variant="outline" onClick={onClose}>
              Close Map
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};