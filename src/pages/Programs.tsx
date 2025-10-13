import Footer from "@/components/Footer";
import { Home, Heart, GraduationCap, Shield, Users, BookOpen } from "lucide-react";
import { useStaggeredAnimation } from "@/hooks/useStaggeredAnimation";

const Programs = () => {
  // Add staggered animation hook
  useStaggeredAnimation();
  
  return (
    <div className="flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="animate-on-scroll hero-element bg-gradient-to-r from-primary to-accent text-white py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Programs</h1>
            <p className="text-xl opacity-90">
              Comprehensive support services designed to restore hope and rebuild futures
            </p>
          </div>
        </section>

        {/* Integrated Longevity Model */}
        <section className="animate-on-scroll slide-left card-element py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Our Integrated Longevity Model</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A holistic approach that addresses immediate needs while building long-term solutions
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Homeless Shelter */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Homeless Shelter</h3>
                <p className="text-gray-600 mb-6">
                  Safe, temporary accommodation providing immediate relief and stability for children and families in crisis.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>24/7 secure housing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Nutritious meals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Basic healthcare</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Case management</span>
                  </li>
                </ul>
              </div>

              {/* Rehabilitation Center */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Rehabilitation Center</h3>
                <p className="text-gray-600 mb-6">
                  Comprehensive therapy and support programs designed to heal trauma and build resilience.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span>Trauma counseling</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span>Family therapy</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span>Life skills training</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-accent mr-2">•</span>
                    <span>Mental health support</span>
                  </li>
                </ul>
              </div>

              {/* Education Center */}
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Education & Training</h3>
                <p className="text-gray-600 mb-6">
                  CAPS-aligned curriculum and vocational programs to equip children with skills for success.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>CAPS curriculum</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Online courses</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Vocational training</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Career counseling</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Programs */}
        <section className="animate-on-scroll slide-right card-element bg-secondary py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-12">Additional Support Services</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Protection Services</h3>
                <p className="text-gray-600">
                  Immediate response to reports of abuse, neglect, or endangerment with 24/7 hotline access.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">Family Reunification</h3>
                <p className="text-gray-600">
                  Support programs to help families overcome challenges and safely reunite with their children.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">Extracurricular Activities</h3>
                <p className="text-gray-600">
                  Sports, arts, mentorship programs, and skills training to foster well-rounded development.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="animate-on-scroll slide-left text-element py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Want to Get Involved?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Your support helps us expand our programs and reach more children in need
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/donate" className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Donate Now
              </a>
              <a href="/volunteer" className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors">
                Become a Volunteer
              </a>
            </div>
          </div>
        </section>
      </main>
      <div className="animate-on-scroll text-element">
        <Footer />
      </div>
    </div>
  );
};

export default Programs;
