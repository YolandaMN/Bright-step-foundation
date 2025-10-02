import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Mission from "@/components/Mission";
import Programs from "@/components/Programs";
import Stories from "@/components/Stories";
import ReportButton from "@/components/ReportButton";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <Mission />
      <Programs />
      <Stories />
      <Footer />
      <ReportButton />
    </div>
  );
};

export default Index;
