import { Chip } from "@mui/material";
import status_switch from "./status";

export let status_pill = (params) => {
  switch (params) {
    case "A":
      return <Chip label={status_switch(params)} color="success" />;
    case "I":
      return <Chip label={status_switch(params)} color="warning" />;
    default:
      return <Chip label={status_switch(params)} color="primary" />;
  }
};
export default status_pill;
