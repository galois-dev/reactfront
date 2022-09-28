import * as React from "react";
import {
  useGlobalContext,
  AppContext,
  useAppContext,
} from "../src/helpers/auth";
import Container from "@mui/material/Container";

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
    <Container fixed>
      <div className="Home">
        <p>{refreshToken}</p>
      </div>
    </Container>
  );
}
