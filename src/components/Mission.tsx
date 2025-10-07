import { Heart, Shield, GraduationCap } from "lucide-react";

const Mission = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-[hsl(var(--charcoal))] to-[hsl(var(--charcoal))] text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Our Mission</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              At BrightStep Foundation, we believe every person deserves a chance to rebuild their life with dignity and hope. Our integrated approach combines immediate support with long-term solutions.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-white">Compassionate Care</h3>
                  <p className="text-gray-300">Providing safe shelter and immediate support to those in crisis.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-white">Holistic Rehabilitation</h3>
                  <p className="text-gray-300">Comprehensive therapy and healing programs for lasting recovery.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-white">Education & Empowerment</h3>
                  <p className="text-gray-300">Skills training and education to build sustainable futures.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-primary/20 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center p-8">
                <img src="../src/assets/kids.jpg" alt="happy kids" className=""/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
