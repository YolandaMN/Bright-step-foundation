import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import Footer from "@/components/Footer";
import { Loader2, AlertCircle, UserCheck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useStaggeredAnimation } from "@/hooks/useStaggeredAnimation";

const Report = () => {
  // Add staggered animation hook
  useStaggeredAnimation();
  
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState("homeless_child");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [autoFilled, setAutoFilled] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();

  // Auto-fill contact information from user profile
  useEffect(() => {
    if (user && profile && !autoFilled) {
      // Build full name from first_name and last_name if available
      const fullName = [profile.first_name, profile.last_name]
        .filter(Boolean)
        .join(' ') || profile.full_name || '';
      
      if (fullName) setContactName(fullName);
      if (profile.phone) setContactPhone(profile.phone);
      if (user.email) setContactEmail(user.email);
      
      // Show notification if any fields were filled
      if (fullName || profile.phone || user.email) {
        setAutoFilled(true);
        toast({
          title: "Contact info filled",
          description: "Your contact information has been filled from your profile.",
          action: <UserCheck className="h-4 w-4" />,
        });
      }
    }
  }, [user, profile, autoFilled, toast]);

  const clearAutoFill = () => {
    setContactName("");
    setContactPhone("");
    setContactEmail("");
    setAutoFilled(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("reports").insert({
        report_type: reportType,
        child_name: childName,
        child_age: parseInt(childAge),
        location,
        description,
        contact_name: contactName,
        contact_phone: contactPhone,
        contact_email: contactEmail,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Report Submitted",
        description: "Thank you. We will review this report and take appropriate action.",
      });

      navigate("/");
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

  return (
    <div className="flex flex-col">
      <div className="animate-on-scroll hero-element flex-1 bg-secondary py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="animate-on-scroll slide-left card-element bg-green-50 rounded-2xl shadow-lg p-8">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Report a Case</h1>
                <p className="text-gray-600">Help us protect and support children in need</p>
              </div>
            </div>

            <div className="animate-on-scroll slide-right text-element bg-primary/5 border-l-4 border-primary p-4 mb-8 rounded">
              <p className="text-sm text-gray-700">
                <strong>Confidential Reporting:</strong> All reports are treated with the utmost confidentiality. 
                If this is an emergency, please call 10111 immediately.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="animate-on-scroll slide-left card-element space-y-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">Type of Report</Label>
                <RadioGroup value={reportType} onValueChange={setReportType}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="homeless_child" id="homeless" />
                    <Label htmlFor="homeless" className="cursor-pointer flex-1">
                      Homeless Child
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="out_of_school" id="out_of_school" />
                    <Label htmlFor="out_of_school" className="cursor-pointer flex-1">
                      Child Out of School System
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="abuse" id="abuse" />
                    <Label htmlFor="abuse" className="cursor-pointer flex-1">
                      Case of Abuse
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="appointment" id="appointment" />
                    <Label htmlFor="appointment" className="cursor-pointer flex-1">
                      Request Appointment (Rehab/Help Services)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="childName">Child's Name (if known)</Label>
                  <Input
                    id="childName"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label htmlFor="childAge">Approximate Age</Label>
                  <Input
                    id="childAge"
                    type="number"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    placeholder="e.g., 12"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Address or general area"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide as much detail as possible about the situation..."
                  rows={6}
                  required
                />
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Your Contact Information</h3>
                    <p className="text-sm text-gray-600">
                      Optional but helpful for follow-up. Your information will be kept confidential.
                    </p>
                  </div>
                  {autoFilled && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearAutoFill}
                      className="text-xs"
                    >
                      Clear Auto-filled
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contactName">Your Name</Label>
                    <Input
                      id="contactName"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactPhone">Phone Number</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail">Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Report
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Report;
