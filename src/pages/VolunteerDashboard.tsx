import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Clock, Users, Award, LogOut } from "lucide-react";

const VolunteerDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Hours</CardDescription>
                <CardTitle className="text-3xl">{profile?.volunteer_hours || 0}</CardTitle>
              </CardHeader>
              <CardContent>
                <Clock className="h-8 w-8 text-primary" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Impact Score</CardDescription>
                <CardTitle className="text-3xl">95%</CardTitle>
              </CardHeader>
              <CardContent>
                <Heart className="h-8 w-8 text-primary" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Lives Touched</CardDescription>
                <CardTitle className="text-3xl">24</CardTitle>
              </CardHeader>
              <CardContent>
                <Users className="h-8 w-8 text-primary" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Achievements</CardDescription>
                <CardTitle className="text-3xl">3</CardTitle>
              </CardHeader>
              <CardContent>
                <Award className="h-8 w-8 text-primary" />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Shifts</CardTitle>
                <CardDescription>Your scheduled volunteer activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-primary pl-4 py-2">
                    <p className="font-semibold">Meal Service</p>
                    <p className="text-sm text-gray-600">Tomorrow, 10:00 AM - 2:00 PM</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4 py-2">
                    <p className="font-semibold">Tutoring Session</p>
                    <p className="text-sm text-gray-600">Friday, 3:00 PM - 5:00 PM</p>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  View All Shifts
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your volunteer history</CardDescription>
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
                  View History
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
    </div>
  );
};

export default VolunteerDashboard;
