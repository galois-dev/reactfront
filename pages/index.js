import * as React from "react";
import Container from "@mui/material/Container";
import axios from "axios";
// import { StyledEngineProvider } from "@mui/material/styles";
import { useTheme, ThemeProvider, styled } from "@mui/material/styles";
import { useRouter } from "next/router";

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

// const API_URL = "https://whale-app-tv6wx.ondigitalocean.app/";
const API_URL = "https://localhost:8000/";
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

Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    let originalRequest = error.config;
    if (
      error?.response?.status === 401 &&
      originalRequest._retry !== true &&
      typeof window !== "undefined"
    ) {
      try {
        let token = await refreshAccessToken();
        originalRequest["_retry"] = true;
        localStorage.setItem("access_token", token);
        Axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        return Axios(originalRequest);
      } catch (err) {
        window.location.pathname = "/login";
        return Promise.reject(err);
      }
    } else if (originalRequest._retry === true) {
      window.location.pathname = "/login";
      return Promise.reject(error);
    }
  }
);
// // Response interceptor for API calls
// Axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async function (error) {
//     let originalRequest = error.config;
//     if (
//       error?.response?.status === 401 &&
//       originalRequest._retry !== true &&
//       typeof window !== "undefined"
//     ) {
//       refreshAccessToken()
//         .then((token) => {
//           originalRequest["_retry"] = true;
//           localStorage.setItem("access_token", token);
//           Axios.defaults.headers.common["Authorization"] = "Bearer " + token;
//           return Axios(originalRequest);
//         })
//         .catch((err) => {
//           window.location.pathname = "/login";
//           return Promise.reject(err);
//         });
//     } else {
//       if (
//         error?.response?.status === 401 ||
//         (originalRequest._retry === true && typeof window !== "undefined")
//       ) {
//         window.location.pathname = "/login";
//         return Promise.reject(error);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

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

export function App({ children }) {
  const theme = useTheme();
  const { setToken } = useGlobalContext() || {};
  const router = useRouter();
  const user = retriveUserFromLocalStorage();

  const style = {
    pl: `${
      ["login", "signup", "reset"].includes(
        router.asPath.split("/")[1].toLowerCase()
      )
        ? "0px"
        : "250px"
    }`,
  };

  // if (router.asPath.split("/")[1].toLowerCase() === undefined) {
  //   return <>loading...</>;
  // }

  return (
    // <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <AppProvider>
        <Container
          maxWidth="xl"
          sx={{
            pl: style.pl + " !important",
            pr: "0px !important",
            height: "100%",
          }}
        >
          <Navbar />
          <div>{children}</div>
        </Container>
      </AppProvider>
    </ThemeProvider>
    // </StyledEngineProvider>
  );
}

export default App;
