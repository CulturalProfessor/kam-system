import { useContext,createContext } from "react";
export const ThemeContext = createContext(null);

export const useThemeContext = () => useContext(ThemeContext);
