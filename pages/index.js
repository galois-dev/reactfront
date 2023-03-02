import * as React from "react";
import Container from "@mui/material/Container";
import axios from "axios";
// import { StyledEngineProvider } from "@mui/material/styles";
import { useTheme, ThemeProvider, styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { amber, indigo, teal } from "@mui/material/colors";

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
import { createTheme } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";

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
//       try {
//         let token = await refreshAccessToken();
//         originalRequest["_retry"] = true;
//         localStorage.setItem("access_token", token);
//         Axios.defaults.headers.common["Authorization"] = "Bearer " + token;
//         return Axios(originalRequest);
//       } catch (err) {
//         window.location.pathname = "/login";
//         return Promise.reject(err);
//       }
//     } else if (originalRequest._retry === true) {
//       window.location.pathname = "/login";
//       return Promise.reject(error);
//     }
//   }
// );
// Response interceptor for API calls
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
      refreshAccessToken()
        .then((token) => {
          originalRequest["_retry"] = true;
          localStorage.setItem("access_token", token);
          Axios.defaults.headers.common["Authorization"] = "Bearer " + token;
          return Axios(originalRequest);
        })
        .catch((err) => {
          window.location.pathname = "/login";
          return Promise.reject(err);
        });
    } else {
      if (
        error?.response?.status === 401 ||
        (originalRequest._retry === true && typeof window !== "undefined")
      ) {
        window.location.pathname = "/login";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export const pages = [
  {
    to: "/",
    name: "Home",
    icon: "home",
  },
  {
    to: "/Units",
    name: "Units",
    icon: "cable",
  },
  {
    to: "/Customers",
    name: "Customers",
    icon: "peopleOutline",
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
    icon: "group",
  },
  // {
  //   to: "/acctec",
  //   name: "Acctec",
  // },
];
export const settings = ["Profile", "Account", "Dashboard", "Logout"];

let theme = createTheme({
  palette: {
    primary: {
      main: indigo[400],
      light: indigo[100],
      dark: indigo[900],
    },
    secondary: {
      main: amber[400],
      light: amber[100],
      dark: amber[900],
    },
  },
});

export function App({ children }) {
  const { setToken } = useGlobalContext() || {};
  const router = useRouter();
  const user = retriveUserFromLocalStorage();
  const [navFold, setNavFold] = React.useState(false);

  let pl_val = "250px";
  if (
    ["login", "signup", "reset"].includes(
      router.asPath.split("/")[1].toLowerCase()
    )
  ) {
    pl_val = "0px";
  } else {
    if (navFold) {
      pl_val = "64px";
    } else {
      pl_val = "250px";
    }
  }

  let style = {
    pl: pl_val,
  };

  // if (router.asPath.split("/")[1].toLowerCase() === undefined) {
  //   return <>loading...</>;
  // }

  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Container
            maxWidth="xl"
            sx={{
              transition: "padding-left 150ms ease-in-out",
              pl: style.pl + " !important",
              pr: "0px !important",
              height: "100%",
            }}
          >
            <Navbar setNavFold={setNavFold} />
            <div>{children}</div>
          </Container>
        </LocalizationProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
