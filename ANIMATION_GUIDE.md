# Staggered Page Transitions - Usage Guide

## Overview
The application now includes smooth staggered page transitions that create a polished, professional user experience. When users navigate between pages, content sections fade in gradually with a pleasant animation effect.

## How It Works
1. **PageTransition Component**: Wraps each route and handles the overall page fade-in
2. **useStaggeredAnimation Hook**: Manages the staggered animation of content sections
3. **CSS Animations**: Provides smooth fade-in and slide-up effects

## Adding Animations to Your Pages

To make content sections animate on page load, simply add the `animate-on-scroll` class to any wrapper div:

```tsx
const YourPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero section - will animate first */}
      <section className="animate-on-scroll bg-primary text-white py-20">
        <h1>Hero Content</h1>
      </section>
      
      {/* Content section - will animate second (150ms delay) */}
      <section className="animate-on-scroll py-16">
        <h2>Main Content</h2>
      </section>
      
      {/* Another section - will animate third (300ms delay) */}
      <section className="animate-on-scroll bg-gray-100 py-16">
        <h2>More Content</h2>
      </section>
      
      {/* Footer - will animate last */}
      <div className="animate-on-scroll">
        <Footer />
      </div>
    </div>
  );
};
```

## Animation Timing
- **Page transition**: 400ms cubic-bezier ease
- **Content stagger delay**: 150ms between each section
- **Content animation**: 800ms cubic-bezier ease

## Accessibility
- Respects `prefers-reduced-motion` setting
- Fallback to simple opacity transition for reduced motion users
- No animations for users who prefer reduced motion

## Examples
Check these pages for implementation examples:
- `src/pages/Index.tsx` - Hero, Stats, Mission, Programs, Stories sections
- `src/pages/About.tsx` - Hero, Mission & Vision, Values, Story sections  
- `src/pages/Programs.tsx` - Hero and content sections
- `src/pages/VolunteerDashboard.tsx` - Header and main content areas

## CSS Classes Available
- `animate-on-scroll` - Main staggered animation class
- `animate-delay-1` through `animate-delay-6` - Manual delay classes
- `stagger-animation` - Direct animation class
- `fade-in-up` - Applied automatically by the system

## Performance Notes
- Uses `will-change` property for optimized animations
- Animations are hardware accelerated when possible
- Cleanup happens automatically on route changes