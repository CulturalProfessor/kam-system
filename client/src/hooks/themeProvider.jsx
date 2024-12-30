import { useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Proptypes from "prop-types";
import { ThemeContext } from "./useTheme";

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                primary: { main: "#90caf9" },
                secondary: { main: "#f48fb1" },
                background: { default: "#121212", paper: "#1e1e1e" },
                text: { primary: "#fff", secondary: "#bbb" },
              }
            : {
                primary: { main: "#1976d2" },
                secondary: { main: "#dc004e" },
                background: { default: "#f4f6f8", paper: "#fff" },
                text: { primary: "#000", secondary: "#555" },
              }),
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: mode === "dark" ? "#121212" : "#f4f6f8",
                color: mode === "dark" ? "#fff" : "#000",
                transition: "background-color 0.3s ease",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

ThemeContextProvider.propTypes = {
  children: Proptypes.node.isRequired,
};
