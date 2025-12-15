import { parseAsInteger, parseAsString, parseAsArrayOf } from "nuqs/server";

export const parsers = {
  tur: parseAsString,

  kategori: parseAsArrayOf(parseAsString).withDefault([]),

  sirala: parseAsString.withDefault("yeni"),

  page: parseAsInteger.withDefault(1),
};
