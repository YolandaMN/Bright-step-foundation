import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Clock, Users, Award, LogOut, MapPin } from "lucide-react";
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
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [facilityModalOpen, setFacilityModalOpen] = useState(false);
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>("");
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [facilityDistance, setFacilityDistance] = useState<number>(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Fetch or create profile
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;

      if (!profileData) {
        // Create profile if it doesn't exist
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            user_id: session.user.id,
            full_name: session.user.user_metadata?.full_name || "",
            email: session.user.email,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setProfile(newProfile);
      } else {
        setProfile(profileData);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleCardClick = (facilityType: string) => {
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
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {profile?.full_name || user?.email}!
                </h1>
                <p className="text-gray-600">Your volunteer dashboard</p>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          

          {/* Main Content */}
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

          {/* Call to Action */}
          <div className="mt-8 bg-primary text-white rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Make an Even Bigger Impact</h3>
            <p className="mb-6 max-w-2xl mx-auto">
              Invite friends to join our volunteer community and multiply your impact
            </p>
            <Button size="lg" variant="secondary">
              Invite Volunteers
            </Button>
          </div>
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
