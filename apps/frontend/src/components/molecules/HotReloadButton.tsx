'use client';

import React, { useState } from 'react';

interface HotReloadButtonProps {
  onClick: () => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const HotReloadButton: React.FC<HotReloadButtonProps> = ({
  onClick,
  children,
  className = 'bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-2xl text-xs shadow-md shadow-red-600/20',
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onClick();
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50 ${className}`}
    >
      {isLoading && (
        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      <span>{children}</span>
    </button>
  );
};
