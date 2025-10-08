import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Save, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";

interface UserProfile {
  first_name?: string;
  last_name?: string;
  phone?: string;
  gender?: string;
  location?: string;
  about_me?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  newsletter_subscription?: boolean;
  sms_notifications?: boolean;
  event_updates?: boolean;
}

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingUsername, setSavingUsername] = useState(false);
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState<UserProfile>({});

  useEffect(() => {
    if (user) {
      setUsername(user.user_metadata?.name || "");
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Redirect to home page when user signs out
  useEffect(() => {
    if (!loading && !user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // Prepare profile data, ensuring all fields are properly typed
      const profileData = {
        user_id: user.id,
        first_name: profile.first_name || null,
        last_name: profile.last_name || null,
        phone: profile.phone || null,
        gender: profile.gender || null,
        location: profile.location || null,
        about_me: profile.about_me || null,
        emergency_contact_name: profile.emergency_contact_name || null,
        emergency_contact_phone: profile.emergency_contact_phone || null,
        emergency_contact_relationship: profile.emergency_contact_relationship || null,
        newsletter_subscription: profile.newsletter_subscription || false,
        sms_notifications: profile.sms_notifications || false,
        event_updates: profile.event_updates || false,
      };

      // Try upsert first (works if table structure supports it)
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(profileData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        });

      if (upsertError) {
        // If upsert fails, try update/insert approach
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (existingProfile) {
          // Update existing profile
          const { error: updateError } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('user_id', user.id);
          
          if (updateError) throw updateError;
        } else {
          // Insert new profile
          const { error: insertError } = await supabase
            .from('profiles')
            .insert(profileData);
          
          if (insertError) throw insertError;
        }
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully saved.",
      });
    } catch (error: any) {
      console.error('Profile save error:', error);
      
      // Provide more specific error messages
      let errorMessage = "Failed to save profile. Please try again.";
      if (error.message?.includes('column') && error.message?.includes('does not exist')) {
        errorMessage = "Profile features are being updated. Please refresh the page and try again.";
      } else if (error.message?.includes('permission')) {
        errorMessage = "You don't have permission to update this profile.";
      }
      
      toast({
        title: "Save Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUsernameUpdate = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to update your username.",
        variant: "destructive",
      });
      return;
    }

    setSavingUsername(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: username.trim(),
        }
      });

      if (error) throw error;

      toast({
        title: "Username Updated",
        description: "Your display name has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update username.",
        variant: "destructive",
      });
    } finally {
      setSavingUsername(false);
    }
  };

  const updateField = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const getCompletionPercentage = () => {
    const fields = [
      profile.first_name,
      profile.last_name,
      profile.phone,
      profile.location,
      profile.about_me,
      profile.emergency_contact_name
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">Please sign in to view your profile.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Professional Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-white/10">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Profile Management</h1>
                <p className="text-primary-foreground/90 text-sm">Complete your profile to enhance your experience with Bright Step Foundation</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold">{getCompletionPercentage()}%</div>
                <div className="text-xs text-primary-foreground/80">Complete</div>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray={`${getCompletionPercentage()}, 100`}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Single Column Professional Layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Account Settings Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-muted">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Account Settings</h2>
                <p className="text-muted-foreground text-sm">Manage your display name and account preferences</p>
              </div>
            </div>
            
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold text-primary">Display Name</Label>
                      <p className="text-xs text-muted-foreground mb-3">How your name appears to other members</p>
                      <div className="relative">
                        <Input
                          placeholder="Enter your display name"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          maxLength={50}
                          className="pr-16"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          {username.length}/50
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={handleUsernameUpdate}
                      disabled={savingUsername || !username.trim()}
                      className="w-full"
                    >
                      {savingUsername ? "Updating..." : "Update Display Name"}
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold text-primary">Profile Completion</Label>
                      <p className="text-xs text-muted-foreground mb-3">Complete all sections for the best experience</p>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Overall Progress</span>
                          <span className="font-semibold text-primary">{getCompletionPercentage()}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                            style={{ width: `${getCompletionPercentage()}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {getCompletionPercentage() === 100 
                            ? "✓ Profile complete - thank you!" 
                            : `${6 - Math.floor((getCompletionPercentage() / 100) * 6)} more sections to complete`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Personal Information Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-muted">
              <div className="p-2 rounded-lg bg-green-100">
                <User className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Personal Information</h2>
                <p className="text-muted-foreground text-sm">Your basic contact details and personal information</p>
              </div>
            </div>
            
            <Card className="border-2 border-green-200">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">First Name</Label>
                    <Input
                      value={profile.first_name || ""}
                      onChange={(e) => updateField('first_name', e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Last Name</Label>
                    <Input
                      value={profile.last_name || ""}
                      onChange={(e) => updateField('last_name', e.target.value)}
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Gender</Label>
                    <Select value={profile.gender || ""} onValueChange={(value) => updateField('gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Phone Number</Label>
                    <Input
                      type="tel"
                      value={profile.phone || ""}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Location</Label>
                    <Input
                      value={profile.location || ""}
                      onChange={(e) => updateField('location', e.target.value)}
                      placeholder="City, State/Province"
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label className="text-sm font-semibold">Email Address</Label>
                    <Input
                      value={user?.email || ""}
                      disabled
                      className="bg-muted/50 pr-8"
                    />
                    <CheckCircle className="h-4 w-4 text-green-600 absolute right-2 top-8" />
                    <p className="text-xs text-muted-foreground">✓ Verified</p>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <Label className="text-sm font-semibold">About Me</Label>
                  <Textarea
                    value={profile.about_me || ""}
                    onChange={(e) => updateField('about_me', e.target.value)}
                    placeholder="Tell us about yourself, your interests, and what motivates you to be part of Bright Step Foundation..."
                    rows={4}
                    maxLength={500}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {(profile.about_me || "").length}/500 characters
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Emergency Contact & Communication Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-muted">
              <div className="p-2 rounded-lg bg-orange-100">
                <AlertCircle className="h-5 w-5 text-orange-700" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Emergency Contact & Preferences</h2>
                <p className="text-muted-foreground text-sm">Important contact information and communication preferences</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Emergency Contact */}
              <Card className="border-2 border-orange-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Emergency Contact
                  </CardTitle>
                  <CardDescription>Person to contact in case of emergency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Contact Name</Label>
                    <Input
                      value={profile.emergency_contact_name || ""}
                      onChange={(e) => updateField('emergency_contact_name', e.target.value)}
                      placeholder="Full name of emergency contact"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Phone Number</Label>
                    <Input
                      type="tel"
                      value={profile.emergency_contact_phone || ""}
                      onChange={(e) => updateField('emergency_contact_phone', e.target.value)}
                      placeholder="Emergency contact phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Relationship</Label>
                    <Select 
                      value={profile.emergency_contact_relationship || ""} 
                      onValueChange={(value) => updateField('emergency_contact_relationship', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="guardian">Guardian</SelectItem>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="relative">Relative</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Communication Preferences */}
              <Card className="border-2 border-blue-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Communication Preferences</CardTitle>
                  <CardDescription>How you'd like to receive updates from us</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 rounded-lg border bg-blue-50">
                      <Checkbox
                        id="newsletter"
                        checked={profile.newsletter_subscription}
                        onCheckedChange={(checked) => updateField('newsletter_subscription', checked)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="newsletter" className="text-sm font-medium cursor-pointer">
                          Newsletter Subscription
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Receive monthly updates about our programs and impact stories
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg border bg-blue-50">
                      <Checkbox
                        id="sms"
                        checked={profile.sms_notifications}
                        onCheckedChange={(checked) => updateField('sms_notifications', checked)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="sms" className="text-sm font-medium cursor-pointer">
                          SMS Notifications
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Get text messages for urgent updates and event reminders
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg border bg-blue-50">
                      <Checkbox
                        id="events"
                        checked={profile.event_updates}
                        onCheckedChange={(checked) => updateField('event_updates', checked)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="events" className="text-sm font-medium cursor-pointer">
                          Event Updates
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Be notified about upcoming events and volunteer opportunities
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Save Section */}
          <section className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-6 border border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">Save Your Profile</h3>
                <p className="text-sm text-muted-foreground">Make sure to save your changes before leaving this page</p>
              </div>
              <Button
                onClick={handleSave}
                disabled={saving || loading}
                size="lg"
                className="px-8 py-3 font-semibold min-w-[150px]"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}