import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useStaggeredAnimation = (dependencies: any[] = []) => {
  const location = useLocation();

  useEffect(() => {
    // Only assign direction classes, let ContentTransition handle all animations
    const assignDirections = () => {
      const elements = document.querySelectorAll('.animate-on-scroll:not(.slide-left):not(.slide-right):not(.auto-direction)');
      elements.forEach((el, index) => {
        const element = el as HTMLElement;
        
        // Skip if already has direction class
        if (element.classList.contains('slide-left') || 
            element.classList.contains('slide-right') || 
            element.classList.contains('hero-element')) {
          return;
        }

        // Auto-assign strict alternating directions
        if (index % 2 === 0) {
          element.classList.add('slide-left');
        } else {
          element.classList.add('slide-right');
        }
      });
    };

    // Small delay to ensure DOM is ready, then just assign directions
    const setupTimer = setTimeout(() => {
      assignDirections();
      console.log('🎬 useStaggeredAnimation: Assigned directions for', location.pathname);
    }, 50);

    return () => clearTimeout(setupTimer);
  }, [location.pathname, ...dependencies]);
};