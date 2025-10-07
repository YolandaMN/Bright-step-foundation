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

export const MapModal = ({ isOpen, onClose, facilityType }: MapModalProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(14); // Default to 76% zoom (level 14)
  const { toast } = useToast();

  // Calculate zoom percentage (zoom levels 1-18, converted to 0-100%)
  const getZoomPercentage = (zoom: number) => {
    const minZoom = 1;
    const maxZoom = 18;
    return Math.round(((zoom - minZoom) / (maxZoom - minZoom)) * 100);
  };

  // Convert percentage to zoom level
  const getZoomLevelFromPercentage = (percentage: number) => {
    const minZoom = 1;
    const maxZoom = 18;
    return Math.round(minZoom + (percentage / 100) * (maxZoom - minZoom));
  };

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

      // Initialize map with 76% zoom level (level 14) for optimal view
      const defaultZoomLevel = getZoomLevelFromPercentage(76); // 76% = level 14
      const map = window.L.map(mapRef.current).setView([location.lat, location.lng], defaultZoomLevel);
      mapInstanceRef.current = map;
      setZoomLevel(defaultZoomLevel);

      // Add zoom event listener to update zoom state
      map.on('zoomend', () => {
        setZoomLevel(map.getZoom());
      });

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
        
        // Add professional user location marker
        const userIcon = window.L.divIcon({
          html: `
            <div style="
              position: relative;
              width: 28px;
              height: 28px;
              background: linear-gradient(135deg, #2563eb, #1d4ed8);
              border-radius: 50%;
              border: 4px solid white;
              box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3), 0 0 0 2px rgba(37, 99, 235, 0.1);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 10px;
                height: 10px;
                background: white;
                border-radius: 50%;
                animation: pulse-user 2s infinite;
              "></div>
            </div>
            <style>
              @keyframes pulse-user {
                0% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(1.3); }
                100% { opacity: 1; transform: scale(1); }
              }
            </style>
          `,
          className: 'user-location-marker professional',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const userMarker = window.L.marker([location.lat, location.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup(`
            <div style="
              text-align: center;
              padding: 20px;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #ffffff, #f8fafc);
              border-radius: 16px;
              border: 2px solid #e2e8f0;
              min-width: 240px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            ">
              <div style="
                width: 48px;
                height: 48px;
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                border-radius: 50%;
                margin: 0 auto 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
              ">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <h3 style="
                margin: 0 0 8px 0;
                font-weight: 700;
                color: #0f172a;
                font-size: 18px;
                letter-spacing: -0.025em;
              ">Your Current Location</h3>
              <p style="
                margin: 0;
                font-size: 14px;
                color: #64748b;
                font-weight: 500;
                line-height: 1.4;
              ">Nearby volunteer facilities are displayed relative to this position</p>
            </div>
          `, {
            className: 'professional-popup user-location'
          })
          // Remove .openPopup() to prevent auto-opening

        // Generate facilities near the user's location
        const facilities = generateNearbyFacilities(location, facilityType);
        console.log('Generated facilities:', facilities);
        markersRef.current = [];

        // Calculate distances and find the 2 closest facilities
        const facilitiesWithDistance = facilities.map(facility => ({
          ...facility,
          distance: calculateDistance(location.lat, location.lng, facility.lat, facility.lng)
        }));
        
        // Sort by distance and mark the 2 closest as highlighted
        facilitiesWithDistance.sort((a, b) => a.distance - b.distance);
        const closestFacilityIds = facilitiesWithDistance.slice(0, 2).map(f => f.id);

        const getFacilityConfig = (type: string, isClosest: boolean = false) => {
          const configs = {
            "Homeless Shelter": {
              color: "#059669",
              gradient: isClosest ? "linear-gradient(135deg, #10b981, #059669)" : "linear-gradient(135deg, #059669, #047857)",
              emoji: "🏠",
              lightColor: "#f0fdf4",
              shadowColor: isClosest ? "rgba(16, 185, 129, 0.3)" : "rgba(5, 150, 105, 0.2)",
              category: "Housing Services"
            },
            "Rehabilitation": {
              color: "#7c3aed",
              gradient: isClosest ? "linear-gradient(135deg, #8b5cf6, #7c3aed)" : "linear-gradient(135deg, #7c3aed, #6d28d9)",
              emoji: "�",
              lightColor: "#faf5ff",
              shadowColor: isClosest ? "rgba(139, 92, 246, 0.3)" : "rgba(124, 58, 237, 0.2)",
              category: "Health Services"
            },
            "Education": {
              color: "#dc2626",
              gradient: isClosest ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #dc2626, #b91c1c)",
              emoji: "📚",
              lightColor: "#fef2f2",
              shadowColor: isClosest ? "rgba(239, 68, 68, 0.3)" : "rgba(220, 38, 38, 0.2)",
              category: "Educational Services"
            }
          };
          return configs[type as keyof typeof configs] || {
            color: "#6b7280",
            gradient: "linear-gradient(135deg, #6b7280, #4b5563)",
            emoji: "📍",
            lightColor: "#f9fafb",
            shadowColor: "rgba(107, 114, 128, 0.2)",
            category: "General Services"
          };
        };

        facilitiesWithDistance.forEach((facility, index) => {
          const distance = facility.distance;
          const walkingTime = Math.ceil(distance * 20);
          const drivingTime = Math.ceil(distance * 3);
          const isClosest = closestFacilityIds.includes(facility.id);
          
          const facilityConfig = getFacilityConfig(facility.type, isClosest);
          
          const facilityIcon = window.L.divIcon({
            html: `
              <div style="
                position: relative;
                width: ${isClosest ? '40px' : '36px'};
                height: ${isClosest ? '48px' : '44px'};
                cursor: pointer;
                transition: all 0.2s ease;
              "
              onmouseover="this.style.transform='scale(1.1)';" 
              onmouseout="this.style.transform='scale(1)';">
                
                <!-- Clean Location Pin -->
                <svg style="
                  width: 100%;
                  height: 100%;
                  filter: drop-shadow(0 4px 12px ${facilityConfig.shadowColor});
                " viewBox="0 0 24 30" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
                        fill="${facilityConfig.color}" 
                        stroke="white" 
                        stroke-width="2"/>
                </svg>
                
                <!-- Emoji in Center -->
                <div style="
                  position: absolute;
                  top: ${isClosest ? '8px' : '7px'};
                  left: 50%;
                  transform: translateX(-50%);
                  font-size: ${isClosest ? '16px' : '14px'};
                  line-height: 1;
                ">${facilityConfig.emoji}</div>
                
                ${isClosest ? `
                  <div style="
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    width: 16px;
                    height: 16px;
                    background: #fbbf24;
                    border: 2px solid white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 8px;
                  ">★</div>
                ` : ''}
              </div>
            `,
            className: `facility-marker clean ${isClosest ? 'closest' : ''}`,
            iconSize: [isClosest ? 40 : 36, isClosest ? 48 : 44],
            iconAnchor: [isClosest ? 20 : 18, isClosest ? 44 : 40]
          });

          const marker = window.L.marker([facility.lat, facility.lng], { icon: facilityIcon })
            .addTo(map)
            .bindPopup(`
              <div style="
                min-width: 320px;
                max-width: 360px;
                padding: 0;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                border: 1px solid #e5e7eb;
              ">
                
                <!-- Header -->
                <div style="
                  background: #f8fafc;
                  padding: 20px;
                  border-bottom: 1px solid #e5e7eb;
                ">
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                    <div style="
                      width: 40px;
                      height: 40px;
                      background: ${facilityConfig.color};
                      border-radius: 8px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 20px;
                    ">${facilityConfig.emoji}</div>
                    
                    <div style="flex: 1;">
                      <h3 style="
                        margin: 0 0 4px 0;
                        font-weight: 600;
                        font-size: 18px;
                        color: #111827;
                        line-height: 1.2;
                      ">${facility.name}</h3>
                      ${isClosest ? '<div style="display: inline-block; background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;">CLOSEST</div>' : ''}
                    </div>
                  </div>
                  
                  <div style="
                    background: ${facilityConfig.lightColor};
                    color: ${facilityConfig.color};
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 600;
                    display: inline-block;
                  ">${facility.type}</div>
                </div>
                
                <!-- Content -->
                <div style="padding: 20px;">
                  <p style="
                    margin: 0 0 20px 0;
                    font-size: 14px;
                    color: #6b7280;
                    line-height: 1.5;
                  ">${facility.description}</p>
                  
                  <!-- Distance Info -->
                  <div style="
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                    margin-bottom: 20px;
                    padding: 16px;
                    background: #f9fafb;
                    border-radius: 8px;
                    border: 1px solid #f3f4f6;
                  ">
                    <div style="text-align: center;">
                      <div style="
                        font-size: 20px;
                        font-weight: 700;
                        color: #111827;
                        margin-bottom: 2px;
                      ">${distance.toFixed(1)}</div>
                      <div style="
                        font-size: 11px;
                        color: #6b7280;
                        font-weight: 500;
                        text-transform: uppercase;
                      ">Miles</div>
                    </div>
                    
                    <div style="text-align: center;">
                      <div style="
                        font-size: 20px;
                        font-weight: 700;
                        color: #111827;
                        margin-bottom: 2px;
                      ">${drivingTime}</div>
                      <div style="
                        font-size: 11px;
                        color: #6b7280;
                        font-weight: 500;
                        text-transform: uppercase;
                      ">Min Drive</div>
                    </div>
                    
                    <div style="text-align: center;">
                      <div style="
                        font-size: 20px;
                        font-weight: 700;
                        color: #111827;
                        margin-bottom: 2px;
                      ">${walkingTime}</div>
                      <div style="
                        font-size: 11px;
                        color: #6b7280;
                        font-weight: 500;
                        text-transform: uppercase;
                      ">Min Walk</div>
                    </div>
                  </div>
                  
                  <!-- Action Buttons -->
                  <div style="display: flex; gap: 12px;">
                    <button 
                      onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${facility.lat},${facility.lng}', '_blank')" 
                      style="
                        flex: 1;
                        padding: 12px 16px;
                        background: ${facilityConfig.color};
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                      "
                      onmouseover="this.style.opacity='0.9';"
                      onmouseout="this.style.opacity='1';">
                      Get Directions
                    </button>
                    
                    <button 
                      onclick="alert('Application feature coming soon! Contact facility directly for now.')" 
                      style="
                        flex: 1;
                        padding: 12px 16px;
                        background: #1f2937;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                      "
                      onmouseover="this.style.opacity='0.9';"
                      onmouseout="this.style.opacity='1';">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            `, {
              className: 'clean-facility-popup',
              maxWidth: 380,
              closeButton: true
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
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{facilityType} Facilities</h2>
              <p className="text-slate-300 text-sm font-medium">Interactive location finder</p>
            </div>
          </DialogTitle>
        </div>
        
        <div className="relative p-6">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
              <div className="bg-white rounded-2xl shadow-2xl p-8 flex items-center gap-4">
                <Navigation className="h-6 w-6 animate-spin text-blue-600" />
                <div>
                  <p className="font-semibold text-slate-800">Locating facilities...</p>
                  <p className="text-sm text-slate-500">Getting your current position</p>
                </div>
              </div>
            </div>
          )}
          
          <div 
            ref={mapRef} 
            className="w-full rounded-xl border-2 border-slate-200 shadow-lg overflow-hidden relative"
            style={{ height: '500px' }}
          >
            {/* Zoom Percentage Indicator */}
            <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-slate-700">
                  Zoom: {getZoomPercentage(zoomLevel)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between items-center bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-sm">💡</span>
              </div>
              <p className="text-sm text-slate-600 font-medium">
                Click any facility marker for detailed information and directions
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="bg-white hover:bg-slate-50 border-slate-300 text-slate-700 font-semibold"
            >
              Close Map
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};