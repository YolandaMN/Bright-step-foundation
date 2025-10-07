import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface ContentTransitionProps {
  children: ReactNode;
  className?: string;
}

const ContentTransition = ({ children, className = '' }: ContentTransitionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Reset visibility and scroll position when location changes
    setIsVisible(false);
    window.scrollTo(0, 0);
    
    // Trigger entrance animation after a brief delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    // Enhanced staggered animation for content elements
    if (isVisible) {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el, index) => {
        const element = el as HTMLElement;
        setTimeout(() => {
          element.classList.add('content-fade-in');
        }, index * 100); // Faster stagger - 100ms intervals
      });
    } else {
      // Reset animations when page changes
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => {
        const element = el as HTMLElement;
        element.classList.remove('content-fade-in');
      });
    }
  }, [isVisible]);

  return (
    <main 
      className={`content-transition ${isVisible ? 'content-visible' : 'content-hidden'} ${className}`}
    >
      {children}
    </main>
  );
};

export default ContentTransition;