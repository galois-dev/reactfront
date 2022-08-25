import React, { useContext, createContext, useState } from "react";
import {
  Routes,
  Route,
  NavLink,
  useNavigate,
  Navigate,
} from "react-router-dom";
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
  user.access = localStorage.getItem("access_token")
    ? localStorage.getItem("access_token")
    : "";
  user.refresh = localStorage.getItem("refresh_token")
    ? localStorage.getItem("refresh_token")
    : "";
  if (user.access !== "" && user.refresh !== "") {
    user.isAuthenticated = true;
  }
  return user;
};

const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const setAuth = (data) => {
    setIsAuthenticated(true);
    setUser(data.user);
    setToken(data.access);
    setRefreshToken(data.refresh);
    navigate("/");
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
