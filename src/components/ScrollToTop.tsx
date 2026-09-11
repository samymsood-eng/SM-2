import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopProps {
  language: string;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({ language }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when page is scrolled down more than 280px
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) {
    return null;
  }

  const tooltipText = language === 'ar' ? 'العودة للأعلى' : 'Back to top';

  return (
    <button
      type="button"
      id="scroll-to-top-button"
      onClick={scrollToTop}
      aria-label={tooltipText}
      title={tooltipText}
      className="fixed bottom-6 end-6 z-40 p-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-xl shadow-amber-900/20 hover:shadow-2xl hover:scale-110 active:scale-95 border border-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-all duration-300 flex items-center justify-center group"
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
      <span className="sr-only">{tooltipText}</span>
    </button>
  );
};
