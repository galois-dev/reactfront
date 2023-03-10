import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import {
  useSelectedCustomerContext,
  useSelectedCustomerDispatchContext,
} from "@state/selectedCustomer";

const CustomerDescriptiveStats = ({ cursoryStats }) => {
  const selectedCustomerContext = useSelectedCustomerContext();
  const dispatchSelectedCustomer = useSelectedCustomerDispatchContext();
  let { selectedCustomer } = selectedCustomerContext;

  return (
    <>
      <Typography variant="h5">Descriptive statistics</Typography>
      <Box sx={{ display: "flex", width: "100%", gap: 3 }}>
        <List sx={{ width: "100%" }} dense>
          <ListItem>
            <ListItemText align="left" primary="Rfid list size: " />
            <ListItemText
              align="right"
              secondary={`${cursoryStats.totalSize}`}
            />
          </ListItem>
          <ListItem>
            <ListItemText align="left" primary="Active %: " />
            <ListItemText
              align="right"
              secondary={`${cursoryStats.activePct * 100}%`}
            />
          </ListItem>
          <ListItem>
            <ListItemText align="left" primary="Avg age: " />
            <ListItemText align="right" secondary={`${cursoryStats.avgAge}`} />
          </ListItem>
          <ListItem>
            <ListItemText align="left" primary="Newest user: " />
            <ListItemText align="right" secondary={`${cursoryStats.newest}`} />
          </ListItem>
          <ListItem>
            <ListItemText align="left" primary="Oldest user: " />
            <ListItemText align="right" secondary={`${cursoryStats.oldest}`} />
          </ListItem>
          <ListItem>
            <ListItemText align="left" primary="Max Temporary users: " />
            <ListItemText
              align="right"
              secondary={`${selectedCustomer.max_temp_user}`}
            />
          </ListItem>
          <ListItem>
            <ListItemText align="left" primary="Max Permanent users: " />
            <ListItemText
              align="right"
              secondary={`${
                selectedCustomer.max_total_user - selectedCustomer.max_temp_user
              }`}
            />
          </ListItem>
          <ListItem>
            <ListItemText align="left" primary="Max Total users: " />
            <ListItemText
              align="right"
              secondary={`${selectedCustomer.max_total_user}`}
            />
          </ListItem>
        </List>
        <List sx={{ width: "100%" }} dense>
          {cursoryStats.groupSizes.map((group, idx) => {
            return (
              <ListItem key={String(idx)}>
                <ListItemText align="left" primary={group[0]} />
                <ListItemText align="right" secondary={group[1]} />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </>
  );
};

export default CustomerDescriptiveStats;
