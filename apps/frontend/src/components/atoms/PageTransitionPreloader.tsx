'use client';

import React, { useEffect, useState } from 'react';

interface PageTransitionPreloaderProps {
  activeModuleKey: string;
}

export const PageTransitionPreloader: React.FC<PageTransitionPreloaderProps> = ({ activeModuleKey }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [activeModuleKey]);

  if (!isTransitioning) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-1 bg-transparent overflow-hidden">
      <div className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 animate-progressBar shadow-sm shadow-red-600/50" />
    </div>
  );
};
