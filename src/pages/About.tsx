import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Users, Target, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-accent text-white py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Ridgeview Foundation</h1>
            <p className="text-xl opacity-90">
              Dedicated to restoring hope and rebuilding futures for vulnerable children and families since our founding.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  To provide comprehensive support, shelter, education, and rehabilitation services to homeless children, 
                  children outside the school system, and victims of abuse. We believe every child deserves a safe environment 
                  and the opportunity to reach their full potential.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                <p className="text-gray-600 leading-relaxed">
                  A world where no child is left behind. We envision communities where every child has access to education, 
                  healthcare, and the support needed to break the cycle of poverty and build a brighter future for themselves 
                  and their families.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="bg-secondary py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">Compassion</h3>
                <p className="text-gray-600">We lead with empathy and understanding</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">Community</h3>
                <p className="text-gray-600">Together we create lasting change</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">Impact</h3>
                <p className="text-gray-600">Measurable results that transform lives</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">Excellence</h3>
                <p className="text-gray-600">Quality in everything we do</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-4xl font-bold text-center mb-8">Our Story</h2>
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              <p className="text-gray-600 leading-relaxed">
                The Ridgeview Foundation was born from a simple but powerful belief: every child deserves a chance 
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
      </main>
      <Footer />
    </div>
  );
};

export default About;
