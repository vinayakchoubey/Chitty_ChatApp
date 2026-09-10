import { create } from "zustand";

const getValidTheme = () => {
  const saved = localStorage.getItem("chat-theme");
  return saved === "light" ? "light" : "dark";
};

export const useThemeStore = create((set) => ({
  theme: getValidTheme(),
  setTheme: (theme) => {
    const validTheme = theme === "light" ? "light" : "dark";
    localStorage.setItem("chat-theme", validTheme);
    document.documentElement.setAttribute("data-theme", validTheme); // Apply theme globally
    set({ theme: validTheme });
  },
}));

document.documentElement.setAttribute("data-theme", getValidTheme());

