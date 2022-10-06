import Box from "@mui/material/Box";

const RoundBox = ({ children, sx }) => {
  let style = {
    borderRadius: "12px",
    shadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
    mt: 1,
    mb: 3,
    backgroundColor: "background.paper",
    width: "auto",
    border: "1px solid #dddddd",
  };
  if (sx !== undefined) {
    Object.keys(sx).forEach((key) => {
      style[key] = sx[key];
    });
  }

  return <Box sx={style}>{children}</Box>;
};

export default RoundBox;
