import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Mission from "@/components/Mission";
import Programs from "@/components/Programs";
import Stories from "@/components/Stories";
import ReportButton from "@/components/ReportButton";
import { useStaggeredAnimation } from "@/hooks/useStaggeredAnimation";

const Index = () => {
  // Add staggered animation hook
  useStaggeredAnimation();
  
  return (
    <>
      <div className="animate-on-scroll hero-element">
        <Hero />
      </div>
      <div className="animate-on-scroll slide-left">
        <Stats />
      </div>
      <div className="animate-on-scroll slide-right text-element">
        <Mission />
      </div>
      <div className="animate-on-scroll slide-left card-element">
        <Programs />
      </div>
      <div className="animate-on-scroll slide-right card-element">
        <Stories />
      </div>
      <div className="animate-on-scroll text-element">
        <Footer />
      </div>
      <ReportButton />
    </>
  );
};

export default Index;
