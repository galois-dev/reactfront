import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Axios } from "@pages/index";
// import context
import { useGlobalContext } from "@/helpers/auth";

export default function Login() {
  const { setAuth, setRefreshToken } = useGlobalContext();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (typeof window !== "undefined") {
      Axios.post("/api/token", {
        username: data.get("email"),
        password: data.get("password"),
      }).then((response) => {
        const { access, refresh } = response.data;
        if (
          access !== "" &&
          access !== undefined &&
          refresh !== "" &&
          refresh !== undefined
        ) {
          setAuth(access);
          setRefreshToken(refresh);
          if (typeof window !== "undefined") {
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);
          }
          Axios.defaults.headers.common["Authorization"] = "Bearer " + access;
          Axios.defaults.headers.common["Refresh"] = refresh;
        }
      });
    }
  };

  return (
    <Container
      component="main"
      sx={{
        gridArea: "content",
        alignSelf: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
      maxWidth="xs"
    >
      <Box
        sx={{
          marginBottom: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth={true}
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus={true}
          />
          <TextField
            margin="normal"
            required
            fullWidth={true}
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth={true}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
