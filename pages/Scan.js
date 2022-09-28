import * as React from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { Axios } from "./index";

export const Scan = () => {
  const [RFID, setRFID] = React.useState("");

  function postRFID() {
    console.log(RFID);
  }

  return (
    <div className="scan_container">
      <div>
        <div>
          <h1>Scan RFID</h1>
        </div>
        <div>
          <TextField
            focused
            required
            variant="outlined"
            sx={{ width: "320px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Scan;
