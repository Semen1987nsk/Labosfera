'use client';

interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard = ({ className = '' }: SkeletonCardProps) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-white/5 rounded-lg overflow-hidden">
        {/* Image skeleton */}
        <div className="w-full h-64 bg-white/10" />
        
        {/* Content skeleton */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <div className="h-6 bg-white/10 rounded w-3/4" />
          
          {/* Description lines */}
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded" />
            <div className="h-4 bg-white/10 rounded w-5/6" />
          </div>
          
          {/* Price and button */}
          <div className="flex items-center justify-between pt-4">
            <div className="h-8 bg-white/10 rounded w-24" />
            <div className="h-10 bg-white/10 rounded w-32" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProductGridSkeletonProps {
  count?: number;
}

export const ProductGridSkeleton = ({ count = 8 }: ProductGridSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
