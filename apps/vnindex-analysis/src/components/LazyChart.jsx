import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// Lazy loading wrapper for charts using Intersection Observer
const LazyChart = ({ 
  children, 
  fallback = null, 
  rootMargin = "100px", // Load 100px before coming into view
  threshold = 0.1 
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef();

  const handleIntersection = useCallback(([entry]) => {
    if (entry.isIntersecting && !hasLoaded) {
      setIsIntersecting(true);
      setHasLoaded(true); // Once loaded, keep it loaded
    }
  }, [hasLoaded]);

  const observerOptions = useMemo(() => ({
    rootMargin,
    threshold
  }), [rootMargin, threshold]);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasLoaded) return; // Don't create observer if already loaded

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    observer.observe(element);

    return () => {
      observer.disconnect(); // Use disconnect instead of unobserve for better cleanup
    };
  }, [handleIntersection, observerOptions, hasLoaded]);

  const defaultFallback = (
    <div className="h-80 overflow-auto border border-gray-200 rounded bg-gray-50 flex items-center justify-center">
      <div className="text-center text-gray-500">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-24 mx-auto"></div>
        </div>
        <p className="text-sm mt-2">Đang tải biểu đồ...</p>
      </div>
    </div>
  );

  return (
    <div ref={ref} className="h-80 overflow-auto border border-gray-200 rounded">
      {hasLoaded ? children : (fallback || defaultFallback)}
    </div>
  );
};

export default LazyChart;