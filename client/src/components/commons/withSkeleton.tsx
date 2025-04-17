import React from "react";
import { SkeletonCard } from "./Skeleton";

interface WithSkeletonProps {
  isLoading: boolean;
  count?: number;
}

export const withSkeleton = (WrappedComponent: React.ComponentType) => {
  return ({ isLoading, count = 8, ...props }: WithSkeletonProps) => {
    if (isLoading) {
      return (
        <div>
          {[...Array(count)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      );
    }
    return <WrappedComponent {...props} />;
  };
};
