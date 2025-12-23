/**
 * Bu dosya, `nuqs` parametre önbelleğini (cache) oluşturur.
 * Sunucu bileşenlerinde URL parametrelerine hızlı ve tip güvenli erişim sağlar.
 */

import { createSearchParamsCache } from "nuqs/server";
import { parsers } from "./parsers";

export const searchParamsCache = createSearchParamsCache(parsers);
