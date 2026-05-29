"use client";

import { useState, useMemo, useEffect } from "react";
import { I18nContext, detectLang, dictionaries, type Lang } from "@/lib/i18n";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const detected = detectLang();
    const saved = typeof window !== "undefined" ? (localStorage.getItem("pi-lang") as Lang | null) : null;
    setLangState(saved && (saved === "zh" || saved === "en") ? saved : detected);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("pi-lang", l);
  };

  const value = useMemo(() => ({ lang, dict: dictionaries[lang], setLang }), [lang]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}
