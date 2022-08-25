import * as React from "react";
import { useGlobalContext } from "../../helpers/auth";

export default function Home() {
  const {
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
  } = useGlobalContext();

  return (
    <div className="Home">
      <p>{refreshToken}</p>
    </div>
  );
}
