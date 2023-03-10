import LoadingComponent from "@components/sitecore/LoadingComponent";
import {
  useSelectedCustomerContext,
  useSelectedCustomerDispatchContext,
} from "@state/selectedCustomer";
import { useContext } from "react";

const { List, ListItemButton, Typography } = require("@mui/material");

const RFIDCustomerSelect = ({ customers, onChange }) => {
  const selectedCustomerContext = useSelectedCustomerContext();
  const dispatchSelectedCustomer = useSelectedCustomerDispatchContext();
  let { selectedCustomer } = selectedCustomerContext;

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
              selected={selectedCustomer.id == customer.id}
              key={String(idx)}
              onClick={() => {
                if (customer.id !== selectedCustomer.id) onChange(customer);
                dispatchSelectedCustomer({
                  type: "SET",
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
