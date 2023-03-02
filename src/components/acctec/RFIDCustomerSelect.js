import LoadingComponent from "@components/sitecore/LoadingComponent";
import {
  selectedCustomerContext,
  selectedCustomerDispatchContext,
  useSelectedCustomerContext,
  useSelectedCustomerDispatchContext,
} from "@state/selectedCustomer";
import { useContext } from "react";

const { List, ListItemButton, Typography } = require("@mui/material");

const RFIDCustomerSelect = ({ customers }) => {
  const selectedCustomer = useSelectedCustomerContext();
  const dispatchSelectedCustomer = useSelectedCustomerDispatchContext();

  if (customers === undefined || customers.length === 0 || !customers) {
    return <LoadingComponent />;
  }

  return (
    <List
      dense
      sx={{
        overflowY: "scroll",
        height: "185px",
      }}
    >
      {customers !== undefined && customers.length > 0 ? (
        customers.map((customer, idx) => {
          return customer.id ? (
            <ListItemButton
              selected={selectedCustomer.selectedCustomer.id == customer.id}
              key={String(idx)}
              onClick={() => {
                dispatchSelectedCustomer({
                  type: "set",
                  payload: customer,
                });
              }}
            >
              <Typography color="primary.dark" variant="body2" align="center">
                {customer.customer_name}
              </Typography>
            </ListItemButton>
          ) : (
            <LoadingComponent />
          );
        })
      ) : (
        <LoadingComponent />
      )}
    </List>
  );
};

export default RFIDCustomerSelect;
