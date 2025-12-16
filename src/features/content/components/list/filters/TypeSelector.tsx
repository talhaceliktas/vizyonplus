"use client";

import { useEffect, useState } from "react";
import supabaseBrowserClient from "../../../../../lib/supabase/client";

interface TypeSelectorProps {
  currentType: string | null;
  onTypeChange: (type: string | null) => void;
}

export default function TypeSelector({
  currentType,
  onTypeChange,
}: TypeSelectorProps) {
  const [user, setUser] = useState<any>(null);

  const options = [
    { id: null, label: "Tümü" },
    { id: "film", label: "Filmler" },
    { id: "dizi", label: "Diziler" },
    { id: "onerilenler", label: "Önerilenler" },
  ];

  useEffect(() => {
    async function kullaniciCek() {
      const {
        data: { user },
      } = await supabaseBrowserClient.auth.getUser();

      setUser(user);
    }
    kullaniciCek();
  }, []);

  return (
    <div className="flex flex-col items-center gap-1 self-start rounded-full bg-black/20 p-1 sm:flex-row">
      {options.map((item) =>
        item.id === "onerilenler" && !user ? null : (
          <button
            key={item.label}
            onClick={() => onTypeChange(item.id)}
            className={`rounded-full px-6 py-2 text-sm font-bold transition-all duration-300 ${
              currentType === item.id
                ? "bg-secondary-1-2 text-primary-50 shadow-lg shadow-yellow-500/10"
                : "text-primary-200/50 hover:text-primary-100/80"
            }`}
          >
            {item.label}
          </button>
        ),
      )}
    </div>
  );
}
