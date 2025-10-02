import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-[hsl(var(--charcoal))] to-[hsl(var(--charcoal))] text-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Restoring Hope.<br />
              <span className="text-primary">Rebuilding Futures.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              We provide comprehensive support, rehabilitation, and education to help families break the cycle of poverty and build lasting futures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="group">
                <Link to="/donate">
                  Donate Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-primary/20 backdrop-blur-sm p-8 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-6xl font-bold text-primary">820+</div>
                <div className="text-xl">Families Supported</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
