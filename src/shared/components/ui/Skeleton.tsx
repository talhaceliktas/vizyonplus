export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`bg-primary-800/50 relative overflow-hidden ${className || ""}`}
    >
      <div className="shimmer-effect" />
    </div>
  );
}
