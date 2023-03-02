import { CircularProgress, Container } from "@mui/material";

export const LoadingPage = () => {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <CircularProgress />
    </Container>
  );
};

export default LoadingPage;
