import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Clock, Users, Award, MapPin } from "lucide-react";
import { MapModal } from "@/components/MapModal";
import { FacilityModal } from "@/components/FacilityModal";

interface Facility {
  id: number;
  name: string;
  type: string;
  lat: number;
  lng: number;
  description: string;
}

const VolunteerDashboard = () => {
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [facilityModalOpen, setFacilityModalOpen] = useState(false);
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>("");
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [facilityDistance, setFacilityDistance] = useState<number>(0);
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const handleCardClick = (facilityType: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access volunteer features.",
        variant: "destructive",
      });
      return;
    }
    setSelectedFacilityType(facilityType);
    setMapModalOpen(true);
  };

  const handleFacilityClick = (facility: Facility, distance: number) => {
    setSelectedFacility(facility);
    setFacilityDistance(distance);
    setMapModalOpen(false);
    setFacilityModalOpen(true);
  };

  const handleCloseModals = () => {
    setMapModalOpen(false);
    setFacilityModalOpen(false);
    setSelectedFacility(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-secondary py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="bg-primary rounded-2xl shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {user ? (
                    <>Welcome back, {user.user_metadata?.name || user.email?.split('@')[0] || 'Volunteer'}!</>
                  ) : (
                    <>Welcome to Our Volunteer Dashboard</>
                  )}
                </h1>
                <p className="text-white-600">
                  {user ? 'Your volunteer dashboard' : 'Sign in to access volunteer features'}
                </p>
              </div>
            </div>
          </div>

          

          {/* Main Content */}
          {user ? (
            <div className="grid md:grid-cols-3 gap-8">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleCardClick("Homeless Shelter")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Homeless Shelter Facilities
                    <MapPin className="h-4 w-4 text-primary" />
                  </CardTitle>
                  <CardDescription>Click to find nearby shelter facilities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Meal Service</p>
                        <p className="text-sm text-gray-600">Tomorrow, 10:00 AM - 2:00 PM</p>
                      </div>
                      <p className="text-sm text-gray-500">Upcoming</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Tutoring Session</p>
                        <p className="text-sm text-gray-600">Friday, 3:00 PM - 5:00 PM</p>
                      </div>
                      <p className="text-sm text-gray-500">This week</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    View Facilities on Map
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleCardClick("Rehabilitation")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Rehabilitation Facilities
                  <MapPin className="h-4 w-4 text-primary" />
                </CardTitle>
                <CardDescription>Click to find nearby rehabilitation centers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Monthly Goal</p>
                        <p className="text-sm text-gray-600">Progress towards this month's target</p>
                      </div>
                      <p className="text-sm text-gray-500">20/30</p>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '67%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">Skills Development</p>
                        <p className="text-sm text-gray-600">Badges earned this quarter</p>
                      </div>
                      <p className="text-sm text-gray-500">3/5</p>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }} />
                    </div>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View Facilities on Map
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => handleCardClick("Education")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Education Facilities
                  <MapPin className="h-4 w-4 text-primary" />
                </CardTitle>
                <CardDescription>Click to find nearby education centers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Shelter Support</p>
                      <p className="text-sm text-gray-600">4 hours</p>
                    </div>
                    <p className="text-sm text-gray-500">2 days ago</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">Education Program</p>
                      <p className="text-sm text-gray-600">3 hours</p>
                    </div>
                    <p className="text-sm text-gray-500">5 days ago</p>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View Facilities on Map
                </Button>
              </CardContent>
            </Card>
          </div>
          ) : (
            /* Non-authenticated content */
            <div className="text-center bg-white rounded-2xl p-12">
              <div className="max-w-2xl mx-auto">
                <Heart className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">Join Our Volunteer Community</h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Connect with local facilities and make a difference in your community. 
                  Sign in to access our interactive map and discover volunteer opportunities near you.
                </p>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Community Impact</h3>
                    <p className="text-sm text-gray-600">Join thousands of volunteers making a difference</p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Flexible Schedule</h3>
                    <p className="text-sm text-gray-600">Volunteer when it works for your schedule</p>
                  </div>
                  <div className="text-center">
                    <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Track Progress</h3>
                    <p className="text-sm text-gray-600">Monitor your volunteer hours and impact</p>
                  </div>
                </div>
                <p className="text-gray-500">
                  Sign in using the buttons in the top-right corner to get started
                </p>
              </div>
            </div>
          )}

          {/* Call to Action - Only show for authenticated users */}
          {user && (
            <div className="mt-8 bg-primary text-white rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Make an Even Bigger Impact</h3>
              <p className="mb-6 max-w-2xl mx-auto">
                Invite friends to join our volunteer community and multiply your impact
              </p>
              <Button size="lg" variant="secondary">
                Invite Volunteers
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
      
      {/* Modals */}
      <MapModal
        isOpen={mapModalOpen}
        onClose={handleCloseModals}
        facilityType={selectedFacilityType}
        onFacilityClick={handleFacilityClick}
      />
      
      <FacilityModal
        isOpen={facilityModalOpen}
        onClose={handleCloseModals}
        facility={selectedFacility}
        distance={facilityDistance}
      />
    </div>
  );
};

export default VolunteerDashboard;
