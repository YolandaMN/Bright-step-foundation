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
      <div className="animate-on-scroll">
        <Hero />
      </div>
      <div className="animate-on-scroll">
        <Stats />
      </div>
      <div className="animate-on-scroll">
        <Mission />
      </div>
      <div className="animate-on-scroll">
        <Programs />
      </div>
      <div className="animate-on-scroll">
        <Stories />
      </div>
      <div className="animate-on-scroll">
        <Footer />
      </div>
      <ReportButton />
    </>
  );
};

export default Index;
