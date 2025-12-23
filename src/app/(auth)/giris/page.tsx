import LoginForm from "@/features/auth/components/LoginForm";

// BU DOSYA NE İŞE YARAR?
// Kullanıcının sistemimize giriş yaptığı sayfadır.
// Next.js App Router yapısında "page.tsx" dosyaları, o klasörün (rotanın) ana görünümüdür.
// Burada "/giris" rotasına gelindiğinde ekranda ne görüneceği belirlenir.

// NEXT.JS METADATA (SEO)
// Bu obje, sayfanın HTML <head> kısmındaki <title> ve <meta name="description"> etiketlerini belirler.
// Google gibi arama motorları ve tarayıcı sekmeleri bu bilgiyi kullanır.
export const metadata = {
  title: "Giriş Yap | Vizyon+",
  description: "Hesabınıza giriş yapın ve izlemeye devam edin.",
};

// SAYFA BİLEŞENİ (COMPONENT)
// Varsayılan olarak (default export) dışarı aktarılan bu fonksiyon, sayfanın kendisidir.
export default function GirisPage() {
  return (
    // ANA KAPLAYICI (CONTAINER)
    // h-screen: Tüm ekran yüksekliğini kapla.
    // flex items-center justify-center: İçeriği (formu) tam ortaya hizala.
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-neutral-950">
      {/* ARKA PLAN RESMİ */}
      {/* absolute inset-0: Üstteki relative kapsayıcıya göre sol-üst köşeden başla ve tüm alanı kapla. */}
      {/* z-index belirtilmemiş, en altta kalır. */}
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/auth-movies-background.jpg')" }}
      ></div>

      {/* KARARTMA KATMANI (OVERLAY) */}
      {/* Resmin üzerine siyah yarı saydam bir katman atarak yazının daha okunabilir olmasını sağlar. */}
      {/* backdrop-blur: Arka planı hafifçe buzlar. */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>

      {/* GRADIENT (GEÇİŞ) KATMANI */}
      {/* Aşağıdan yukarıya doğru (to-t) siyahtan şeffafa geçiş yaparak sinematik bir etki verir. */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/80 opacity-90"></div>

      {/* İÇERİK (FORM) */}
      {/* z-10: Arka plan katmanlarının (z-0) üzerinde görünmesi için. */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Giriş formunu taşıyan alt bileşen */}
        <LoginForm />
      </div>
    </div>
  );
}
