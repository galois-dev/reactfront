import LoadingComponent from "@components/sitecore/LoadingComponent";
import { CircularProgress, List, ListItem, Typography } from "@mui/material";
import {
  selectedCustomerContext,
  useSelectedCustomerContext,
  useSelectedCustomerDispatchContext,
} from "@state/selectedCustomer";
import { useContext } from "react";

const RFIDMeta = () => {
  const selectedCustomer = useSelectedCustomerContext();
  const dispatchSelectedCustomer = useSelectedCustomerDispatchContext();
  if (selectedCustomer === undefined) {
    return <LoadingComponent />;
  }

  return (
    <span>
      <Typography color="primary.main" variant="h5" gutterBottom={false}>
        Meta data
      </Typography>
      <List>
        <ListItem sx={{ minWidth: "200px" }}>
          <Typography color="success.main" variant="caption" align="left">
            Temp users
          </Typography>
          <hr></hr>
          <Typography color="success.light" variant="body1" align="right">
            {selectedCustomer.selectedCustomer.current_temp_user} /
            {" " + selectedCustomer.selectedCustomer.max_temp_user}
          </Typography>
        </ListItem>
        <ListItem sx={{ minWidth: "200px" }}>
          <Typography color="success.main" variant="caption" align="left">
            Perm users
          </Typography>
          <hr></hr>
          <Typography color="success.light" variant="body1" align="right">
            {selectedCustomer.selectedCustomer.current_total_user -
              selectedCustomer.selectedCustomer.current_temp_user +
              " "}
            /{" "}
            {selectedCustomer.selectedCustomer.max_total_user -
              selectedCustomer.selectedCustomer.max_temp_user}
          </Typography>
        </ListItem>
        <ListItem sx={{ minWidth: "200px" }}>
          <Typography color="success.main" variant="caption" align="left">
            Total users
          </Typography>
          <hr></hr>
          <Typography color="success.light" variant="body1" align="right">
            {selectedCustomer.selectedCustomer.current_total_user} /
            {" " + selectedCustomer.selectedCustomer.max_total_user}
          </Typography>
        </ListItem>
      </List>
    </span>
  );
};

export default RFIDMeta;
