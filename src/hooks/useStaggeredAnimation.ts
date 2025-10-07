import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useStaggeredAnimation = () => {
  const location = useLocation();

  useEffect(() => {
    // Reset all animations when route changes
    const resetAnimations = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => {
        const element = el as HTMLElement;
        element.classList.remove('fade-in-up');
        element.style.animationDelay = '';
      });
    };

    // Trigger staggered animations
    const triggerAnimations = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el, index) => {
        const element = el as HTMLElement;
        setTimeout(() => {
          element.classList.add('fade-in-up');
        }, index * 150); // 150ms stagger delay
      });
    };

    // Reset first, then trigger after a short delay
    resetAnimations();
    const timer = setTimeout(() => {
      triggerAnimations();
    }, 200); // Wait for page transition to start

    return () => clearTimeout(timer);
  }, [location.pathname]);
};