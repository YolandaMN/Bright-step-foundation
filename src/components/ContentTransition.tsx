import { ReactNode, useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// Extend the Window interface to include our custom function
declare global {
  interface Window {
    resetAllAnimations?: () => void;
  }
}

interface ContentTransitionProps {
  children: ReactNode;
  className?: string;
}

const ContentTransition = ({ children, className = '' }: ContentTransitionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  // Extract animation logic into reusable function
  const triggerAnimations = useCallback(() => {
    if (!isVisible) return;
    
    // First, animate hero elements
    const heroElements = document.querySelectorAll('.animate-on-scroll.hero-element');
    heroElements.forEach((el, index) => {
      const element = el as HTMLElement;
      setTimeout(() => {
        console.log('🎭 ContentTransition: Animating hero', index + 1);
        element.classList.add('content-fade-in');
      }, index * 60);
    });
    
    // Then, animate non-card sections (text elements, etc.)
    const textElements = document.querySelectorAll('.animate-on-scroll.text-element, .animate-on-scroll:not(.hero-element):not(.card-element)');
    textElements.forEach((el, index) => {
      const element = el as HTMLElement;
      setTimeout(() => {
        console.log('🎭 ContentTransition: Animating text element', index + 1);
        element.classList.add('content-fade-in');
      }, 200 + (index * 80)); // Start after heroes
    });
    
    // Finally, animate individual cards with staggered effect
    const cardElements = document.querySelectorAll('.animate-on-scroll.card-element');
    console.log('🎭 ContentTransition: Found', cardElements.length, 'card elements to animate');
    
    cardElements.forEach((el, index) => {
      const element = el as HTMLElement;
      setTimeout(() => {
        console.log('🎭 ContentTransition: Animating card', index + 1);
        element.classList.add('content-fade-in');
      }, 400 + (index * 120)); // Start after text elements, with good stagger
    });
  }, [isVisible]);

  useEffect(() => {
    // Reset visibility and scroll position when location changes
    setIsVisible(false);
    window.scrollTo(0, 0);
    
    // Trigger entrance animation after a brief delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 80); // Reduced from 150ms to 80ms

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Listen for data-loaded events to re-trigger animations
  useEffect(() => {
    const handleDataLoaded = () => {
      console.log('🔄 ContentTransition: Data loaded, re-triggering animations');
      // Small delay to ensure DOM is updated with new data
      setTimeout(() => {
        triggerAnimations();
      }, 100);
    };

    window.addEventListener('pageDataLoaded', handleDataLoaded);
    
    // Add global animation reset function for debugging
    window.resetAllAnimations = () => {
      console.log('🔄 Manual animation reset triggered');
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => {
        const element = el as HTMLElement;
        element.classList.remove('content-fade-in');
      });
      setTimeout(() => {
        triggerAnimations();
      }, 100);
    };
    
    return () => window.removeEventListener('pageDataLoaded', handleDataLoaded);
  }, [isVisible, triggerAnimations]);

  useEffect(() => {
    // Handle ALL animations in the correct order
    if (isVisible) {
      triggerAnimations();
    } else {
      // Reset ALL animations when page changes
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => {
        const element = el as HTMLElement;
        element.classList.remove('content-fade-in');
      });
    }
  }, [isVisible, triggerAnimations]);

  return (
    <main 
      className={`content-transition ${isVisible ? 'content-visible' : 'content-hidden'} ${className}`}
    >
      {children}
    </main>
  );
};

export default ContentTransition;