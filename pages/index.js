import SignIn from "../src/components/sitecore/Signin.js";
import Home from "./Home.js";
import Dashboard from "./Dashboard.js";
import Tasks from "./Tasks.js";
import Users from "./Users.js";
import Customers from "./Customers.js";
import Customer from "./Customer.js";
import User from "./User.js";
import Units from "./Units.js";
import UnitsDetailView from "../src/components/Units/Unit_pk.js";
import Identity from "./Identity";
import * as React from "react";
import Container from "@mui/material/Container";
import Scan from "./Scan.js";
import Scan_pk from "./Scan_pk.js";
import Profile from "./Profile.js";
import overview from "./overview.js";
import forholdsordre from "./forholdsordre.js";
import SIM from "./SIM.js";
import axios from "axios";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
// import {
//   Routes,
//   Route,
//   Link,
//   Navigate,
//   browserHistory,
// } from "react-router-dom";
import {
  useGlobalContext,
  AppProvider,
  AppContext,
  ProtectedRoute,
  retriveUserFromLocalStorage,
} from "../src/helpers/auth.js";
import Navbar from "../src/components/sitecore/Navbar.js";
// import scss

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
    if (
      error.response.status === 401 &&
      originalRequest._retry !== true &&
      typeof window !== "undefined"
    ) {
      originalRequest["_retry"] = true;
      refreshAccessToken()
        .then((token) => {
          localStorage.setItem("access_token", token);
          Axios.defaults.headers.common["Authorization"] = "Bearer " + token;
          return Axios(originalRequest);
        })
        .catch((err) => {
          window.location.pathname = "/login";
        });
    } else {
      if (
        error?.response?.status === 401 ||
        (originalRequest._retry === true && typeof window !== "undefined")
      ) {
        window.location.pathname = "/login";
        return await Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export const pages = [
  {
    to: "/",
    name: "Home",
  },
  {
    to: "/Units",
    name: "Units",
  },
  {
    to: "/Customers",
    name: "Customers",
  },
  {
    to: "/Tasks",
    name: "Tasks",
  },
  {
    to: "/Dashboard",
    name: "Dashboard",
  },
  {
    to: "/Users",
    name: "Users",
  },
  // {
  //   to: "/acctec",
  //   name: "Acctec",
  // },
];
export const settings = ["Profile", "Account", "Dashboard", "Logout"];

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

export function App() {
  const { setToken } = useGlobalContext() || {};

  const user = retriveUserFromLocalStorage();

  return (
    <div className="App">
      <AppProvider>
        <ThemeProvider theme={theme}>
          <Navbar />
          <Container
            sx={{
              pl: `${
                typeof windows !== "undefined" &&
                ["login", "signup", "reset"].includes(
                  window.location.pathname.split("/")[1].toLowerCase()
                )
                  ? "0px"
                  : "210px"
              }`,
              pt: 3,
              height: "100%",
            }}
          >
            {/* <Routes>
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
                path="/units/customer/:id"
                element={
                  <ProtectedRoute user={user}>
                    <UnitsDetailView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/units/identity"
                element={
                  <ProtectedRoute user={user}>
                    <Identity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/units/identity/:id"
                element={
                  <ProtectedRoute user={user}>
                    <Identity />
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
                path="/acctec"
                element={
                  <ProtectedRoute user={user}>
                    <Scan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/SIM"
                element={
                  <ProtectedRoute user={user}>
                    <SIM />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/acctec/:id"
                element={
                  <ProtectedRoute user={user}>
                    <Scan_pk />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pdf"
                element={
                  <ProtectedRoute user={user}>
                    <Scan_pk />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pdf/forholdsordre"
                element={
                  <ProtectedRoute user={user}>
                    <Scan_pk />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pdf/1"
                element={
                  <ProtectedRoute user={user}>
                    <Scan_pk />
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
            </Routes> */}
          </Container>
        </ThemeProvider>
      </AppProvider>
    </div>
  );
}

export default App;
