export default function SecurityBadges() {
  return (
    <div className="mt-6 flex items-center justify-center gap-4 opacity-50 grayscale md:justify-start">
      {/* İleride SVG logo koyabilirsin, şimdilik placeholder */}
      <div className="h-8 w-12 rounded bg-white/10" title="Visa"></div>
      <div className="h-8 w-12 rounded bg-white/10" title="Mastercard"></div>
      <div className="h-8 w-12 rounded bg-white/10" title="Troy"></div>
    </div>
  );
}
