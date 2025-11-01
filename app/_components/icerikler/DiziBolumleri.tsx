"use client";

const DiziBolumleri = ({ diziSezonBilgileri, seciliSezon }) => {
  const seciliSezonBolumleri = diziSezonBilgileri?.find(
    (s) => s.sezon_numarasi === seciliSezon,
  );

  console.log(diziSezonBilgileri);

  return (
    <div className="flex flex-1 flex-col px-8 py-2">
      <table className="table-auto border-separate border-spacing-y-4">
        <thead>
          {seciliSezonBolumleri.bolumler.map((bolum) => (
            <tr key={bolum.id}>
              <td className="text-primary-400">Bölüm {bolum.bolum_numarasi}</td>
              <td>{bolum.baslik}</td>
              <td className="text-primary-400 text-end">
                {new Date(bolum.yayin_tarihi).toLocaleDateString("tr-TR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </thead>
      </table>
    </div>
  );
};

export default DiziBolumleri;
