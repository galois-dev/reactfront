import logo from "./logo.svg";
import SignIn from "./components/sitecore/Signin.js";
import Home from "./components/sitecore/Home.js";
import Dashboard from "./components/HR/Dashboard.js";
import Tasks from "./components/HR/Tasks.js";
import Users from "./components/HR/Users.js";
import Customers from "./components/HR/Customers.js";
import Customer from "./components/HR/Customer.js";
import User from "./components/HR/User.js";
import Units from "./components/Units/Units.js";
import * as React from "react";
import axios from "axios";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import {
  Routes,
  Route,
  Link,
  Navigate,
  browserHistory,
} from "react-router-dom";
import {
  useGlobalContext,
  AppProvider,
  AppContext,
  ProtectedRoute,
  retriveUserFromLocalStorage,
} from "./helpers/auth.js";
import Navbar from "./components/sitecore/Navbar.js";
// import scss
import "./App.scss";
import "./index.scss";

const API_URL = "https://localhost:8000";
export const Axios = axios.create({
  baseURL: API_URL,
  timeout: 1000,
});

// Request interceptor for API calls
Axios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("access_token");
    config.headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      //check this if causes problems
      "Content-Type": "application/json",
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

const refreshAccessToken = async () => {
  const token = localStorage.getItem("refresh_token");
  const res = await Axios.post(`${API_URL}/api/token/refresh`, {
    refresh: token,
  });
  // setToken(res.data.access);
  Axios.defaults.headers.common["Authorization"] = "Bearer " + res.data.access;
  localStorage.setItem("access_token", res.data.access);
  return res.data.access;
};

// Response interceptor for API calls
Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    console.log(error);
    let originalRequest = error.config;
    if (error.response.status === 401 && originalRequest._retry !== true) {
      originalRequest["_retry"] = true;
      const accessToken = refreshAccessToken()
        .then((token) => {
          localStorage.setItem("access_token", token);
          Axios.defaults.headers.common["Authorization"] = "Bearer " + token;
          return Axios(originalRequest);
        })
        .catch((err) => {
          window.location.pathname = "/login";
        });
    } else {
      if (error?.response?.status === 401 || originalRequest._retry === true) {
        window.location.pathname = "/login";
        return await Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

const theme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 640,
      laptop: 1024,
      desktop: 1200,
    },
  },
});

function App() {
  const { setToken } = useGlobalContext() || {};

  const user = retriveUserFromLocalStorage();

  return (
    <div className="App">
      <AppProvider>
        <Navbar />
        <ThemeProvider theme={theme}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute user={user}>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/units"
              element={
                <ProtectedRoute user={user}>
                  <Units />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Customers"
              element={
                <ProtectedRoute user={user}>
                  <Customers />
                </ProtectedRoute>
              }
            />

            <Route
              path="Customers/:id"
              element={
                <ProtectedRoute user={user}>
                  <Customer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute user={user}>
                  <Tasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute user={user}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id"
              element={
                <ProtectedRoute user={user}>
                  <User />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<SignIn />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute user={user}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </ThemeProvider>
      </AppProvider>
    </div>
  );
}

export default App;
