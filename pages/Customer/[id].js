import * as React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Axios } from "@pages/index";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import ButtonGroup from "@mui/material/ButtonGroup";
import { ErrorBoundary } from "react-error-boundary";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SvgIcon from "@mui/material/SvgIcon";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import LocationView from "@/components/HR/Location.js";
import status_switch from "@helpers/status";
import { useRouter } from "next/router";
import RoundBox from "@components/sitecore/RoundBox";
const initialState = {
  customerList: [],
  current_customer: {},
  subPage: "CustomerList",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CUSTOMER_LIST":
      return { ...state, customerList: action.payload };
    case "SET_CURRENT_CUSTOMER":
      return { ...state, current_customer: action.payload };
    case "SET_SUBPAGE":
      return { ...state, subPage: action.payload };
    default:
      return state;
  }
}

const StateContext = React.createContext(initialState);

const UserColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "email", headerName: "Email", width: 100 },
  {
    field: "username",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    // valueGetter: (params) =>
    //   `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
  {
    field: "is_active",
    headerName: "Active",
    width: 70,
  },
  {
    field: "is_staff",
    headerName: "Staff",
    width: 70,
  },
  {
    field: "first_name",
    headerName: "First name",
    width: 100,
  },
  {
    field: "last_name",
    headerName: "Last name",
    width: 100,
  },
  {
    field: "date_joined",
    headerName: "Joined",
    width: 150,
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 150,
  },
];
const LocationColumns = [
  { field: "name", headerName: "Name", width: 250 },
  { field: "status", headerName: "status", width: 80 },
  { field: "city", headerName: "city", width: 100 },
  { field: "state", headerName: "state", width: 100 },
  { field: "notes", headerName: "notes", width: 100 },
  { field: "zipcode", headerName: "zipcode", width: 100 },
  { field: "address", headerName: "address", width: 250 },
  { field: "date_created", headerName: "date_created", width: 150 },
  { field: "user_created", headerName: "user_created", width: 100 },
];

function ErrorHandler({ error }) {
  return (
    <div role="alert">
      <p>An error occurred:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

const CustomerView = ({}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const router = useRouter();
  const { id } = router.query;

  React.useEffect(() => {
    Axios.get("api/customers/" + id).then((res) => {
      // res.data = res.data.map((customer) => {
      //   return {
      //     ...customer,
      //     num_locations: customer.locations?.length,
      //     num_users: customer?.user_list.length,
      //   };
      // });
      dispatch({ type: "SET_CURRENT_CUSTOMER", payload: res.data });
    });
  }, []);

  function StatusSwitch(status) {
    switch (status) {
      case "A":
        return "Active";
      case "I":
        return "Inactive";
      case "D":
        return "Deleted";
      case "P":
        return "Pending";
      case "S":
        return "Suspended";
      case "R":
        return "Review";
      default:
        return "";
    }
  }

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      <Container fixed>
        <RoundBox sx={{ width: "100%", bgcolor: "#ffffff", pt: 1 }}>
          <ErrorBoundary FallbackComponent={ErrorHandler}>
            <div className="CustomerView__container">
              <div className="CustomerView__profile">
                <img src="https://picsum.photos/200" alt="profile" />
                <div className="CustomerView__profile__info">
                  {state.current_customer.name}
                </div>
              </div>
              <div className="CustomerView__info">
                <div className="CustomerView__info__item">
                  {state.current_customer.description}
                </div>
                <div className="CustomerView__info__item">
                  Status: {StatusSwitch(state.current_customer.status)}
                </div>
                <div className="CustomerView__info__item">
                  {state.current_customer?.locations?.length} Location
                  {state.current_customer?.locations?.length > 1 ? "s" : ""}
                </div>
                <div className="CustomerView__info__item">
                  Date created:{" "}
                  {new Date(
                    state.current_customer.date_created
                  ).toLocaleDateString()}
                </div>
                <div className="CustomerView__info__item">
                  Created by: {state.current_customer.user_created}
                </div>
                <div className="CustomerView__info__item">
                  {state.current_customer?.user_list?.length} User
                  {state.current_customer?.user_list?.length > 1 ? "s" : ""}
                </div>
              </div>
              <div className="CustomerView__subscription">
                <ErrorBoundary FallbackComponent={ErrorHandler}>
                  <SubscriptionBadge
                    subscription={state.current_customer.active_subscription}
                  />
                </ErrorBoundary>
              </div>
              <div className="CustomerView__lists">
                <ErrorBoundary FallbackComponent={ErrorHandler}>
                  <CustomerUserList users={state.current_customer.user_list} />
                </ErrorBoundary>
              </div>
              <div className="CustomerView__locations">
                <ErrorBoundary FallbackComponent={ErrorHandler}>
                  <CustomerLocationTabs
                    locations={
                      state.current_customer?.locations?.length > 0
                        ? state.current_customer.locations
                        : []
                    }
                  />
                </ErrorBoundary>
              </div>
            </div>
          </ErrorBoundary>
        </RoundBox>
      </Container>
    </StateContext.Provider>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const CustomerLocationTabs = ({ locations }) => {
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  if (
    locations === undefined ||
    typeof locations !== "object" ||
    locations.length === 0
  ) {
    return <p>Not loaded</p>;
  }

  return (
    <Box className="CustomerListsTabs">
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} variant="scrollable">
          {locations.map((location, index) => {
            return <Tab label={location.address} key={index} />;
          })}
        </Tabs>
      </Box>
      {locations.map((location, index) => {
        return (
          <TabPanel value={value} index={index} key={String(index)}>
            <LocationView location={location} />
          </TabPanel>
        );
      })}
    </Box>
  );
};

const CustomerUserList = ({ users }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState("add");
  if (users === undefined) {
    return null;
  }

  function handleClose() {
    setModalOpen(false);
  }

  function handleAdd(event) {
    setModalOpen(true);
  }

  function handleDelete(event) {
    console.log(event);
  }

  function handleEdit(event) {
    console.log(event);
  }

  return (
    <RoundBox sx={{ bgcolor: "#ffffff" }}>
      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <RoundBox
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "whitesmoke",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add user
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </RoundBox>
      </Modal>
      <TableContainer
        component={Paper}
        sx={{ maxHeight: "300px", width: "100%" }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Username</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="right">ID</TableCell>
              <TableCell align="right">Date joined</TableCell>
              <TableCell align="center">Is staff</TableCell>
              <TableCell align="center">Is active</TableCell>
              <TableCell align="center">
                <IconButton color="success" onClick={handleAdd}>
                  <SvgIcon component={PersonAddAlt1Icon} />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              return (
                <TableRow
                  key={user.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left" component="th" scope="row">
                    {user.username}
                  </TableCell>
                  <TableCell align="left">{user.email}</TableCell>
                  <TableCell align="right">{user.id}</TableCell>
                  <TableCell align="right">
                    {
                      // Date to string dd/mm/yy
                      new Date(user.date_joined).toLocaleDateString()
                    }
                  </TableCell>
                  <TableCell align="center">
                    {user.is_staff ? (
                      <SvgIcon
                        color="success"
                        variant="contained"
                        component={CheckIcon}
                      />
                    ) : (
                      <SvgIcon
                        color="error"
                        variant="contained"
                        component={CloseIcon}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {user.is_active ? (
                      <SvgIcon color="success" component={CheckIcon} />
                    ) : (
                      <SvgIcon
                        variant="contained"
                        color="error"
                        component={CloseIcon}
                      />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <ButtonGroup>
                      <IconButton color="warning" onClick={handleEdit}>
                        <SvgIcon component={EditIcon} />
                      </IconButton>
                      <IconButton color="error" onClick={handleDelete}>
                        <SvgIcon component={DeleteForeverIcon} />
                      </IconButton>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </RoundBox>
  );
};

const CustomerLocationList = ({ locations }) => {
  return (
    <RoundBox sx={{ width: "100%", height: "350px", bgcolor: "#ffffff" }}>
      <DataGrid
        autoheight
        rows={locations}
        columns={LocationColumns}
        rowsPerPageOptions={[15, 25, 50, 100, 500, 1000]}
      />
    </RoundBox>
  );
};

const SubscriptionBadge = ({ subscription }) => {
  function renewal_switch(params) {
    switch (params) {
      case "A":
        return "Annual";
      case "H":
        return "Half Yearly";
      case "Q":
        return "Quarterly";
      case "M":
        return "Monthly";
      case "B":
        return "Bi-yearly";
      default:
        return "Not Found";
        break;
    }
  }

  if (subscription === undefined) {
    return <p>Sub not found</p>;
  }

  return (
    <Card sx={{ minWidth: 125 }}>
      <ErrorBoundary FallbackComponent={ErrorHandler}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Subscription Status
          </Typography>
          <Typography variant="h5" component="div">
            {typeof subscription?.status !== undefined && subscription?.status
              ? status_switch(subscription.status)
              : "Not found"}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Renews -{" "}
            {subscription?.renewal
              ? renewal_switch(subscription.renewal)
              : "Not found"}
          </Typography>
          <Typography variant="body2">
            {subscription?.description ? subscription.description : "Not found"}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">See more options</Button>
        </CardActions>
      </ErrorBoundary>
    </Card>
  );
};

export default CustomerView;
