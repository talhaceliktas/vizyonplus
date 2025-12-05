import { parseAsInteger, parseAsString } from "nuqs/server";

export const parsers = {
  tur: parseAsString,

  kategori: parseAsString,

  sirala: parseAsString.withDefault("yeni"),

  page: parseAsInteger.withDefault(1),
};
