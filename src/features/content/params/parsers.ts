/**
 * Bu dosya, `nuqs` kütüphanesi için URL Query Parametrelerini ayrıştırır (parse).
 * Type-safe URL parametre yönetimi sağlar.
 */

import { parseAsInteger, parseAsString, parseAsArrayOf } from "nuqs/server";

export const parsers = {
  // İçerik Türü: 'film', 'dizi'
  tur: parseAsString,

  // Kategoriler: ['aksiyon', 'macera']
  kategori: parseAsArrayOf(parseAsString).withDefault([]),

  // Sıralama: 'yeni', 'eski', 'imdb'
  sirala: parseAsString.withDefault("yeni"),

  // Sayfalama
  page: parseAsInteger.withDefault(1),
};
