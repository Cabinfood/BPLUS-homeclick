import { Skeleton } from "@modules/common/components/skeleton"

export function LandingHeroSkeleton() {
  return (
    <section className="overflow-hidden relative w-full h-screen">
      {/* Background Skeleton */}
      <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      
      {/* Content Skeleton */}
      <div className="flex relative z-10 justify-center items-center h-full">
        <div className="px-4 space-y-6 max-w-4xl text-center">
          <Skeleton className="mx-auto w-3/4 h-16" />
          <Skeleton className="mx-auto w-1/2 h-6" />
          <Skeleton className="mx-auto w-48 h-12" />
        </div>
      </div>
    </section>
  )
}

export function LandingBentoGridSkeleton() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        {/* Title Skeleton */}
        <div className="mb-16 text-center">
          <Skeleton className="mx-auto mb-4 w-1/3 h-12" />
          <Skeleton className="mx-auto w-1/2 h-6" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 h-[600px]">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={`bg-gray-200 rounded-2xl animate-pulse ${
                index === 0 ? "md:col-span-2 md:row-span-2" : 
                index === 1 ? "md:col-span-2" : 
                "col-span-1"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export function LandingPageSkeleton() {
  return (
    <div className="min-h-screen">
      <LandingHeroSkeleton />
      <LandingBentoGridSkeleton />
    </div>
  )
}
