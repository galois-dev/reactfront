import * as React from "react";
import Crudlist from "@helpers/crudlist";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import Paper from "@mui/material";
export const SIM = () => {
  return (
    <Container component={Paper}>
      <h1>test</h1>
      {/* <Crudlist
        api_endpoint="/SIM"
        haslist={true}
        hasmodal={true}
        addformelement={<></>}
        editformelement={<></>}
        columns={[
          { id: "ICCID", label: "ICCID", minWidth: 170 },
          { id: "provider", label: "Provider", minWidth: 170 },
          { id: "sim_status", label: "SIM Status", minWidth: 170 },
          { id: "phone_number", label: "Phone Number", minWidth: 170 },
        ]}
      /> */}
    </Container>
  );
};
export default SIM;
