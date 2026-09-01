'use client';

import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return (
    <div className={`relative overflow-hidden bg-slate-200 dark:bg-slate-800/80 rounded-xl ${className}`}>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent animate-shimmer" />
    </div>
  );
};

export const SkeletonStatGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 md:p-5 space-y-3 shadow-sm"
        >
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <Skeleton className="h-7 w-32 rounded-lg" />
          <div className="flex items-center space-x-2 pt-1 border-t border-slate-100 dark:border-slate-800">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonChart: React.FC<{ height?: string }> = ({ height = 'h-64' }) => {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 ${height} flex flex-col justify-between`}>
      <div className="flex justify-between items-center">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-40 rounded-md" />
          <Skeleton className="h-3 w-24 rounded-md" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-7 w-16 rounded-xl" />
          <Skeleton className="h-7 w-16 rounded-xl" />
        </div>
      </div>

      <div className="flex items-end justify-between space-x-2 h-36 pt-4">
        {[40, 65, 30, 85, 55, 95, 75, 60, 80, 45, 90, 70].map((h, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <div
              style={{ height: `${h}%` }}
              className="w-full bg-slate-200 dark:bg-slate-800 rounded-t-lg relative overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent animate-shimmer" />
            </div>
            <Skeleton className="h-2.5 w-6 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
        <Skeleton className="h-4 w-48 rounded-md" />
        <Skeleton className="h-8 w-32 rounded-xl" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800/60">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-9 w-9 rounded-2xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-36 rounded-md" />
                <Skeleton className="h-2.5 w-24 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-3.5 w-20 rounded-md" />
            <Skeleton className="h-3.5 w-28 rounded-md" />
            <Skeleton className="h-7 w-16 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonPosCatalog: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3.5 space-y-3 shadow-sm"
        >
          <Skeleton className="h-28 w-full rounded-2xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-1/2 rounded-md" />
          </div>
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const WindowLoader: React.FC<{ label?: string }> = ({ label = 'Memuat Modul Enterprise...' }) => {
  return (
    <div className="p-12 flex flex-col items-center justify-center space-y-4 min-h-[400px]">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 animate-spin flex items-center justify-center shadow-lg shadow-red-600/30">
          <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-950 flex items-center justify-center">
            <span className="text-xs">⚡</span>
          </div>
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="font-bold text-xs text-slate-700 dark:text-slate-200 tracking-wide">
          {label}
        </p>
        <p className="text-[10px] text-slate-400 font-mono">
          Sub-millisecond State Hydration • Zero-Knowledge Core
        </p>
      </div>
    </div>
  );
};
