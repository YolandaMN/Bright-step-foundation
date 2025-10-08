import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Clock, Users, Award, MapPin, Home, BookOpen, Activity } from "lucide-react";
import { MapModal } from "@/components/MapModal";


const VolunteerDashboard = () => {
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedFacilityType, setSelectedFacilityType] = useState<string>("");
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

  const handleCloseModals = () => {
    setMapModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 bg-secondary py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-primary rounded-xl">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {user ? (
                      <>Welcome back, {user.user_metadata?.name || user.email?.split('@')[0] || 'Volunteer'}!</>
                    ) : (
                      <>Volunteer Services Dashboard</>
                    )}
                  </h1>
                  <p className="text-gray-600 text-lg">
                    {user ? 'Access your volunteer opportunities and track your community impact' : 'Professional volunteer coordination platform for community services'}
                  </p>
                </div>
              </div>
              {user && (
                <div className="text-right">
                  <div className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full mb-2">
                    VOLUNTEER PORTAL
                  </div>
                  <p className="text-sm text-gray-600">Active Member</p>
                </div>
              )}
            </div>
            
            {user && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-gray-800">1,247</span>
                    </div>
                    <p className="text-sm text-gray-600">Active Volunteers</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-gray-800">28</span>
                    </div>
                    <p className="text-sm text-gray-600">Service Locations</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-gray-800">5,432</span>
                    </div>
                    <p className="text-sm text-gray-600">Hours This Month</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          

          {/* Main Content */}
          {user ? (
            <div className="animate-on-scroll animate-card animate-delay-1 grid md:grid-cols-3 gap-8">
              
              {/* Homeless Shelter Card */}
              <Card 
                className="cursor-pointer hover:shadow-xl transition-all duration-300 border-l-4 border-l-emerald-600 bg-gradient-to-br from-emerald-50 to-white group"
                onClick={() => handleCardClick("Homeless Shelter")}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                      <Home className="h-8 w-8 text-emerald-700" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                        HOUSING SERVICES
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                    Homeless Shelter Program
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Emergency housing, meals, and essential support services for individuals and families experiencing homelessness
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <div>
                          <p className="font-semibold text-gray-800">Emergency Shelter</p>
                          <p className="text-sm text-gray-600">24/7 safe housing accommodation</p>
                        </div>
                      </div>
                      <span className="text-xs text-emerald-700 font-medium">ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-100">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <div>
                          <p className="font-semibold text-gray-800">Meal Services</p>
                          <p className="text-sm text-gray-600">Daily nutrition programs</p>
                        </div>
                      </div>
                      <span className="text-xs text-emerald-700 font-medium">ACTIVE</span>
                    </div>
                  </div>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3">
                    <MapPin className="h-4 w-4 mr-2" />
                    Find Shelter Facilities
                  </Button>
                </CardContent>
              </Card>

              {/* Rehabilitation Card */}
              <Card 
                className="cursor-pointer hover:shadow-xl transition-all duration-300 border-l-4 bg-gradient-to-br from-slate-50 to-white group"
                style={{ borderLeftColor: '#19647E' }}
                onClick={() => handleCardClick("Rehabilitation")}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 rounded-lg group-hover:opacity-90 transition-colors" style={{ backgroundColor: '#19647E20' }}>
                      <Activity className="h-8 w-8" style={{ color: '#19647E' }} />
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold px-2 py-1 rounded-full" style={{ color: '#19647E', backgroundColor: '#19647E20' }}>
                        HEALTH SERVICES
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                    Rehabilitation Program
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Comprehensive addiction recovery, mental health support, and substance abuse treatment programs
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border" style={{ borderColor: '#19647E20' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#19647E' }}></div>
                        <div>
                          <p className="font-semibold text-gray-800">Addiction Recovery</p>
                          <p className="text-sm text-gray-600">Evidence-based treatment programs</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium" style={{ color: '#19647E' }}>ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border" style={{ borderColor: '#19647E20' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#19647E' }}></div>
                        <div>
                          <p className="font-semibold text-gray-800">Counseling Services</p>
                          <p className="text-sm text-gray-600">Individual & group therapy</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium" style={{ color: '#19647E' }}>ACTIVE</span>
                    </div>
                  </div>
                  <Button className="w-full text-white font-semibold py-3 hover:opacity-90 transition-opacity" style={{ backgroundColor: '#19647E' }}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Find Rehab Centers
                  </Button>
                </CardContent>
              </Card>

              {/* Education Card */}
              <Card 
                className="cursor-pointer hover:shadow-xl transition-all duration-300 border-l-4 bg-gradient-to-br from-slate-50 to-white group"
                style={{ borderLeftColor: '#28AFB0' }}
                onClick={() => handleCardClick("Education")}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 rounded-lg group-hover:opacity-90 transition-colors" style={{ backgroundColor: '#28AFB020' }}>
                      <BookOpen className="h-8 w-8" style={{ color: '#28AFB0' }} />
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold px-2 py-1 rounded-full" style={{ color: '#28AFB0', backgroundColor: '#28AFB020' }}>
                        EDUCATION SERVICES
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                    Education Program
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Adult literacy, job training, skills development, and educational opportunities for community advancement
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border" style={{ borderColor: '#28AFB020' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#28AFB0' }}></div>
                        <div>
                          <p className="font-semibold text-gray-800">Skills Training</p>
                          <p className="text-sm text-gray-600">Professional development programs</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium" style={{ color: '#28AFB0' }}>ACTIVE</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border" style={{ borderColor: '#28AFB020' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#28AFB0' }}></div>
                        <div>
                          <p className="font-semibold text-gray-800">Adult Literacy</p>
                          <p className="text-sm text-gray-600">Reading & writing programs</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium" style={{ color: '#28AFB0' }}>ACTIVE</span>
                    </div>
                  </div>
                  <Button className="w-full text-white font-semibold py-3 hover:opacity-90 transition-opacity" style={{ backgroundColor: '#28AFB0' }}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Find Education Centers
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Non-authenticated content */
            <div className="space-y-8">
              {/* Header Section */}
              <div className="text-center bg-white rounded-2xl p-8">
                <div className="max-w-2xl mx-auto">
                  <Heart className="h-16 w-16 text-primary mx-auto mb-6" />
                  <h2 className="text-3xl font-bold mb-4">Join Our Volunteer Community</h2>
                  <p className="text-gray-600 mb-6 text-lg">
                    Connect with local facilities and make a difference in your community. 
                    Sign in to access our interactive map and discover volunteer opportunities near you.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Sign in using the buttons in the top-right corner to get started
                  </p>
                </div>
              </div>

              {/* Program Overview Cards */}
              <div className="grid md:grid-cols-3 gap-8">
                
                {/* Homeless Shelter Preview Card */}
                <Card className="border-l-4 border-l-emerald-600 bg-gradient-to-br from-emerald-50 to-white opacity-75">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-emerald-100 rounded-lg">
                        <Home className="h-8 w-8 text-emerald-700" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
                          HOUSING SERVICES
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                      Homeless Shelter Program
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Emergency housing, meals, and essential support services for individuals and families experiencing homelessness
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-100">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <div>
                            <p className="font-semibold text-gray-800">Emergency Shelter</p>
                            <p className="text-sm text-gray-600">24/7 safe housing accommodation</p>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-700 font-medium">AVAILABLE</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-100">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <div>
                            <p className="font-semibold text-gray-800">Meal Services</p>
                            <p className="text-sm text-gray-600">Daily nutrition programs</p>
                          </div>
                        </div>
                        <span className="text-xs text-emerald-700 font-medium">AVAILABLE</span>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-100 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">Sign in to access facilities</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Rehabilitation Preview Card */}
                <Card className="border-l-4 bg-gradient-to-br from-slate-50 to-white opacity-75" style={{ borderLeftColor: '#19647E' }}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 rounded-lg" style={{ backgroundColor: '#19647E20' }}>
                        <Activity className="h-8 w-8" style={{ color: '#19647E' }} />
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold px-2 py-1 rounded-full" style={{ color: '#19647E', backgroundColor: '#19647E20' }}>
                          HEALTH SERVICES
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                      Rehabilitation Program
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Comprehensive addiction recovery, mental health support, and substance abuse treatment programs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border" style={{ borderColor: '#19647E20' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#19647E' }}></div>
                          <div>
                            <p className="font-semibold text-gray-800">Addiction Recovery</p>
                            <p className="text-sm text-gray-600">Evidence-based treatment programs</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium" style={{ color: '#19647E' }}>AVAILABLE</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border" style={{ borderColor: '#19647E20' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#19647E' }}></div>
                          <div>
                            <p className="font-semibold text-gray-800">Counseling Services</p>
                            <p className="text-sm text-gray-600">Individual & group therapy</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium" style={{ color: '#19647E' }}>AVAILABLE</span>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-100 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">Sign in to access facilities</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Education Preview Card */}
                <Card className="border-l-4 bg-gradient-to-br from-slate-50 to-white opacity-75" style={{ borderLeftColor: '#28AFB0' }}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 rounded-lg" style={{ backgroundColor: '#28AFB020' }}>
                        <BookOpen className="h-8 w-8" style={{ color: '#28AFB0' }} />
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold px-2 py-1 rounded-full" style={{ color: '#28AFB0', backgroundColor: '#28AFB020' }}>
                          EDUCATION SERVICES
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                      Education Program
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Adult literacy, job training, skills development, and educational opportunities for community advancement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border" style={{ borderColor: '#28AFB020' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#28AFB0' }}></div>
                          <div>
                            <p className="font-semibold text-gray-800">Skills Training</p>
                            <p className="text-sm text-gray-600">Professional development programs</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium" style={{ color: '#28AFB0' }}>AVAILABLE</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border" style={{ borderColor: '#28AFB020' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#28AFB0' }}></div>
                          <div>
                            <p className="font-semibold text-gray-800">Adult Literacy</p>
                            <p className="text-sm text-gray-600">Reading & writing programs</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium" style={{ color: '#28AFB0' }}>AVAILABLE</span>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-100 rounded-lg">
                      <p className="text-sm text-gray-600 font-medium">Sign in to access facilities</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Benefits Section */}
              <div className="bg-white rounded-2xl p-8">
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-2xl font-bold text-center mb-8">Why Volunteer With Us?</h3>
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h4 className="font-semibold mb-3 text-lg">Community Impact</h4>
                      <p className="text-sm text-gray-600">Join thousands of volunteers making a real difference in local communities through direct service</p>
                    </div>
                    <div className="text-center">
                      <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h4 className="font-semibold mb-3 text-lg">Flexible Scheduling</h4>
                      <p className="text-sm text-gray-600">Volunteer opportunities that fit your schedule with various time commitments available</p>
                    </div>
                    <div className="text-center">
                      <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h4 className="font-semibold mb-3 text-lg">Professional Development</h4>
                      <p className="text-sm text-gray-600">Gain valuable experience while contributing to meaningful social programs and services</p>
                    </div>
                  </div>
                </div>
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
      
      {/* Map Modal */}
      <MapModal
        isOpen={mapModalOpen}
        onClose={handleCloseModals}
        facilityType={selectedFacilityType}
      />
    </div>
  );
};

export default VolunteerDashboard;
