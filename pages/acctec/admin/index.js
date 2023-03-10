import RoundBox from "@components/sitecore/RoundBox";
import { CheckBox, Delete, Edit, Label, Summarize } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import style from "@styles/AcctecAdmin.module.scss";
import { Axios } from "@pages/index";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import TabPanel from "@components/sitecore/TabPanel";
// Chart shit
import { faker } from "@faker-js/faker";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Box } from "@mui/system";
import RFIDModal from "@components/acctec/RFIDModal";
import RFIDTable from "@components/acctec/RFIDTable";
import RFIDMeta from "@components/acctec/RFIDMeta";
import RFIDConfig from "@components/acctec/RFIDConfig";
import RFIDCustomerSelect from "@components/acctec/RFIDCustomerSelect";
import RFIDSearch from "@components/acctec/RFIDSearch";
import { time_delta_on_unit_time } from "@helpers/intl_date";
import { listRFID } from "@network/RFID";
import { getAcctecGroup, listAcctecGroup } from "@network/acctec_group";
import { listCustomer } from "@network/customer";
import { listAcctecConfig } from "@network/acctec_config";
import {
  getControllerGroup,
  listControllerGroup,
} from "@network/controller_group";
import RFIDOptions from "@components/acctec/RFIDOptions";
import LoadingPage from "@components/sitecore/LoadingPage";
import LoadingComponent from "@components/sitecore/LoadingComponent";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
import {
  useSelectedCustomerContext,
  useSelectedCustomerDispatchContext,
} from "@state/selectedCustomer";
import SelectedRFIDProvider, {
  useSelectedRFIDContext,
  useSelectedRFIDDispatchContext,
} from "@state/selectedRFID";
import { AdminProvider } from "@state/AdminProvider";
import { useConfigGroup } from "@state/ConfigGroups";

// Chart helpers
export const options = {
  responsive: true,
  plugins: {
    filler: {
      propagate: true,
    },
  },
  fill: true,
  tension: 0.5,
  scale: {
    yAxis: "linear",
    ticks: {
      major: true,
    },
  },
  backgroundColor: "rgba(255, 0, 0, 0.5)",
};
const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function convertRFIDsIntoChartData(RFIDs) {
  if (RFIDs === undefined) return [];
  if (!(RFIDs.length >= 0)) return [];
  // Map the date_created field of each RFID to the "labels" variable.
  let newLabels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  newLabels = newLabels.map((label) => {
    // For each label, count the number of RFIDs that have the same date_created field.
    let count = 0;
    RFIDs.map((rfid) => {
      if (new Date(rfid.date_created).getMonth() === newLabels.indexOf(label)) {
        count += 1;
      }
    });
    return count;
  });

  // Compute the integral of newLabels
  for (let i = 1; i < newLabels.length; i++) {
    newLabels[i] = newLabels[i] + newLabels[i - 1];
  }

  return newLabels;
}
// Fetch and Transforms
const fetchData = async (customer) => await listRFID();
const fetchCustomers = async () => await listAcctecConfig();
const fetchAcctecGroups = async () => await listAcctecGroup();
const fetchControllerGroups = async () => await listControllerGroup();
async function populateGroups(RFIDs) {
  /* This function first extracts all the group IDs from the RFIDs and removes the duplicates. Then it makes a GET request for each group ID using the provided API endpoint. Since the get request is asynchronous, we use promise.all to wait for all the requests to resolve. Then we use the same logic as the previous function to map over the RFIDs and replace the group IDs with the group names. This function returns the updated RFID list.
  Note: This function is asynchronous so you need to use await when you call it.*/

  if (RFIDs === undefined) return []; // pass args or get rekt
  if (!(RFIDs.length >= 0)) return []; // Look strange, dont question it
  let updatedRFIDs = RFIDs;

  let groupIDs = RFIDs.reduce((groupIDs, rfid) => {
    groupIDs.push(...rfid.Group);
    return groupIDs;
  }, []);
  groupIDs = [...new Set(groupIDs)]; // Find each unique RFID group ID
  // If there are no groups, return the RFID list (no need to make any
  if (groupIDs.length !== 0) {
    let groupPromises = groupIDs.map(async (groupID) => {
      let group = getAcctecGroup(groupID);
      return group;
    }); // Make a GET request for each group ID

    let groups = await Promise.all(groupPromises); // Await in parallel
    updatedRFIDs = RFIDs.map((rfid) => {
      // Map over the RFID list
      rfid._Group = rfid.Group; // Store the original group IDs
      let groupNames = rfid.Group.map((groupID) => {
        let group = groups.find((group) => group.id === groupID);
        return group ? group.Name : null;
      });
      rfid.Group = groupNames;
      return rfid;
    });
  }

  let controllerGroupIDs = RFIDs.reduce((controllerGroupIDs, rfid) => {
    controllerGroupIDs.push(rfid.ControllerGroup);
    return controllerGroupIDs;
  }, []);
  controllerGroupIDs = [...new Set(controllerGroupIDs)]; // Find each unique RFID group ID
  if (controllerGroupIDs.length !== 0) {
    let controllerGroupPromises = controllerGroupIDs.map(async (groupID) => {
      let group = getControllerGroup(groupID);
      return group;
    }); // Make a GET request for each group ID

    let groups = await Promise.all(controllerGroupPromises); // Await in parallel
    updatedRFIDs = RFIDs.map((rfid) => {
      // Map over the RFID list
      rfid._ControllerGroup = rfid.ControllerGroup; // Store the original group IDs
      let CgroupObj = groups.find((group) => group.id === rfid.ControllerGroup);

      rfid.ControllerGroup = CgroupObj.Name;
      return rfid;
    });
  }

  return updatedRFIDs; // Return the updated RFID list
}
async function calculateCursoryStats(data) {
  // This function calculates the percentage of active users, the total number of users, the average age of users, the size of each group, and the age of the newest and oldest users.
  const default_return = {
    activePct: 0,
    totalSize: 0,
    groupSizes: 0,
    avgAge: 0,
    newest: 0,
    oldest: 0,
  };
  if (data === undefined) return default_return;
  if (!(data.length >= 0)) return default_return;

  // Calculate the percentage of people who are currently active
  let activePct =
    data.filter((item) => item.status === "A").length / data.length;
  let totalSize = data.length;
  // Calculate the size of each unique group and sort them in descending order
  let groupSizes = data.reduce((groupSizes, item) => {
    item.Group.map((group) => {
      if (groupSizes[group]) {
        groupSizes[group] += 1;
      } else {
        groupSizes[group] = 1;
      }
    });
    return groupSizes;
  }, {});
  groupSizes = Object.entries(groupSizes).sort((a, b) => b[1] - a[1]);

  // Compute average age of the rifd users
  let avgAge = data.reduce((sum, item) => {
    // Compute the time elapsed from data_created
    let timeElapsed = new Date() - new Date(item.date_created);
    // Convert the time elapsed to days
    let daysElapsed = timeElapsed / (1000 * 3600 * 24);
    return daysElapsed + sum;
  }, 0);
  avgAge = Math.round(avgAge / data.length);

  // Find the newest and oldest RFID
  let newest = data.reduce((newest, item) => {
    if (new Date(item.date_created) > new Date(newest.date_created)) {
      return item;
    } else {
      return newest;
    }
  });
  let oldest = data.reduce((oldest, item) => {
    if (new Date(item.date_created) < new Date(oldest.date_created)) {
      return item;
    } else {
      return oldest;
    }
  });
  newest = time_delta_on_unit_time(newest.date_created);
  oldest = time_delta_on_unit_time(oldest.date_created);

  return { activePct, totalSize, groupSizes, avgAge, newest, oldest };
}
// search function
function filterData(data, searchString) {
  return data.filter((item) => {
    return (
      (item.Active !== null && item.Active.toString().includes(searchString)) ||
      (item.ControllerGroup !== null &&
        String(item.ControllerGroup)
          .toLowerCase()
          .includes(searchString.toLowerCase())) ||
      (item.Group !== null && item.Group.includes(searchString)) ||
      (item.Phone !== null && item.Phone.includes(searchString)) ||
      (item.Token !== null && item.Token.includes(searchString)) ||
      (item.Name !== null && item.Name.includes(searchString))
    );
  });
}

export const AdminController = () => {
  // REST API return data
  let [data, setData] = useState([]);
  let [dataFiltered, setDataFiltered] = useState([]);
  let [customers, setCustomers] = useState([]);
  let selectedCustomerContext = useSelectedCustomerContext();
  let selectedCustomerDispatch = useSelectedCustomerDispatchContext();
  let [groupContext, groupDispatch] = useConfigGroup();
  let [controllerGroups, setControllerGroups] = useState([]);
  let [acctecGroups, setAcctecGroups] = useState([]);
  let [cursoryStats, setCursoryStats] = useState([]);
  // modal states
  let [modalActive, setModalActive] = useState(false);
  let [modalMode, setModalMode] = useState("edit");
  let [modalFormData, setModalFormData] = useState({});
  let selectedRFIDContext = useSelectedRFIDContext();
  let selectedRFIDDispatch = useSelectedRFIDDispatchContext();

  // Tab state
  let [tab, setTab] = useState(0);
  let [configTab, setConfigTab] = useState(0);
  // table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // search state
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  // table options state
  const [showDeleted, setShowDeleted] = useState(true);
  const [showActive, setShowActive] = useState(true);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Event handlers
  const pushEdit = (id) => {
    Axios.put("/api/rfid/" + id, modalFormData).then((res) => {
      // update data array and update state
      setData(
        data.map((item) => {
          if (item.id === id) {
            return res.data;
          }
          return item;
        })
      );
    });
  };
  const pushDelete = (id) => {
    Axios.delete("/api/rfid/" + id).then((res) => {
      // remove from data array and update state
      setData(data.filter((item) => item.id !== id));
    });
  };

  //#TODO: fix the race condition in setup useffect

  // Setup
  useEffect(() => {
    fetchCustomers().then((res) => {
      setCustomers(res);
      selectedCustomerDispatch({ type: "SET", payload: res[0] });
    });
  }, []);
  // Groups calls
  useEffect(() => {
    fetchAcctecGroups().then((res) => {
      setAcctecGroups(res);
      groupDispatch({ type: "SET_ACCTEC_GROUPS", payload: res });
    });
    fetchControllerGroups().then((res) => {
      setControllerGroups(res);
      groupDispatch({ type: "SET_CONTROLLER_GROUPS", payload: res });
    });
  }, [selectedCustomerContext?.selectedCustomer?.id]);
  // Data calls
  useEffect(() => {
    fetchData(selectedCustomerContext.selectedCustomer).then(async (res) => {
      await populateGroups(res);
      await setData(res);
      let cursoryStatsHold = await calculateCursoryStats(res);
      await setCursoryStats(cursoryStatsHold);
    });
  }, [selectedCustomerContext?.selectedCustomer?.id]);
  // Search calls
  useEffect(() => {
    if (search !== "") {
      setSearchResults(filterData(data, search));
    } else {
      setSearchResults(data);
    }
  }, [search, data]);
  // table options calls
  useEffect(() => {
    if (showDeleted && showActive) {
      setDataFiltered(data);
    } else if (showDeleted && !showActive) {
      setDataFiltered(data.filter((item) => !(item.status === "A")));
    } else if (!showDeleted && showActive) {
      setDataFiltered(data.filter((item) => !(item.status === "D")));
    } else {
      setDataFiltered(
        data.filter((item) => !(item.status === "D" || item.status === "A"))
      );
    }
  }, [data, showDeleted, showActive]);

  // Exit condition for useEffect
  if (!data || data.length == 0) return <LoadingPage />;

  return (
    <span>
      <RFIDModal
        acctecGroups={acctecGroups}
        controllerGroups={controllerGroups}
      />
      <Container
        sx={{
          mt: 3,
        }}
      >
        <Container className={style.top_container}>
          <RoundBox>
            <RFIDCustomerSelect customers={customers} />
          </RoundBox>
          <RoundBox
            sx={{
              width: "100%",
              display: "grid",
              justifyContent: "center",
            }}
          >
            <Line
              options={options}
              data={{
                labels,
                datasets: [
                  {
                    label: "total active users",
                    data: convertRFIDsIntoChartData(data),
                    borderColor: "rgb(255, 99, 132)",
                    backgroundColor: "rgba(255, 99, 132, 0.5)",
                  },
                ],
              }}
              height={80}
            />
          </RoundBox>
          <RoundBox sx={{ p: 2 }}>
            <RFIDMeta RFIDS={data} />
          </RoundBox>
        </Container>
      </Container>
      <Container>
        <RoundBox sx={{ ml: 3, mr: 3, mb: -1, mt: -1, p: 0 }}>
          <Tabs
            variant="fullWidth"
            centered
            value={tab}
            sx={{
              pl: 1,
              pr: 1,
            }}
            onChange={() => {
              setTab(tab === 0 ? 1 : 0);
            }}
          >
            <Tab value={0} label="rfids" />
            <Tab value={1} label="config" />
          </Tabs>
        </RoundBox>
        <TabPanel value={tab} index={0}>
          <RoundBox
            sx={{ m: 0, pt: 2, display: "flex", flexDirection: "column" }}
          >
            <Container
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <RFIDOptions>
                <Box sx={{ p: 1 }}>
                  <FormGroup fullWidth>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={showDeleted}
                          defaultChecked={showDeleted}
                          onChange={() => {
                            setShowDeleted(!showDeleted);
                          }}
                        />
                      }
                      label="Show Deleted"
                    />
                  </FormGroup>
                  <FormGroup fullWidth>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={showActive}
                          defaultChecked={showActive}
                          onChange={() => {
                            setShowActive(!showActive);
                          }}
                        />
                      }
                      label="Show Active"
                    />
                  </FormGroup>
                </Box>
              </RFIDOptions>
              <div>
                {/* <RFIDSearch
                  searchText={search}
                  setSearchText={setSearch}
                  options={searchResults}
                  /> */}
              </div>
              <Button>{search ? "Clear" : ""}</Button>
            </Container>
            {data.length > 0 ? (
              <RFIDTable
                data={dataFiltered}
                rowsPerPage={rowsPerPage}
                page={page}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
              />
            ) : (
              <LoadingComponent />
            )}
          </RoundBox>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <RoundBox sx={{ m: 0 }}>
            <RFIDConfig
              configTab={configTab}
              setConfigTab={setConfigTab}
              updateCustomer={pushEdit}
              cursoryStats={cursoryStats}
            />
          </RoundBox>
        </TabPanel>
      </Container>
    </span>
  );
};

export const Admin = () => {
  return (
    <AdminProvider>
      <AdminController />
    </AdminProvider>
  );
};

export default Admin;

/* 
Active: true
Card: null
ConnectedUser: null
ControllerGroup: null
Expiration: null
Group: ["1e9672a4-0a4d-4c79-9c4b-99bdc854e090", "296e94d6-c643-46f6-b0ea-8680f149be29",…]
LastUse: null
LatestAccess: null
MaxUses: 1
Name: null
NumUses: 0
Phone: null
TempUser: null
Token: "ger"
Units: null
UserID: null
Zones: null
admin_note: null
date_created: "2022-10-06T06:28:51.844305Z"
date_modified: "2022-10-06T06:29:45.419736Z"
id: "20cc0d58-3887-483e-bd42-79690e9e535a"
status: "A"
user_created: null
user_modified: null 
*/
