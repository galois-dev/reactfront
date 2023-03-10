import { Box, TextField, Typography } from "@mui/material";
import {
  useSelectedCustomerContext,
  useSelectedCustomerDispatchContext,
} from "@state/selectedCustomer";

const CustomerTokenLimitForm = () => {
  const selectedCustomerContext = useSelectedCustomerContext();
  const dispatchSelectedCustomer = useSelectedCustomerDispatchContext();
  let { selectedCustomer } = selectedCustomerContext;

  return (
    <>
      <Typography variant="h5">Limits</Typography>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          p: 1,
          gap: 2,
          justifyContent: "space-evenly",
        }}
      >
        <TextField
          id="temp-users"
          label="Temp users"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          variant="standard"
          value={selectedCustomer.max_temp_user}
          onChange={(event) => {
            dispatchSelectedCustomer({
              type: "SET",
              payload: {
                ...selectedCustomer,
                max_temp_user: event.target.value,
              },
            });
          }}
        />
        <TextField
          id="perm-users"
          label="Total users"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          variant="standard"
          value={selectedCustomer.max_total_user}
          onChange={(event) => {
            dispatchSelectedCustomer({
              type: "SET",
              payload: {
                ...selectedCustomer,
                max_total_user: event.target.value,
              },
            });
          }}
        />
      </Box>
    </>
  );
};

export default CustomerTokenLimitForm;
