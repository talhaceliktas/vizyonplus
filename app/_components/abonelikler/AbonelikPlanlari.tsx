"use client";

import React, { useState } from "react";
import AbonelikKarti from "./AbonelikKarti";
import { AbonelikPlani } from "../../types";

interface Props {
  dbPlanlar: AbonelikPlani[];
}

const AbonelikPlanlari: React.FC<Props> = ({ dbPlanlar }) => {
  const [loading, setLoading] = useState(false);

  const planSecimiAfirmasi = async (planId: number, planAdi: string) => {
    setLoading(true);
    console.log(
      `${planAdi} (ID: ${planId}) seçildi. Ödeme sayfasına yönlendiriliyor...`,
    );

    // BURAYA DAHA SONRA IYZICO ENTEGRASYONU GELECEK
    // router.push(`/odeme?planId=${planId}`);

    setTimeout(() => setLoading(false), 1000); // Fake loading
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0a0a0a] py-20 md:py-32">
      {/* Arka plan dekoratif elementleri - Biraz daha sadeleştirdim */}
      <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0a0a0a] to-[#0a0a0a]" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-5xl font-black tracking-tight text-transparent md:text-6xl">
            Vizyon+&apos;a Katılın
          </h2>
          <p className="text-xl font-medium text-gray-400 md:text-2xl">
            Size uygun planı seçin. İstediğiniz zaman iptal edin.
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {dbPlanlar.map((plan) => (
            <AbonelikKarti
              key={plan.id}
              plan={plan}
              onPlanSec={planSecimiAfirmasi}
              isLoading={loading}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            Tüm planlar 3 gün ücretsiz deneme ile başlar • İstediğiniz zaman
            iptal edin
          </p>
        </div>
      </div>
    </section>
  );
};

export default AbonelikPlanlari;
