import { Delete } from "@mui/icons-material";
import Edit from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useConfigGroup } from "@state/ConfigGroups";
import { useSelectedCustomer } from "@state/selectedCustomer";
import { useState } from "react";

const CustomerControllerGroupList = () => {
  const [{ selectedCustomer }, dispatchSelectedCustomer] =
    useSelectedCustomer();
  const [{ controllerGroups }, dispatchGroups] = useConfigGroup();
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
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        {modalObj.action === "edit" && (
          <Box>
            <DialogTitle>Edit Name for {modalName}</DialogTitle>
            <DialogContent>
              <DialogContentText
                align="left"
                sx={{
                  maxWidth: "300px",
                  fontSize: "0.75rem",
                }}
              >
                This option changes the name of the group only. If you want to
                deactivate all linked entry tokens uncheck the checkmark on the
                previous page and hit save. If you want to delete the group,
                click on the red button instead.
              </DialogContentText>
              <TextField
                margin="dense"
                id="name"
                fullWidth
                variant="standard"
                value={modalName}
                onChange={(e) => {
                  setModalName(e.target.value);
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  setModalOpen(false);
                  dispatchGroups({
                    type: "UPDATE_CONTROLLER_GROUP_BY_ID",
                    payload: {
                      id: modalObj.id,
                      Name: modalName,
                    },
                  });
                }}
              >
                Save
              </Button>
            </DialogActions>
          </Box>
        )}
        {modalObj.action === "delete" && (
          <Box>
            <DialogTitle>Delete {modalName}</DialogTitle>
            <DialogContent>
              <DialogContentText
                align="left"
                sx={{ maxWidth: "300px", fontSize: "0.75rem" }}
              >
                This option deletes the group and all linked entry tokens. If
                you want to deactivate all linked entry tokens uncheck the
                checkmark on the previous page and hit save.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  setModalOpen(false);
                  dispatchGroups({
                    type: "DELETE_CONTROLLER_GROUP_BY_ID",
                    payload: { id: modalObj.id },
                  });
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </Box>
        )}
      </Dialog>

      <Typography variant="h4">Controller groups</Typography>
      <br />
      <List dense>
        <ListItem>
          <ListItemText
            primary="Group Name"
            align="left"
            sx={{ width: "40%" }}
          />
          <ListItemText primary="Active" align="center" sx={{ width: "30%" }} />
          <ListItemText
            primary="Actions"
            align="center"
            sx={{ width: "40px" }}
          />
        </ListItem>
        {controllerGroups.map((group, idx) => {
          return (
            <ListItem key={"controller_group " + idx}>
              <ListItemText
                secondary={group.Name}
                align="left"
                sx={{
                  width: "40%",
                }}
              />
              <ListItemText
                align="center"
                sx={{
                  width: "30%",
                }}
              >
                <Checkbox
                  checked={group.status === "A"}
                  onChange={() => {
                    dispatchGroups({
                      type: "UPDATE_CONTROLLER_GROUP_BY_ID",
                      payload: {
                        ...group,
                        status: group.status === "A" ? "I" : "A",
                      },
                    });
                  }}
                />
              </ListItemText>
              <ListItemText
                align="center"
                sx={{
                  width: "40px",
                }}
              >
                <ButtonGroup>
                  <IconButton
                    color="warning"
                    onClick={() => {
                      setModalName(group.Name);
                      setModalObj({
                        id: group.id,
                        type: "controller",
                        action: "edit",
                      });
                      setModalOpen(true);
                    }}
                  >
                    <Icon>
                      <Edit />
                    </Icon>
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => {
                      setModalObj({
                        id: group.id,
                        type: "controller",
                        action: "delete",
                      });
                      setModalOpen(true);
                    }}
                  >
                    <Icon>
                      <Delete />
                    </Icon>
                  </IconButton>
                </ButtonGroup>
              </ListItemText>
            </ListItem>
          );
        })}
        <br />
        <ListItem sx={{ gap: 3 }}>
          <TextField
            fullWidth
            variant="standard"
            label="Add Group"
            placeholder="Group Name"
            size="small"
            color="primary"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            variant="outlined"
            color="success"
            size="small"
            onClick={() => {
              setName("");
              dispatchGroups({
                type: "ADD_CONTROLLER_GROUP",
                payload: {
                  Name: name,
                  status: "A",
                },
              });
            }}
          >
            Add
          </Button>
        </ListItem>
      </List>
    </Box>
  );
};

export default CustomerControllerGroupList;
