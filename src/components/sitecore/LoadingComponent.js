import { CircularProgress, Container } from "@mui/material";

export const LoadingComponent = () => {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        minHeight: "200px",
        width: "100%",
      }}
    >
      <CircularProgress />
    </Container>
  );
};

export default LoadingComponent;
