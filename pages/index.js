import * as React from "react";
import Container from "@mui/material/Container";
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

const API_URL = "https://whale-app-tv6wx.ondigitalocean.app/";
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
  // {
  //   to: "/Tasks",
  //   name: "Tasks",
  // },
  // {
  //   to: "/Dashboard",
  //   name: "Dashboard",
  // },
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

export function App({ children }) {
  const { setToken } = useGlobalContext() || {};

  const user = retriveUserFromLocalStorage();

  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <Container
          sx={{
            pl: `${
              typeof windows !== "undefined" &&
              ["login", "signup", "reset"].includes(
                window.location.pathname.split("/")[1].toLowerCase()
              )
                ? "0px"
                : "250px"
            }`,
            pt: 3,
            height: "100%",
          }}
        >
          <Navbar />
          <div>{children}</div>
        </Container>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
