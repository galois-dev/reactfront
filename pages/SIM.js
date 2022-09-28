import * as React from "react";
import Crudlist from "../src/helpers/crudlist";

export const SIM = () => {
  return (
    <Crudlist
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
    />
  );
};
export default SIM;
