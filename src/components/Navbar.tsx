import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[hsl(var(--charcoal))] text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="font-bold text-lg">BrightStep Foundation</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="hover:text-primary transition-colors">About</Link>
            <Link to="/programs" className="hover:text-primary transition-colors">Programs</Link>
            <Link to="/courses" className="hover:text-primary transition-colors">Courses</Link>
            <Link to="/stories" className="hover:text-primary transition-colors">Stories</Link>
            <Link to="/volunteer" className="hover:text-primary transition-colors">Volunteer</Link>
            <Button variant="default" size="sm" asChild>
              <Link to="/donate">Donate Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link to="/" className="block hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="block hover:text-primary transition-colors">About</Link>
            <Link to="/programs" className="block hover:text-primary transition-colors">Programs</Link>
            <Link to="/courses" className="block hover:text-primary transition-colors">Courses</Link>
            <Link to="/stories" className="block hover:text-primary transition-colors">Stories</Link>
            <Link to="/volunteer" className="block hover:text-primary transition-colors">Volunteer</Link>
            <Button variant="default" size="sm" className="w-full" asChild>
              <Link to="/donate">Donate Now</Link>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
