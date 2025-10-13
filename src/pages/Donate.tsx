import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import { Heart, Users, Home, GraduationCap } from "lucide-react";
import { useStaggeredAnimation } from "@/hooks/useStaggeredAnimation";

const donationAmounts = [25, 50, 100, 250, 500];

const impactAreas = [
  {
    icon: Home,
    title: "Shelter Support",
    description: "Provide safe housing and meals",
  },
  {
    icon: Heart,
    title: "Rehabilitation",
    description: "Fund therapy and healing programs",
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Support training and courses",
  },
  {
    icon: Users,
    title: "General Fund",
    description: "Where most needed",
  },
];

const Donate = () => {
  // Add staggered animation hook
  useStaggeredAnimation();
  
  const [amount, setAmount] = useState("100");
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState("once");
  const [impactArea, setImpactArea] = useState("general");
  const { toast } = useToast();

  const handleDonate = () => {
    const finalAmount = amount === "custom" ? customAmount : amount;
    toast({
      title: "Thank you for your generosity!",
      description: `Your ${frequency === 'once' ? 'one-time' : 'monthly'} donation of $${finalAmount} will make a real difference.`,
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex-1 bg-secondary">
        {/* Hero */}
        <div className="animate-on-scroll hero-element bg-primary text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Make a Difference Today
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              Your donation helps us provide hope, healing, and recovery to individuals and families affected by addiction. Every contribution supports therapy, housing, and skills training for those rebuilding their lives
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Donation Form */}
            <div className="lg:col-span-2">
              <Card className="animate-on-scroll slide-left card-element">
                <CardHeader>
                  <CardTitle className="text-2xl">Choose Your Donation</CardTitle>
                  <CardDescription>Every contribution counts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Frequency */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Donation Frequency</Label>
                    <RadioGroup value={frequency} onValueChange={setFrequency} className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="once" id="once" />
                        <Label htmlFor="once" className="cursor-pointer flex-1">One-time</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly" className="cursor-pointer flex-1">Monthly</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Amount */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Donation Amount</Label>
                    <RadioGroup value={amount} onValueChange={setAmount} className="grid grid-cols-3 gap-4">
                      {donationAmounts.map((amt) => (
                        <div key={amt} className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value={amt.toString()} id={`amt-${amt}`} />
                          <Label htmlFor={`amt-${amt}`} className="cursor-pointer flex-1 text-center font-semibold">
                            R{amt}
                          </Label>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="custom" id="custom" />
                        <Label htmlFor="custom" className="cursor-pointer flex-1 text-center">Custom</Label>
                      </div>
                    </RadioGroup>
                    {amount === "custom" && (
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="mt-4"
                        min="1"
                      />
                    )}
                  </div>

                  {/* Impact Area */}
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Support Area</Label>
                    <RadioGroup value={impactArea} onValueChange={setImpactArea} className="grid md:grid-cols-2 gap-4">
                      {impactAreas.map((area) => (
                        <div key={area.title} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value={area.title.toLowerCase().replace(' ', '_')} id={area.title} className="mt-1" />
                          <Label htmlFor={area.title} className="cursor-pointer flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <area.icon className="h-5 w-5 text-primary" />
                              <span className="font-semibold">{area.title}</span>
                            </div>
                            <p className="text-sm text-gray-600">{area.description}</p>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <Button size="lg" className="w-full" onClick={handleDonate}>
                    <Heart className="mr-2 h-5 w-5" />
                    Complete Donation
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Impact Summary */}
            <div className="space-y-6">
              <Card className="animate-on-scroll slide-right card-element bg-primary text-white">
                <CardHeader>
                  <CardTitle>Your Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">
                    R{amount === "custom" ? customAmount || "0" : amount}
                  </div>
                  <p className="text-sm opacity-90">
                    {frequency === "once" ? "One-time donation" : "Monthly donation"}
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-on-scroll slide-right card-element">
                <CardHeader>
                  <CardTitle>What Your Gift Provides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p><strong>R25</strong> provides meals for a family for one day</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p><strong>R100</strong> covers one week of shelter support</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p><strong>R250</strong> funds a month of counseling sessions</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <p><strong>R500</strong> sponsors a complete vocational training course</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 text-center">
                    Your donation is tax-deductible. BrightStep Foundation is a registered 501(c)(3) nonprofit organization.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Donate;
