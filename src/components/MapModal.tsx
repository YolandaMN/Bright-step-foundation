import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Navigation, Home, Activity, BookOpen, Car, PersonStanding, Clock } from "lucide-react";

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

  // Get professional SVG icon based on facility type
  const getSVGIcon = (type: string, color: string = "#374151", size: number = 20) => {
    const icons: Record<string, string> = {
      "Homeless Shelter": `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="${color}"/></svg>`,
      "Rehabilitation": `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="${color}"/></svg>`,
      "Education": `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" fill="${color}"/></svg>`,
      "MapPin": `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="${color}"/><circle cx="12" cy="10" r="3" fill="white"/></svg>`,
      "Car": `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" fill="${color}"/></svg>`,
      "PersonStanding": `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="4" r="2" fill="${color}"/><path d="M15.89 8.11C15.5 7.72 14.83 7 13.53 7h-2.54C8.24 6.99 6 4.75 6 2H4c0 3.16 2.11 5.84 5 6.71V22h2v-6h2v6h2V10.05L18.95 14l1.41-1.41L15.89 8.11z" fill="${color}"/></svg>`,
      "Walking": `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="4" r="2" fill="${color}"/><path d="M15.89 8.11C15.5 7.72 14.83 7 13.53 7h-2.54C8.24 6.99 6 4.75 6 2H4c0 3.16 2.11 5.84 5 6.71V22h2v-6h2v6h2V10.05L18.95 14l1.41-1.41L15.89 8.11z" fill="${color}"/></svg>`,
      "Distance": `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="${color}" stroke-width="2" fill="none"/><circle cx="12" cy="10" r="3" fill="${color}"/><path d="M7 20h10" stroke="${color}" stroke-width="2"/><path d="M7 22h10" stroke="${color}" stroke-width="1"/></svg>`,
      "Clock": `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/><polyline points="12,6 12,12 16,14" stroke="${color}" stroke-width="2"/></svg>`,
      "General": `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2" fill="none"/><path d="M12 8v8M8 12h8" stroke="${color}" stroke-width="2"/></svg>`
    };
    return icons[type] || icons["MapPin"];
  };

  // Volunteer positions by facility type
  type VolunteerRole = { title: string; time: string; type: string; openings: number };
  const getVolunteerPositions = (facilityType: string): VolunteerRole[] => {
    const common: VolunteerRole[] = [
      { title: "Administrative Assistant", time: "4 hrs/week", type: "On-site", openings: 2 },
      { title: "Outreach Support", time: "Flexible", type: "Hybrid", openings: 3 },
    ];
    const byType: Record<string, VolunteerRole[]> = {
      "Homeless Shelter": [
        { title: "Meal Service Assistant", time: "Weekends", type: "On-site", openings: 4 },
        { title: "Intake Support", time: "Evenings", type: "On-site", openings: 2 },
        { title: "Clothing Drive Coordinator", time: "Project-based", type: "Hybrid", openings: 1 },
        { title: "Shelter Attendant", time: "Night shift", type: "On-site", openings: 2 },
      ],
      "Rehabilitation": [
        { title: "Peer Support Assistant", time: "Weekdays", type: "On-site", openings: 3 },
        { title: "Wellness Workshop Facilitator", time: "Monthly", type: "On-site", openings: 1 },
        { title: "Transport Support", time: "Mornings", type: "On-site", openings: 2 },
        { title: "Records Assistant", time: "Part-time", type: "On-site", openings: 1 },
      ],
      "Education": [
        { title: "Adult Literacy Tutor", time: "2 hrs/week", type: "On-site", openings: 3 },
        { title: "Computer Lab Support", time: "Afternoons", type: "On-site", openings: 2 },
        { title: "Program Assistant", time: "Weekdays", type: "On-site", openings: 2 },
        { title: "Career Coaching Mentor", time: "Bi-weekly", type: "Hybrid", openings: 1 },
      ],
    };
    return byType[facilityType] ? [...byType[facilityType]] : [...common];
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
              icon: "Homeless Shelter",
              lightColor: "#f0fdf4",
              shadowColor: isClosest ? "rgba(16, 185, 129, 0.3)" : "rgba(5, 150, 105, 0.2)",
              category: "Housing Services"
            },
            "Rehabilitation": {
              color: "#19647E",
              gradient: isClosest ? "linear-gradient(135deg, #19647E, #164556)" : "linear-gradient(135deg, #19647E, #123248)",
              icon: "Rehabilitation",
              lightColor: "#f0f9ff",
              shadowColor: isClosest ? "rgba(25, 100, 126, 0.3)" : "rgba(25, 100, 126, 0.2)",
              category: "Health Services"
            },
            "Education": {
              color: "#28AFB0",
              gradient: isClosest ? "linear-gradient(135deg, #28AFB0, #219899)" : "linear-gradient(135deg, #28AFB0, #1a7172)",
              icon: "Education",
              lightColor: "#f0fdfa",
              shadowColor: isClosest ? "rgba(40, 175, 176, 0.3)" : "rgba(40, 175, 176, 0.2)",
              category: "Educational Services"
            }
          };
          return configs[type as keyof typeof configs] || {
            color: "#6b7280",
            gradient: "linear-gradient(135deg, #6b7280, #4b5563)",
            icon: "General",
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
                ">${getSVGIcon(facilityConfig.icon)}</div>
                
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
                    ">${getSVGIcon(facilityConfig.icon)}</div>
                    
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
                      <div style="margin-bottom: 8px;">${getSVGIcon('Distance')}</div>
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
                      <div style="margin-bottom: 8px;">${getSVGIcon('Car')}</div>
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
                      <div style="margin-bottom: 8px;">${getSVGIcon('Walking')}</div>
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
                  
                  <!-- Available Volunteer Positions -->
                  <div style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                      <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: #0f172a; letter-spacing: 0.2px;">Available Volunteer Positions</h4>
                      <span style="background: #e5f3ff; color: #075985; border: 1px solid #bfdbfe; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 700;">Official</span>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                      ${getVolunteerPositions(facility.type).slice(0,3).map(r => `
                        <div style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; background: #ffffff;">
                          <div style="width: 28px; height: 28px; background: #f1f5f9; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
                            ${getSVGIcon('Clock', '#334155', 16)}
                          </div>
                          <div style="flex: 1;">
                            <div style="font-size: 13px; font-weight: 700; color: #111827; line-height: 1.2;">${r.title}</div>
                            <div style="display: flex; gap: 10px; margin-top: 3px;">
                              <span style="font-size: 11px; color: #475569; background: #f8fafc; border: 1px solid #e2e8f0; padding: 2px 6px; border-radius: 6px;">${r.time}</span>
                              <span style="font-size: 11px; color: #075985; background: #e0f2fe; border: 1px solid #bae6fd; padding: 2px 6px; border-radius: 6px;">${r.type}</span>
                            </div>
                          </div>
                          <div style="font-size: 11px; color: #065f46; background: #ecfdf5; border: 1px solid #a7f3d0; padding: 4px 6px; border-radius: 6px; font-weight: 700; white-space: nowrap;">${r.openings} open</div>
                        </div>
                      `).join('')}
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

          // Add popup event listeners for positioning and map control
          marker.on('popupopen', function(e) {
            const mapContainer = map.getContainer();
            if (mapContainer) {
              mapContainer.classList.add('popup-open');
              
              // Disable all map interactions
              map.dragging.disable();
              map.touchZoom.disable();
              map.doubleClickZoom.disable();
              map.scrollWheelZoom.disable();
              map.boxZoom.disable();
              map.keyboard.disable();
              if (map.tap) map.tap.disable();
              
              // Position popup at center of map viewport
              setTimeout(() => {
                const popup = e.popup.getElement();
                const mapContainer = map.getContainer();
                if (popup && mapContainer) {
                  // Get map container dimensions
                  const mapRect = mapContainer.getBoundingClientRect();
                  const centerX = mapRect.width / 2;
                  const centerY = mapRect.height / 2;
                  
                  // Position popup at center of map viewport
                  popup.style.position = 'absolute';
                  popup.style.left = `${centerX}px`;
                  popup.style.top = `${centerY}px`;
                  popup.style.transform = 'translate(-50%, -50%)';
                  popup.style.zIndex = '1000';
                  popup.classList.add('user-location-popup');
                  
                  // Hide the popup tip arrow
                  const tip = popup.querySelector('.leaflet-popup-tip');
                  if (tip) tip.style.display = 'none';
                }
              }, 10);
            }
          });

          marker.on('popupclose', function(e) {
            const mapContainer = map.getContainer();
            if (mapContainer) {
              mapContainer.classList.remove('popup-open');
            }
            
            // Re-enable all map interactions
            map.dragging.enable();
            map.touchZoom.enable();
            map.doubleClickZoom.enable();
            map.scrollWheelZoom.enable();
            map.boxZoom.enable();
            map.keyboard.enable();
            if (map.tap) map.tap.enable();
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