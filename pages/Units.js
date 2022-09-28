import * as React from "react";
import { Axios } from "./index";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link, useRoutes } from "react-router-dom";
import { ButtonGroup, ListSubheader } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { SvgIcon } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Input from "@mui/material/Input";
import Unit from "../src/components/Units/Unit";
import status_switch from "../src/helpers/status";
import { useNavigate } from "react-router-dom";
import usePersistedReducer from "../src/helpers/hooks";
const initialState = {
  customerList: [],
  selectedCustomer: {},
  selectedCustomerUnits: [],
  selectCustomerUnitsByLocation: {},
  selectedUnit: {},
  selectedField: {},
  IdentityList: [],
  subPage: "CustomerSelect",
};

function reducer(state, action) {
  switch (action.type) {
    case "SELECT_CUSTOMER":
      let unit_collector = [];
      let unit_location_collector = {};
      for (let i = 0; i < action.payload.locations.length; i++) {
        for (
          let j = 0;
          j < action.payload.locations[i].onprem_units.length;
          j++
        ) {
          unit_collector.push(action.payload.locations[i].onprem_units[j]);

          if (
            unit_location_collector[action.payload.locations[i].id] ===
            undefined
          ) {
            unit_location_collector[action.payload.locations[i].id] = [];
          }

          unit_location_collector[action.payload.locations[i].id].push(
            action.payload.locations[i].onprem_units[j]
          );
        }
      }
      return {
        ...state,
        selectedCustomer: action.payload,
        selectedCustomerUnits: unit_collector,
        selectedCustomerUnitsByLocation: unit_location_collector,
        selectedUnit: {},
        subPage: "UnitsView",
      };
    case "SELECT_UNIT":
      return {
        ...state,
        selectedUnit: action.payload,
      };
    case "ADD_AND_SELECT_UNIT":
      let newState = { ...state };
      newState["selectedCustomerUnits"].push(action.payload.unit);
      newState["selectedUnit"] = action.payload.unit;
      return {
        ...newState,
      };
    case "SET_CUSTOMERLIST":
      return { ...state, customerList: action.payload };
    case "SET_SUBPAGE":
      return { ...state, subPage: action.payload };
    case "SET_IDENTITYLIST":
      return { ...state, IdentityList: action.payload };
    default:
      throw new Error("Invalid action type");
  }
}
const StateContext = React.createContext();

const CustomerListView = () => {
  // initialize internal variables & handler functions.
  const { state, dispatch } = React.useContext(StateContext);

  return (
    <div className="CustomerSelect">
      <div className="CustomerList">
        <CustomerList />
      </div>
    </div>
  );
};

const IdentityListView = () => {
  const { state, dispatch } = React.useContext(StateContext);
  const [identity, setIdentity] = React.useState("");
  const handleChange = (event) => {
    setIdentity(event.target.value);
  };
  const navigate = useNavigate();

  React.useEffect(() => {
    Axios.get("/api/unit_identities")
      .then((response) => {
        dispatch({ type: "SET_IDENTITYLIST", payload: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function HandleClick(id) {
    // Sends over to customers unit page
    navigate(`/Units/Identity/${id}`, { replace: true });
  }

  function HandleAdd() {
    // Sends over to customers unit page
    navigate(`/Units/Identity`, { replace: true });
  }

  return (
    <div className="IdentityList">
      <div className="IdentityListHeader">
        <h2>Identities</h2>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Identity</TableCell>
              <TableCell align="right" width={50}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    HandleAdd();
                  }}
                >
                  Add
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.IdentityList.map((identity) => (
              <TableRow
                key={identity.id}
                hover
                onClick={(event) => HandleClick(identity.id)}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {identity.name}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export const CustomerList = () => {
  const { state, dispatch } = React.useContext(StateContext);

  const navigate = useNavigate();

  function HandleClick(id) {
    // Sends over to customers unit page
    navigate(`/Units/Customer/${id}`, { replace: true });
  }

  if (state.customerList.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          maxHeight: 400,
          bgcolor: "background.paper",
        }}
      >
        <div className="IdentityListHeader">
          <h2>Customers</h2>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Subscription</TableCell>
                <TableCell align="left">Description</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxHeight: 400,
        bgcolor: "background.paper",
      }}
    >
      <div className="IdentityListHeader">
        <h2>Customers</h2>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Subscription</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state.customerList.map((customer, index) => {
              console.log(customer);
              return (
                <TableRow
                  key={String(index)}
                  hover
                  onClick={(event) => HandleClick(customer.id)}
                >
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer?.active_subscription?.name}</TableCell>
                  <TableCell>{customer.description}</TableCell>
                  <TableCell>{status_switch(customer.status)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const Units = () => {
  const [error, setError] = React.useState(false);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  // initialize customer list
  React.useEffect(() => {
    Axios.get("/api/customers")
      .then((response) => {
        dispatch({ type: "SET_CUSTOMERLIST", payload: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <StateContext.Provider value={{ state, dispatch }}>
      <Container fixed>
        <CustomerListView />
        <IdentityListView />
      </Container>
    </StateContext.Provider>
  );
};

export default Units;
