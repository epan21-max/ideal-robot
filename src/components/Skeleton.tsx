export function CardSkeleton() {
  return (
    <div className="space-y-2">
      <div className="aspect-[2/3] rounded-2xl skeleton" />
      <div className="h-3 rounded skeleton w-3/4" />
      <div className="h-2 rounded skeleton w-1/3" />
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}

export function RailSkeleton() {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="shrink-0 w-36 space-y-2">
          <div className="aspect-[2/3] rounded-2xl skeleton" />
          <div className="h-3 rounded skeleton w-3/4" />
        </div>
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return <div className="rounded-[28px] skeleton" style={{ height: 360 }} />;
}
