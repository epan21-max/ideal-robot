export default function Loader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-primary/30 rounded-none neo-brutal-sm animate-spin" style={{ animationDuration: '1s' }}></div>
          <div className="absolute inset-2 border-4 border-accent/50 rounded-none animate-spin" style={{ animationDuration: '0.7s', animationDirection: 'reverse' }}></div>
        </div>
        <p className="font-mono text-sm text-text-secondary uppercase tracking-widest">Loading...</p>
      </div>
    </div>
  );
}
