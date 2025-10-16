import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-[hsl(var(--charcoal))] text-white">
    

      {/* Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">brightstep Foundation</h3>
            <p className="text-gray-300 mb-4">
              Restoring hope and rebuilding futures through integrated support, rehabilitation, and education.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/programs" className="text-gray-300 hover:text-primary transition-colors">Our Programs</Link></li>
              <li><Link to="/courses" className="text-gray-300 hover:text-primary transition-colors">Courses</Link></li>
              <li><Link to="/stories" className="text-gray-300 hover:text-primary transition-colors">Success Stories</Link></li>
              <li><Link to="/volunteer" className="text-gray-300 hover:text-primary transition-colors">Volunteer</Link></li>
              <li><Link to="/report" className="text-gray-300 hover:text-primary transition-colors">Report a Case</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-300 mb-6">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                <span>123 Hope Street, Community Center, City</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>info@Brightstepfoundation.org</span>
              </li>
            </ul>
            
            {/* Social Media Icons */}
            <div>
              <h4 className="text-lg font-semibold mb-3 text-white">Follow Us</h4>
              <div className="flex gap-3">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/20 hover:bg-primary rounded-full flex items-center justify-center transition-colors group"
                >
                  <Facebook className="h-5 w-5 text-gray-300 group-hover:text-white" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/20 hover:bg-primary rounded-full flex items-center justify-center transition-colors group"
                >
                  <Instagram className="h-5 w-5 text-gray-300 group-hover:text-white" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary/20 hover:bg-primary rounded-full flex items-center justify-center transition-colors group"
                >
                  <Twitter className="h-5 w-5 text-gray-300 group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} BrightStep Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
