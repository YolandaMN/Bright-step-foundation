import Footer from "@/components/Footer";
import { Heart, Users, Target, Award } from "lucide-react";

const About = () => {
  return (
    <>
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .group:hover .group-hover\\:rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
      <div className="flex flex-col bg-gray-50">
        {/* Hero Section */}
        <section className="animate-on-scroll animate-hero bg-gradient-to-r from-teal-600 to-cyan-500 text-white py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About BrightStep Foundation</h1>
            <p className="text-xl opacity-90">
              Dedicated to restoring hope and rebuilding futures for vulnerable children and families since our founding.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="animate-on-scroll animate-card animate-delay-1 py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Mission Card */}
              <div className="group perspective-1000 h-96">
                <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">
                  {/* Front of card */}
                  <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                      <Target className="h-8 w-8 text-teal-600" />
                    </div>
                    <h2 className="text-3xl font-bold">Our Mission</h2>
                  </div>
                  {/* Back of card */}
                  <div className="absolute w-full h-full backface-hidden bg-teal-600 rounded-2xl shadow-lg p-8 flex items-center justify-center rotate-y-180">
                    <p className="text-white leading-relaxed text-center">
                      To provide comprehensive support, shelter, education, and rehabilitation services to homeless children, 
                      children outside the school system, and victims of abuse. We believe every child deserves a safe environment 
                      and the opportunity to reach their full potential.
                    </p>
                  </div>
                </div>
              </div>
              {/* Vision Card */}
              <div className="group perspective-1000 h-96">
                <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">
                  {/* Front of card */}
                  <div className="absolute w-full h-full backface-hidden bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                      <Heart className="h-8 w-8 text-cyan-500" />
                    </div>
                    <h2 className="text-3xl font-bold">Our Vision</h2>
                  </div>
                  {/* Back of card */}
                  <div className="absolute w-full h-full backface-hidden bg-teal-600 rounded-2xl shadow-lg p-8 flex items-center justify-center rotate-y-180">
                    <p className="text-white leading-relaxed text-center">
                      A world where no child is left behind. We envision communities where every child has access to education, 
                      healthcare, and the support needed to break the cycle of poverty and build a brighter future for themselves 
                      and their families.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="animate-on-scroll animate-section animate-delay-2 bg-gray-100 py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">Compassion</h3>
                <p className="text-gray-600">We lead with empathy and understanding</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">Community</h3>
                <p className="text-gray-600">Together we create lasting change</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">Impact</h3>
                <p className="text-gray-600">Measurable results that transform lives</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">Excellence</h3>
                <p className="text-gray-600">Quality in everything we do</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="animate-on-scroll animate-text animate-delay-3 py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold text-center mb-8">Our Story</h2>
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              <p className="text-gray-600 leading-relaxed">
                The BrightStep Foundation was born from a simple but powerful belief: every child deserves a chance 
                to thrive. What started as a small shelter has grown into a comprehensive support system that addresses 
                the multifaceted challenges facing vulnerable children and their families.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we operate an integrated model that combines immediate relief with long-term solutions. Our 
                homeless shelter provides safe accommodation, our rehabilitation center offers therapeutic support, 
                and our education programs equip children with the skills they need for a successful future.
              </p>
              <p className="text-gray-600 leading-relaxed">
                With the support of over 400 volunteers and generous donors, we've been able to serve more than 820 
                families, provide 1,200+ meals, and maintain a 95% rehabilitation success rate. But our work is far 
                from over. Every day, more children need our help, and we're committed to being there for them.
              </p>
            </div>
          </div>
        </section>
        <div className="animate-on-scroll animate-text animate-delay-4">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default About;