import * as React from "react";
import "./Units.scss";
import { Axios } from "../../App";
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
import { Link } from "react-router-dom";
import { ButtonGroup, ListSubheader } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { SvgIcon } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Input from "@mui/material/Input";
import Unit from "./Unit";

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

function customerLocationIdToObject(customer, locationId) {
  if (customer === undefined) {
    return {};
  }
  if (customer.locations === undefined) {
    return {};
  }
  for (let i = 0; i < customer.locations.length; i++) {
    if (customer.locations[i].id === locationId) {
      return customer.locations[i];
    }
  }
}

const UnitForm = () => {
  // #TODO: Add form for creating new unit
  // #TODO2: Persist form data to backend
  const { state, dispatch } = React.useContext(StateContext);
  const [formData, setFormData] = React.useState({});

  React.useEffect(() => {
    Axios.get("/api/unit_identities").then((res) => {
      dispatch({ type: "SET_IDENTITYLIST", payload: res.data });
    });
  }, []);

  function CancelUnit() {
    dispatch({ type: "SET_SUBPAGE", payload: "UnitsView" });
  }

  function CreateUnit() {
    Axios.post("/api/unit_CU/", {
      status: formData.status,
      location: formData.location,
      identity_id: formData.identity,
      identity: formData.identity,
    }).then((res) => {
      Axios.get("/api/customers").then((reslist) => {
        dispatch({ type: "SET_CUSTOMERLIST", payload: reslist.data });
        dispatch({ type: "SET_SUBPAGE", payload: "UnitsView" });
        let newCustomer = reslist.data.find((customer) => {
          return customer.id == state.selectedCustomer.id;
        });
        dispatch({
          type: "SELECT_CUSTOMER",
          payload: newCustomer,
        });
        dispatch({
          type: "SELECT_UNIT",
          payload: {
            ...formData,
            id: res.data.id,
            identity: state.IdentityList.find((ident) => {
              return ident.id === formData.identity;
            }),
          },
        });
      });
      // dispatch({ type: "SELECT_CUSTOMER", payload: state.selectedCustomer });
    });
  }

  return (
    <div className="unitsform__container">
      <div className="unitsform__content">
        <form>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => {
                setFormData({ ...formData, status: e.target.value });
              }}
            >
              <MenuItem value="A">Active</MenuItem>
              <MenuItem value="I">Inactive</MenuItem>
              <MenuItem value="D">Deleted</MenuItem>
              <MenuItem value="P">Pending</MenuItem>
              <MenuItem value="R">Review</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Location</InputLabel>
            <Select
              onChange={(e) => {
                setFormData({ ...formData, location: e.target.value });
              }}
            >
              {state.selectedCustomer.locations.map((location) => {
                return (
                  <MenuItem value={location.id}>{location.address}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Identity</InputLabel>
            <Select
              onChange={(e) => {
                setFormData({ ...formData, identity: e.target.value });
              }}
            >
              {state.IdentityList.map((identity) => {
                return <MenuItem value={identity.id}>{identity.name}</MenuItem>;
              })}
            </Select>
            {formData?.identity ? (
              <IdentityJsonbView
                identity={state.IdentityList.find((ident) => {
                  return ident.id === formData.identity;
                })}
              />
            ) : null}
          </FormControl>
          <FormControl fullWidth>
            <ButtonGroup>
              <Button
                variant="outlined"
                onClick={() => {
                  CancelUnit();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  CreateUnit();
                }}
              >
                Create
              </Button>
            </ButtonGroup>
          </FormControl>
        </form>
      </div>
    </div>
  );
};

export const IdentityJsonbView = ({ identity }) => {
  let childRows = [];

  Object.keys(JSON.parse(identity.field_jsonb)).forEach((field) => {
    childRows.push({
      field: field,
      value: JSON.parse(identity.field_jsonb)[field].value,
      type: JSON.parse(identity.field_jsonb)[field].type,
      meta: JSON.parse(identity.field_jsonb)[field].meta,
    });
  });

  const RowItem = ({ field, value, type, meta }) => {
    return (
      <TableRow>
        <TableCell>{field}</TableCell>
        <TableCell>{type}</TableCell>
        <TableCell>{typeof value === "Object" ? value : ""}</TableCell>
        <TableCell>{typeof meta === "Object" ? meta : ""}</TableCell>
      </TableRow>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Field Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Default Value</TableCell>
            <TableCell>Meta Options</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {childRows.map((row, index) => {
            return (
              <RowItem
                key={index}
                field={row.field}
                value={row.value}
                type={row.type}
                meta={row.meta}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const UnitsSideBar = () => {
  const { state, dispatch } = React.useContext(StateContext);
  const [hoverAddButton, setHoverAddButton] = React.useState(false);

  function HandleMouseOver() {
    setHoverAddButton(true);
  }

  function HandleMouseOut() {
    setHoverAddButton(false);
  }

  function HandleOnClick() {
    dispatch({ type: "SET_SUBPAGE", payload: "UnitForm" });
  }

  React.useEffect(() => {
    if (state.selectedCustomerUnits === undefined) {
      return <></>;
    }
  }, [state.selectedCustomer]);

  return (
    <div className="UnitSideBar">
      <div className="UnitSideBar__header">
        <span className="UnitSideBar__header__title">Unit List</span>
        <span
          className="UnitSideBar__header__addButton"
          onClick={() => {
            HandleOnClick();
          }}
          onMouseOver={() => {
            HandleMouseOver();
          }}
          onMouseOut={() => {
            HandleMouseOut();
          }}
        >
          {hoverAddButton === true ? (
            <SvgIcon component={AddCircleIcon} />
          ) : (
            <SvgIcon component={AddCircleOutlineIcon} />
          )}
        </span>
      </div>
      <div className="UnitSideBar__list">
        <List>
          {Object.keys(state.selectedCustomerUnitsByLocation).map(
            (locationKey, Lindex) => {
              return (
                <li key={Lindex.toString()}>
                  <ul>
                    <ListSubheader>
                      {
                        customerLocationIdToObject(
                          state.selectedCustomer,
                          locationKey
                        ).address
                      }
                    </ListSubheader>
                    {state.selectedCustomerUnitsByLocation[locationKey].map(
                      (unit, index) => {
                        return (
                          <ListItem
                            key={unit.id}
                            className="UnitSideBar__list-item"
                            onClick={(e) => {
                              dispatch({ type: "SELECT_UNIT", payload: unit });
                            }}
                            button
                          >
                            <ListItemText>
                              {unit?.identity?.name + " " + (index + 1)}
                            </ListItemText>
                          </ListItem>
                        );
                      }
                    )}
                  </ul>
                </li>
              );
            }
          )}
        </List>
      </div>
    </div>
  );
};

const UnitsTopBar = () => {
  return <div className="UnitsTopBar">Unit Details</div>;
};

const UnitsDetailView = ({ unit }) => {
  return <Unit unit={unit} />;
};

const IdentityView = () => {
  const { state, dispatch } = React.useContext(StateContext);
  if (
    state.selectedUnit === undefined ||
    state.selectedUnit.identity === undefined
  ) {
    return <></>;
  }

  return (
    <div className="IdentityView">
      <div className="IdentityView__header">
        Unit identity for {state.selectedUnit.id}
      </div>
      <div className="IdentityView__content">
        <IdentityJsonbView identity={state.selectedUnit.identity} />
      </div>
    </div>
  );
};

const UnitsView = () => {
  const { state, dispatch } = React.useContext(StateContext);

  return (
    <div className="Units">
      <UnitsTopBar />
      <UnitsSideBar />
      {state.subPage === "UnitForm" ? (
        <UnitForm />
      ) : (
        <UnitsDetailView unit={state.selectedUnit} />
      )}
    </div>
  );
};

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

export const CustomerList = () => {
  const { state, dispatch } = React.useContext(StateContext);

  if (state.customerList.length === 0) {
    return <></>;
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: 400,
        maxWidth: 360,
        bgcolor: "background.paper",
      }}
    >
      <List height={400} width={360} dense={true}>
        {state.customerList.map((customer, index) => {
          return (
            <Link
              key={customer.id}
              to={`/units?customer=${customer.id}`}
              onClick={() => {
                dispatch({ type: "SELECT_CUSTOMER", payload: customer });
              }}
            >
              <ListItemButton
                className="CustomerList__item"
                selected={state.selectCustomer?.id === customer.id}
              >
                <ListItemText
                  style={{
                    textAlign: "center",
                  }}
                  primary={customer.name}
                />
              </ListItemButton>
            </Link>
          );
        })}
      </List>
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
        console.log(response);
        // dispatch({ type: "SELECT_CUSTOMER", payload: response.data[0] });
        dispatch({ type: "SET_CUSTOMERLIST", payload: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <StateContext.Provider value={{ state, dispatch }}>
      <Container fixed>
        {
          {
            true: (
              <Box>
                <Button
                  onClick={() => {
                    dispatch({
                      type: "SET_SUBPAGE",
                      payload: "CustomerView",
                    });
                  }}
                >
                  Back
                </Button>
              </Box>
            ),
            false: <></>,
          }[String(state.subPage === "CustomerView")]
        }
        {
          {
            CustomerSelect: <CustomerListView />,
            UnitsView: <UnitsView />,
            UnitForm: <UnitsView />,
            IdentityView: <IdentityView />,
          }[state.subPage]
        }
      </Container>
    </StateContext.Provider>
  );
};

export default Units;
