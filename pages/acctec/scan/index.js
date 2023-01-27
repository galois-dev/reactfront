import * as React from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { Axios } from "@pages/index";
import { Box, Button, Typography } from "@mui/material";
import RoundBox from "@components/sitecore/RoundBox";
import { useRouter } from "next/router";

export const Scan = () => {
  const [RFID, setRFID] = React.useState("");
  const router = useRouter();

  function postRFID() {
    router.push(`/acctec/${RFID}`);
  }

  function validateRFID() {
    console.log(RFID);
  }

  return (
    <Container fixed>
      <div className="scan_container">
        <RoundBox sx={{ p: 2 }}>
          <div>
            <Typography variant="h5" align="center" gutterBottom={true}>
              Scan RFID
            </Typography>
            <div>
              <TextField
                focused={true}
                autoFocus={true}
                required={true}
                variant="outlined"
                value={RFID}
                onChange={(e) => setRFID(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    postRFID();
                  }
                }}
                sx={{ width: "320px", mb: 2 }}
              />
            </div>
            <div>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  postRFID();
                }}
              >
                <Typography variant="h6" align="center" gutterBottom={true}>
                  ENTER
                </Typography>
              </Button>
            </div>
          </div>
        </RoundBox>
      </div>
    </Container>
  );
};

export default Scan;
