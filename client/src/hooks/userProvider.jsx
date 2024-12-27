import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { UserContext } from "./useUser";
import { getUserById } from "../utils/apis";

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const localStorageUser = await getLocalStorageUser();
      setUser(localStorageUser);
    }
    fetchUser();
  }, []);

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

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

async function getLocalStorageUser() {
  const userId = localStorage.getItem("userId");
  if (!userId) {
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
