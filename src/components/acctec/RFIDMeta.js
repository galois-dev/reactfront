import LoadingComponent from "@components/sitecore/LoadingComponent";
import { CircularProgress, List, ListItem, Typography } from "@mui/material";
import {
  selectedCustomerContext,
  useSelectedCustomerContext,
  useSelectedCustomerDispatchContext,
} from "@state/selectedCustomer";
import { useContext, useEffect, useState } from "react";

const RFIDMeta = ({ RFIDS }) => {
  const selectedCustomerContext = useSelectedCustomerContext();
  const dispatchSelectedCustomer = useSelectedCustomerDispatchContext();
  const [NumTempUsers, setNumTempUsers] = useState(0);
  const [NumPermUsers, setNumPermUsers] = useState(0);
  let { selectedCustomer } = selectedCustomerContext;
  useEffect(() => {
    let tempUsers = 0;
    let permUsers = 0;
    RFIDS.forEach((rfid) => {
      if (rfid.status === "A") {
        if (
          rfid.ExpiryDate !== null &&
          (rfid.MaxUses !== null || rfid.MaxUses === 0)
        ) {
          tempUsers++;
        } else {
          permUsers++;
        }
      }
    });
    setNumTempUsers(tempUsers);
    setNumPermUsers(permUsers);
  }, [RFIDS]);

  if (selectedCustomer === undefined || RFIDS === undefined)
    return <LoadingComponent />;

  return (
    <span>
      <Typography color="primary.main" variant="h5" gutterBottom={false}>
        Meta data
      </Typography>
      <List>
        <ListItem sx={{ minWidth: "150px" }}>
          <Typography color="success.main" variant="caption" align="left">
            Temp users
          </Typography>
          <hr></hr>
          <Typography color="success.light" variant="body1" align="right">
            {NumTempUsers + " / " + selectedCustomer.max_temp_user}
          </Typography>
        </ListItem>
        <ListItem sx={{ minWidth: "150px" }}>
          <Typography color="success.main" variant="caption" align="left">
            Perm users
          </Typography>
          <hr></hr>
          <Typography color="success.light" variant="body1" align="right">
            {NumPermUsers + " / "}
            {selectedCustomer.max_total_user - selectedCustomer.max_temp_user}
          </Typography>
        </ListItem>
        <ListItem sx={{ minWidth: "150px" }}>
          <Typography color="success.main" variant="caption" align="left">
            Total users
          </Typography>
          <hr></hr>
          <Typography color="success.light" variant="body1" align="right">
            {NumPermUsers +
              NumTempUsers +
              " / " +
              selectedCustomer.max_total_user}
          </Typography>
        </ListItem>
      </List>
    </span>
  );
};

export default RFIDMeta;
