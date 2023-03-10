import LoadingComponent from "@components/sitecore/LoadingComponent";
import TabPanel from "@components/sitecore/TabPanel";
import {
  Button,
  ButtonGroup,
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
  useSelectedCustomerContext,
  useSelectedCustomerDispatchContext,
} from "@state/selectedCustomer";
import CustomerControllerGroupList from "./CustomerControllerGroupList";
import CustomerDescriptiveStats from "./CustomerDescriptiveStats";
import CustomerAcctecGroupList from "./CustomerAcctecGroupList";
import CustomerTokenLimitForm from "./CustomerTokenLimitForm";
import { useConfigGroup } from "@state/ConfigGroups";

const RFIDConfig = ({ configTab, setConfigTab, cursoryStats }) => {
  const selectedCustomerContext = useSelectedCustomerContext();
  const dispatchSelectedCustomer = useSelectedCustomerDispatchContext();
  let { selectedCustomer } = selectedCustomerContext;
  const [groups, groupDispatch] = useConfigGroup();
  if (selectedCustomer === undefined) {
    return <LoadingComponent />;
  }

  return (
    <span>
      <Box
        sx={{
          flexGrow: 1,
          // bgcolor: "background.paper",
          display: "grid",
          gridTemplateColumns: "210px 1fr",
          gridTemplateRows: "auto",
          height: 500,
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
          <CustomerDescriptiveStats cursoryStats={cursoryStats} />
        </TabPanel>
        <TabPanel value={configTab} index={1}>
          <CustomerControllerGroupList />
        </TabPanel>
        <TabPanel value={configTab} index={2}>
          <CustomerAcctecGroupList />
        </TabPanel>
        <TabPanel value={configTab} index={3}>
          <CustomerTokenLimitForm />
        </TabPanel>
        <Box
          sx={{
            p: 3,
            alignSelf: "self-end",
            justifyContent: "bottom",
          }}
        >
          {configTab !== 0 && (
            <ButtonGroup
              sx={{
                alignContent: "left",
                justifyContent: "end",
                width: "100%",
                justifyContent: "bottom",
              }}
            >
              <Button
                variant="contained"
                color="warning"
                onClick={() => {
                  groupDispatch({
                    type: "CLEAR_CHANGES",
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  updateCustomer(selectedCustomer);
                }}
              >
                Save
              </Button>
            </ButtonGroup>
          )}
        </Box>
      </Box>
    </span>
  );
};

export default RFIDConfig;
