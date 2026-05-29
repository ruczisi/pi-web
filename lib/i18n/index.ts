"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Dict, Lang } from "./dict";
import { dictionaries, detectLang } from "./dict";

interface I18nContextValue {
  lang: Lang;
  dict: Dict;
  setLang: (lang: Lang) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useTranslation(): Dict {
  return useI18n().dict;
}

export { type Lang, type Dict, dictionaries, detectLang };
export { I18nContext };
