import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export const AuthModal = ({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(defaultMode === 'signin');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const { toast } = useToast();
  const { signIn, signUp, forgotPassword } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Sign In Failed",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } else {
        const { error } = await signUp(email, password, name);
        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Account Created",
          description: "Please check your email to verify your account.",
        });
      }
      onClose();
      resetForm();
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordLoading(true);

    try {
      const { error } = await forgotPassword(email);
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password.",
      });
      setForgotPasswordMode(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setLoading(false);
    setForgotPasswordMode(false);
    setForgotPasswordLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {forgotPasswordMode 
              ? "Reset Password" 
              : isLogin ? "Welcome Back" : "Create Account"
            }
          </DialogTitle>
          <DialogDescription className="text-center">
            {forgotPasswordMode 
              ? "Enter your email to receive a password reset link"
              : isLogin 
                ? "Sign in to access volunteer opportunities" 
                : "Join our community to start volunteering"
            }
          </DialogDescription>
        </DialogHeader>

        {forgotPasswordMode ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={forgotPasswordLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={forgotPasswordLoading}
            >
              {forgotPasswordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Reset Email
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                className="p-0 h-auto text-sm font-medium"
                onClick={() => setForgotPasswordMode(false)}
                disabled={forgotPasswordLoading}
              >
                Back to Sign In
              </Button>
            </div>
          </form>
        ) : (
          <>
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                disabled={loading}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        {isLogin && (
          <div className="text-center">
            <Button
              variant="link"
              className="p-0 h-auto text-sm font-medium"
              onClick={() => setForgotPasswordMode(true)}
              disabled={loading}
            >
              Forgot your password?
            </Button>
          </div>
        )}

        <div className="text-center">
          <span className="text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <Button
            variant="link"
            className="p-0 h-auto text-sm font-medium"
            onClick={() => setIsLogin(!isLogin)}
            disabled={loading}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </Button>
        </div>
            </>
        )}
      </DialogContent>
    </Dialog>
  );
};