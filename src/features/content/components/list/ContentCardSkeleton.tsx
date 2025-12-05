import { FaPlay } from "react-icons/fa6";

export default function ContentCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-primary-900 relative aspect-2/3 w-full overflow-hidden rounded-xl border border-white/5 shadow-lg">
        <div className="shimmer-effect" />

        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <FaPlay className="text-primary-700 text-4xl" />
        </div>
      </div>

      <div className="space-y-2 px-1">
        <div className="bg-primary-900/60 relative h-5 w-3/4 overflow-hidden rounded-md">
          <div className="shimmer-effect" />
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="bg-primary-900/40 relative h-3 w-1/3 overflow-hidden rounded-md">
            <div className="shimmer-effect" />
          </div>
          <div className="bg-primary-900/40 relative h-3 w-1/5 overflow-hidden rounded-md">
            <div className="shimmer-effect" />
          </div>
        </div>
      </div>
    </div>
  );
}
