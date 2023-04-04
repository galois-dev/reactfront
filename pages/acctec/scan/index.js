import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import { Axios } from "@pages/index";
import { Box, Button, Typography } from "@mui/material";
import RoundBox from "@components/sitecore/RoundBox";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const Scan = () => {
  const [RFID, setRFID] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // If window if focused
    let FAKE_RFID = []; // Works because the useEffect cannot see useState only
    // Push new data to it

    const interval = setInterval(async () => {
      if (document.hasFocus()) {
        const text = await navigator.clipboard.readText();
        if (!FAKE_RFID.includes(text)) {
          FAKE_RFID.push(text);
          await setRFID((RIFD) => [...RIFD, text]);
        }
      }
    }, 250);
    return () => clearInterval(interval);
  }, []);

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
            <div>{RFID.map((rfid) => {})}</div>
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
