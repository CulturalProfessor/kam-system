/* eslint-disable react-refresh/only-export-components */
import { useState, createContext, useContext } from "react";
import Proptypes from "prop-types";
import { getUserById } from "./apis";

export const UserContext = createContext();

export function UserProvider({ children }) {
  UserProvider.propTypes = {
    children: Proptypes.node.isRequired,
  };
  const [user, setUser] = useState();

  const login = async (userId, accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("userId", userId);
    const localStorageUser = await getLocalStorageUser();
    setUser(localStorageUser);
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

async function getLocalStorageUser() {
  const userId = localStorage.getItem("userId");
  if (userId === undefined) {
    console.warn("No userId found in localStorage");
    return null;
  }
  try {
    const response = await getUserById(userId);
    return response || null;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}
