import React, { useContext, createContext, useState } from "react";
// import { useNavigate, Navigate } from "react-router-dom";
import { useRouter } from "next/router";

import { useLocalStorage } from "./hooks";
const AppContext = createContext();

export const ProtectedRoute = ({ user, children }) => {
  if (!user || !user.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

export const retriveUserFromLocalStorage = () => {
  let user = {};
  user.isAuthenticated = false;
  if (typeof window !== "undefined") {
    user.access = localStorage.getItem("access_token")
      ? localStorage.getItem("access_token")
      : "";
    user.refresh = localStorage.getItem("refresh_token")
      ? localStorage.getItem("refresh_token")
      : "";
    if (user.access !== "" && user.refresh !== "") {
      user.isAuthenticated = true;
    }
  }
  return user;
};

const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage(false);
  const [user, setUser] = useLocalStorage({});
  const [token, setToken] = useLocalStorage("");
  const [refreshToken, setRefreshToken] = useLocalStorage("");
  const [isLoading, setIsLoading] = useLocalStorage(false);
  const [error, setError] = useLocalStorage("");
  const navigate = useRouter();

  const setAuth = (data) => {
    setIsAuthenticated(true);
    setUser(data.user);
    setToken(data.access);
    setRefreshToken(data.refresh);
    navigate.push("/");
  };

  const setLogout = () => {
    setIsAuthenticated(false);
    setUser({});
    setToken("");
    setRefreshToken("");
  };

  const setLoading = (data) => {
    setIsLoading(data);
  };

  const setErrorMessage = (data) => {
    setError(data);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setAuth,
        setLogout,
        setLoading,
        setErrorMessage,
        setIsAuthenticated,
        setToken,
        setRefreshToken,
        isLoading,
        error,
        user,
        token,
        refreshToken,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
