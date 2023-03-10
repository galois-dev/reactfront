import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useConfigGroup } from "@state/ConfigGroups";
import { useSelectedCustomer } from "@state/selectedCustomer";
import { useState } from "react";

const CustomerAcctecGroupList = () => {
  const [{ selectedCustomer }, dispatchSelectedCustomer] =
    useSelectedCustomer();
  const [{ acctecGroups }, dispatchGroups] = useConfigGroup();
  const [name, setName] = useState("");
  const [modalName, setModalName] = useState("");
  const [modalObj, setModalObj] = useState({
    id: "",
    type: "",
    action: "edit",
  });
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "650px",
        ml: "auto",
        mr: "auto",
      }}
    >
      <Typography variant="h5">Acctec groups</Typography>
      <br />
      <List dense>
        <ListItem>
          <ListItemText primary="Group Name" align="left" />
        </ListItem>
        {acctecGroups.map((group) => {
          return (
            <ListItem key={group.id}>
              <ListItemText secondary={group.Name} align="left" />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default CustomerAcctecGroupList;
