import React from 'react';
import { motion } from 'framer-motion';

const CategorySkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="h-10 w-48 bg-white/5 rounded-lg animate-pulse"></div>
          <div className="h-4 w-64 bg-white/5 rounded-lg mt-2 animate-pulse"></div>
        </div>
        <div className="h-10 w-32 bg-white/5 rounded-lg animate-pulse"></div>
      </div>

      {/* Search Skeleton */}
      <div className="h-14 bg-white/5 rounded-lg animate-pulse"></div>

      {/* Filters Skeleton */}
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-8 w-20 bg-white/5 rounded-lg animate-pulse"></div>
        ))}
      </div>

      {/* Categories Grid Skeleton */}
      <div className="glass-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
              <div className="w-8 h-8 bg-white/5 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 w-32 bg-white/5 rounded animate-pulse"></div>
                <div className="h-3 w-20 bg-white/5 rounded mt-1 animate-pulse"></div>
              </div>
              <div className="h-5 w-12 bg-white/5 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card p-4 text-center">
            <div className="h-8 w-16 bg-white/5 rounded mx-auto animate-pulse"></div>
            <div className="h-3 w-20 bg-white/5 rounded mx-auto mt-2 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySkeleton;
