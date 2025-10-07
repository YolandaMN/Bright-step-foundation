import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Mission from "@/components/Mission";
import Programs from "@/components/Programs";
import Stories from "@/components/Stories";
import ReportButton from "@/components/ReportButton";

const Index = () => {
  return (
    <>
      <div className="animate-on-scroll animate-hero">
        <Hero />
      </div>
      <div className="animate-on-scroll animate-section animate-delay-1">
        <Stats />
      </div>
      <div className="animate-on-scroll animate-text animate-delay-2">
        <Mission />
      </div>
      <div className="animate-on-scroll animate-card animate-delay-3">
        <Programs />
      </div>
      <div className="animate-on-scroll animate-section animate-delay-4">
        <Stories />
      </div>
      <div className="animate-on-scroll animate-text animate-delay-5">
        <Footer />
      </div>
      <ReportButton />
    </>
  );
};

export default Index;
