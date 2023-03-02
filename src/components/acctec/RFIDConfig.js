import LoadingComponent from "@components/sitecore/LoadingComponent";
import TabPanel from "@components/sitecore/TabPanel";
import {
  Button,
  Checkbox,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import {
  selectedCustomerContext,
  selectedCustomerDispatchContext,
  useSelectedCustomerContext,
  useSelectedCustomerDispatchContext,
} from "@state/selectedCustomer";

const RFIDConfig = ({
  configTab,
  setConfigTab,
  updateCustomer,
  cursoryStats,
}) => {
  const selectedCustomer = useSelectedCustomerContext();
  const dispatchSelectedCustomer = useSelectedCustomerDispatchContext();

  if (selectedCustomer == undefined) {
    return <LoadingComponent />;
  }

  return (
    <span>
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gridTemplateRows: "auto",
          height: 400,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={configTab}
          onChange={(event, newValue) => {
            setConfigTab(newValue);
          }}
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          <Tab label="Overview" />
          <Tab label="Controller groups" />
          <Tab label="Acctec groups" />
          <Tab label="Limits" />
        </Tabs>
        <TabPanel value={configTab} index={0}>
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
                <ListItemText
                  align="right"
                  secondary={`${cursoryStats.avgAge}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText align="left" primary="Newest user: " />
                <ListItemText
                  align="right"
                  secondary={`${cursoryStats.newest}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText align="left" primary="Oldest user: " />
                <ListItemText
                  align="right"
                  secondary={`${cursoryStats.oldest}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText align="left" primary="Max Temporary users: " />
                <ListItemText
                  align="right"
                  secondary={`${selectedCustomer.selectedCustomer.max_temp_user}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText align="left" primary="Max Permanent users: " />
                <ListItemText
                  align="right"
                  secondary={`${
                    selectedCustomer.selectedCustomer.max_total_user -
                    selectedCustomer.selectedCustomer.max_temp_user
                  }`}
                />
              </ListItem>
              <ListItem>
                <ListItemText align="left" primary="Max Total users: " />
                <ListItemText
                  align="right"
                  secondary={`${selectedCustomer.selectedCustomer.max_total_user}`}
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
        </TabPanel>
        <TabPanel value={configTab} index={1}>
          <Typography variant="h5">Controller groups</Typography>
          <br />
          <List dense>
            <ListItem>
              <ListItemText primary="Group Name" align="left" />
              <ListItemText primary="Active" align="right" />
            </ListItem>
            <ListItem>
              <ListItemText secondary="Group 1" />
              <Checkbox />
            </ListItem>
            <br />
            <ListItem sx={{ gap: 3 }}>
              <TextField
                fullWidth
                variant="standard"
                label="Add Group"
                placeholder="Group Name"
                size="small"
                color="primary"
              />
              <Button variant="outlined" color="success" size="small">
                Add
              </Button>
            </ListItem>
          </List>
        </TabPanel>
        <TabPanel value={configTab} index={2}>
          <Typography variant="h5">Acctec groups</Typography>
          <br />
          <List dense>
            <ListItem>
              <ListItemText primary="Group Name" align="left" />
            </ListItem>
            <ListItem>
              <ListItemText secondary="Group 1" />
            </ListItem>
          </List>
        </TabPanel>
        <TabPanel
          value={configTab}
          index={3}
          id={`vertical-tabpanel-2`}
          sx={{ width: "100%", margin: "auto", p: 0 }}
        >
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
              value={selectedCustomer.selectedCustomer.max_temp_user}
              onChange={(event) => {
                dispatchSelectedCustomer({
                  type: "set",
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
              value={selectedCustomer.selectedCustomer.max_total_user}
              onChange={(event) => {
                dispatchSelectedCustomer({
                  type: "set",
                  payload: {
                    ...selectedCustomer,
                    max_temp_user: event.target.value,
                  },
                });
              }}
            />
          </Box>
        </TabPanel>
      </Box>
      <Box sx={{ p: 3 }}>
        {configTab !== 0 ? (
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              updateCustomer(selectedCustomer);
            }}
          >
            Save
          </Button>
        ) : (
          ""
        )}
      </Box>
    </span>
  );
};

export default RFIDConfig;
