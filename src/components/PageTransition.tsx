import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useStaggeredAnimation } from '@/hooks/useStaggeredAnimation';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const PageTransition = ({ children, className = '' }: PageTransitionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  
  // Use the staggered animation hook
  useStaggeredAnimation();

  useEffect(() => {
    // Reset visibility when location changes
    setIsVisible(false);
    
    // Trigger entrance animation after a brief delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div 
      className={`page-transition ${isVisible ? 'page-visible' : 'page-hidden'} ${className}`}
    >
      {children}
    </div>
  );
};

export default PageTransition;