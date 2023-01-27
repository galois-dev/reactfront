import RoundBox from "@components/sitecore/RoundBox";
import { Delete, Edit, Label } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  Container,
  FormControl,
  Icon,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  MenuItem,
  Modal,
  ModalRoot,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import style from "@styles/AcctecAdmin.module.scss";
import { Axios } from "@pages/index";
import { useEffect, useMemo, useState } from "react";
import TabPanel from "@components/sitecore/TabPanel";
import status_pill from "@helpers/status_pill";
import { time_delta_on_unit_time } from "@helpers/intl_date";
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

function dataToRow(
  data,
  handleEdit,
  HandleDelete,
  deselectModal,
  modalSelected
) {
  return (
    <TableRow>
      <TableCell>{data.Token}</TableCell>
      <TableCell>
        {data.ControllerGroup?.map((cid, idx) => {
          return (
            <span key={String(idx)}>
              {cid}
              <br />
              <br />
            </span>
          );
        })}
        <span>
          {data.ControllerGroup
            ? data.ControllerGroup[data.ControllerGroup.length - 1]
            : ""}
        </span>
      </TableCell>
      <TableCell>
        {data.Group?.map((group_id, idx) => {
          return idx !== data.Group.length - 1 ? (
            <span key={String(idx)}>
              {group_id}
              <br />
              <br />
            </span>
          ) : (
            <span key={String(idx)}>{group_id}</span>
          );
        })}

        {/* <span>{data.Group[data.Group.length - 1]}</span> */}
      </TableCell>
      <TableCell align="center">{data.NumUses}</TableCell>
      <TableCell align="center">{data.MaxUses}</TableCell>
      <TableCell>{data.LastUse}</TableCell>
      <TableCell>
        {data.Expiration ? time_delta_on_unit_time(data.Expiration) : "Never"}
      </TableCell>
      <TableCell>{status_pill(data.status)}</TableCell>
      <TableCell>{time_delta_on_unit_time(data.date_created, "day")}</TableCell>
      <TableCell align="right">
        <ButtonGroup>
          <IconButton
            variant="contained"
            icon="edit"
            onClick={() => {
              !modalSelected ? handleEdit(data.id) : deselectModal();
            }}
          >
            <Icon>
              <Edit />
            </Icon>
          </IconButton>
          <IconButton
            variant="contained"
            onClick={() => {
              !modalSelected ? HandleDelete(data.id) : deselectModal();
            }}
          >
            <Icon>
              <Delete />
            </Icon>
          </IconButton>
        </ButtonGroup>
      </TableCell>
    </TableRow>
  );
}

async function fetchData(customer) {
  return Axios.get("/api/rfid/").then((res) => {
    return res.data;
  });
}

async function fetchCustomers() {
  // return Axios.get("/api/customers/").then((res) => {
  //   return res?.data;
  // });
  return [
    {
      customerName: "Customer 1",
      id: "12343125321",
      currentTotalUsers: 250,
      currentTempUsers: 70,
      maxTotalUsers: 5000,
      maxTempUsers: 2000,
    },
    {
      customerName: "Customer 2",
      id: "123431253212",
      currentTotalUsers: 550,
      currentTempUsers: 220,
      maxTotalUsers: 13000,
      maxTempUsers: 4000,
    },
    {
      customerName: "Customer 3",
      id: "123431253215",
      currentTotalUsers: 130,
      currentTempUsers: 50,
      maxTotalUsers: 15000,
      maxTempUsers: 7000,
    },
    {
      customerName: "Customer 3",
      id: "123431253215",
      currentTotalUsers: 130,
      currentTempUsers: 50,
      maxTotalUsers: 15000,
      maxTempUsers: 7000,
    },
    {
      customerName: "Customer 3",
      id: "123431253215",
      currentTotalUsers: 130,
      currentTempUsers: 50,
      maxTotalUsers: 15000,
      maxTempUsers: 7000,
    },
  ];
}

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

const somedata = {};

function convertRFIDsIntoChartData(RFIDs) {
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

async function populateGroups(RFIDs) {
  /* This function first extracts all the group IDs from the RFIDs and removes the duplicates. Then it makes a GET request for each group ID using the provided API endpoint. Since the get request is asynchronous, we use promise.all to wait for all the requests to resolve. Then we use the same logic as the previous function to map over the RFIDs and replace the group IDs with the group names. This function returns the updated RFID list.
  Note: This function is asynchronous so you need to use await when you call it.*/
  let groupIDs = RFIDs.reduce((groupIDs, rfid) => {
    groupIDs.push(...rfid.Group);
    return groupIDs;
  }, []);
  groupIDs = [...new Set(groupIDs)]; // Find each unique RFID group ID

  let groupPromises = groupIDs.map(async (groupID) => {
    let group = await Axios.get(`/api/AcctGroup/${groupID}`);
    return group.data;
  }); // Make a GET request for each group ID

  let groups = await Promise.all(groupPromises); // Await in parallel
  let updatedRFIDs = RFIDs.map((rfid) => {
    // Map over the RFID list
    let groupNames = rfid.Group.map((groupID) => {
      let group = groups.find((group) => group.id === groupID);
      return group ? group.Name : null;
    });
    rfid.Group = groupNames;
    return rfid;
  });
  return updatedRFIDs; // Return the updated RFID list
}

export const Admin = () => {
  // REST API return data
  let [data, setData] = useState([]);
  let [customers, setCustomers] = useState([]);
  let [selectedCustomer, setSelectedCustomer] = useState(null);
  // modal states
  let [modalActive, setModalActive] = useState(false);
  let [modalMode, setModalMode] = useState("edit");
  let [modalFormData, setModalFormData] = useState({});
  let [selectedRFID, setSelectedRFID] = useState({});
  // Tab state
  let [tab, setTab] = useState(0);
  let [configTab, setConfigTab] = useState(0);
  // table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Event handlers
  const deselectModal = () => {
    setModalActive(false);
    setModalFormData({});
    setSelectedRFID({});
  };
  const handleEdit = (id) => {
    setModalActive(true);
    setModalMode("edit");
    setSelectedRFID(data.find((item) => item.id === id));
  };
  const handleDelete = (id) => {
    setModalActive(true);
    setModalMode("delete");
    setSelectedRFID(data.find((item) => item.id === id));
  };
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

  // Setup
  useEffect(() => {
    fetchCustomers().then((res) => {
      setCustomers(res);
      setSelectedCustomer(res[0]);
    });
  }, []);
  useEffect(() => {
    fetchData(selectedCustomer).then(async (res) => {
      await populateGroups(res);
      console.log(convertRFIDsIntoChartData(res));
      setData(res);
    });
  }, [selectedCustomer]);
  // Exit condition for useEffect
  if (!data || data.length == 0) return <div>Loading...</div>;
  // Keep at bottom of file
  const rows = data.map((data) => {
    return dataToRow(
      data,
      handleEdit,
      handleDelete,
      deselectModal,
      modalActive
    );
  });

  return (
    <span>
      <Modal
        open={modalActive}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          // background: "rgba(0,0,0,0)",
          // dropShadow: "0px 0px 0px 0px",
          width: 400,
        }}
      >
        <RoundBox sx={{ m: 0, height: "100%", borderRadius: 0, p: 2 }}>
          {modalMode === "edit" ? (
            <div>
              <Typography variant="h5">Edit {selectedRFID["Token"]}</Typography>
              <Typography variant="h6">
                Called: {selectedRFID["Name"]}
              </Typography>
              <br />
              <div className={style.modal_form}></div>
              <FormControl>
                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                <Select label="Status" defaultValue={selectedRFID.status}>
                  <MenuItem value="A">Active</MenuItem>
                  <MenuItem value="I">Inactive</MenuItem>
                </Select>
              </FormControl>
            </div>
          ) : (
            <div>
              <Typography variant="h5">
                Deactivate {selectedRFID["Token"]}
              </Typography>
              <Typography variant="h6">
                Called: {selectedRFID["Name"]}
              </Typography>
              <br />
              <div className={style.modal_form}></div>
              <FormControl></FormControl>
            </div>
          )}
        </RoundBox>
      </Modal>
      <Container
        sx={{
          mt: 3,
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            gap: 2,
          }}
        >
          <RoundBox>
            <List
              dense
              sx={{
                overflowY: "scroll",
                height: "185px",
              }}
            >
              {customers.map((customer, idx) => {
                return customer.id ? (
                  <ListItemButton
                    selected={selectedCustomer.id == customer.id}
                    key={String(idx)}
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                    onClick={() => {
                      setSelectedCustomer(customer);
                    }}
                  >
                    <Typography
                      color="primary.dark"
                      variant="body2"
                      align="center"
                    >
                      {customer.customerName}
                    </Typography>
                  </ListItemButton>
                ) : (
                  ""
                );
              })}
            </List>
          </RoundBox>
          <RoundBox sx={{ width: "100%" }}>
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
              redraw={true}
            />
          </RoundBox>
          <RoundBox sx={{ p: 2 }}>
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
                  {selectedCustomer.currentTempUsers} /
                  {" " + selectedCustomer.maxTempUsers}
                </Typography>
              </ListItem>
              <ListItem sx={{ minWidth: "200px" }}>
                <Typography color="success.main" variant="caption" align="left">
                  Perm users
                </Typography>
                <hr></hr>
                <Typography color="success.light" variant="body1" align="right">
                  {selectedCustomer.currentTotalUsers -
                    selectedCustomer.currentTempUsers +
                    " "}
                  /{" "}
                  {selectedCustomer.maxTotalUsers -
                    selectedCustomer.maxTempUsers}
                </Typography>
              </ListItem>
              <ListItem sx={{ minWidth: "200px" }}>
                <Typography color="success.main" variant="caption" align="left">
                  Total users
                </Typography>
                <hr></hr>
                <Typography color="success.light" variant="body1" align="right">
                  {selectedCustomer.currentTotalUsers} /
                  {" " + selectedCustomer.maxTotalUsers}
                </Typography>
              </ListItem>
            </List>
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
          <RoundBox sx={{ m: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Token</TableCell>
                    <TableCell>Controller Group</TableCell>
                    <TableCell>Group</TableCell>
                    <TableCell>Number of uses</TableCell>
                    <TableCell>Limit of uses</TableCell>
                    <TableCell>Last use date</TableCell>
                    <TableCell>Expiration</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date Created</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </RoundBox>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <RoundBox sx={{ m: 0 }}>
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
                <Typography variant="h5">Config</Typography>
              </TabPanel>
              <TabPanel value={configTab} index={1}>
                <Typography variant="h5">Controller groups</Typography>
              </TabPanel>
              <TabPanel value={configTab} index={2}>
                <Typography variant="h5">Acctec groups</Typography>
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
                    value={selectedCustomer.maxTempUsers}
                    onChange={(event) => {
                      setSelectedCustomer({
                        ...selectedCustomer,
                        maxTempUsers: event.target.value,
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
                    value={selectedCustomer.maxTotalUsers}
                    onChange={(event) => {
                      setSelectedCustomer({
                        ...selectedCustomer,
                        maxTotalUsers: event.target.value,
                      });
                    }}
                  />
                </Box>
              </TabPanel>
            </Box>
            <Box sx={{ p: 3 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  updateCustomer(selectedCustomer);
                }}
              >
                Save
              </Button>
            </Box>
          </RoundBox>
        </TabPanel>
      </Container>
    </span>
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
