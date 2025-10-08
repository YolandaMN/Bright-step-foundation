import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, UserCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/brightstep logo white.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user, signOut, loading } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    }
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <nav className="bg-[hsl(var(--charcoal))] text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={logo} 
              alt="BrightStep Foundation Logo" 
              className="w-12 h-12 object-contain"
            />
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
            
            {/* Auth Section */}
            <div className="flex items-center space-x-3">
              <Button variant="default" size="sm" asChild>
                <Link to="/donate">Donate Now</Link>
              </Button>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center space-x-2 hover:bg-white/10 text-white border border-white/20 rounded-md px-3 py-2"
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{user.user_metadata?.name || user.email?.split('@')[0] || 'User'}</span>
                      <span className="sm:hidden">Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 mt-2 bg-white border border-gray-200 shadow-lg rounded-md"
                  >
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.user_metadata?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link 
                        to="/profile"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      >
                        <UserCircle className="mr-3 h-4 w-4" />
                        Go to Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleSignOut} 
                      disabled={loading}
                      className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => openAuthModal('signin')}
                  disabled={loading}
                >
                  Sign In
                </Button>
              )}
            </div>
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
          <div className="md:hidden pb-4 space-y-3 mobile-menu-enter">
            <Link to="/" className="block hover:text-primary transition-colors">Home</Link>
            <Link to="/about" className="block hover:text-primary transition-colors">About</Link>
            <Link to="/programs" className="block hover:text-primary transition-colors">Programs</Link>
            <Link to="/courses" className="block hover:text-primary transition-colors">Courses</Link>
            <Link to="/stories" className="block hover:text-primary transition-colors">Stories</Link>
            <Link to="/volunteer" className="block hover:text-primary transition-colors">Volunteer</Link>
            <Button variant="default" size="sm" className="w-full mb-3" asChild>
              <Link to="/donate">Donate Now</Link>
            </Button>
            
            {/* Mobile Auth Section */}
            {user ? (
              <div className="border-t pt-3 space-y-2">
                <div className="flex items-center space-x-2 px-2 py-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{user.user_metadata?.name || user.email?.split('@')[0] || 'User'}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/profile">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Go to Profile
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={handleSignOut}
                  disabled={loading}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="border-t pt-3 space-y-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full"
                  onClick={() => openAuthModal('signin')}
                  disabled={loading}
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </nav>
  );
};

export default Navbar;
