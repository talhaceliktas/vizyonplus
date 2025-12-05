import { createSearchParamsCache } from "nuqs/server";
import { parsers } from "./parsers";

export const searchParamsCache = createSearchParamsCache(parsers);
