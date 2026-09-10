import { create } from "zustand";
import { TRANSLATIONS, GLOBAL_LANGUAGES, INDIAN_LANGUAGES, ALL_LANGUAGES } from "../constants/translations";

export const useLanguageStore = create((set, get) => ({
  language: localStorage.getItem("chat-language") || "English",
  globalLanguages: GLOBAL_LANGUAGES,
  indianLanguages: INDIAN_LANGUAGES,
  allLanguages: ALL_LANGUAGES,

  setLanguage: (language) => {
    localStorage.setItem("chat-language", language);
    set({ language });
  },

  t: (key) => {
    const { language } = get();
    const currentDict = TRANSLATIONS[language] || TRANSLATIONS.English;
    return currentDict[key] || TRANSLATIONS.English[key] || key;
  },
}));
