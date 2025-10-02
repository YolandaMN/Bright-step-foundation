import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const ReportButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        size="lg"
        className="shadow-2xl hover:scale-105 transition-transform rounded-full h-14 px-6"
        asChild
      >
        <Link to="/report" className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span className="font-semibold">Report Now</span>
        </Link>
      </Button>
    </div>
  );
};

export default ReportButton;
