  import { useState, useEffect } from 'react';

  /**
   * Custom hook to detect if the current viewport is mobile-sized
   * @returns {boolean} - true if screen width is less than 768px (mobile breakpoint)
   */
  const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(() => {
      // Initialize with current window width
      if (typeof window !== 'undefined') {
        return window.innerWidth < 768;
      }
      return false;
    });

    useEffect(() => {
      // Handle window resize
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup on unmount
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    return isMobile;
  };

  export default useIsMobile;
