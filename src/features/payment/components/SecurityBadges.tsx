/**
 * Ödeme formunun altında gösterilen güvenlik rozetleri (Visa, Mastercard, vb.).
 * Kullanıcıya güven vermek amaçlıdır. Şimdilik sadece placeholder kutular içerir.
 */

export default function SecurityBadges() {
  return (
    <div className="mt-6 flex items-center justify-center gap-4 opacity-50 grayscale md:justify-start">
      {/* İleride buraya gerçek SVG logolar eklenebilir */}
      <div className="h-8 w-12 rounded bg-white/10" title="Visa"></div>
      <div className="h-8 w-12 rounded bg-white/10" title="Mastercard"></div>
      <div className="h-8 w-12 rounded bg-white/10" title="Troy"></div>
    </div>
  );
}
