import * as React from "react";
import { Unit, IdentityJsonbView } from "./Unit";
import { Axios } from "../../../pages/index";
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
import { ButtonGroup, ListSubheader } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { SvgIcon } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Input from "@mui/material/Input";
import status_switch from "../../helpers/status";

const initialState = {
  customerList: [],
  selectedCustomer: {},
  selectedCustomerUnits: [],
  selectCustomerUnitsByLocation: {},
  selectedUnit: {},
  selectedField: {},
  IdentityList: [],
  subPage: "UnitForm",
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
      let unit_field_collector = {};
      let grouped_field_tuples = [];

      for (let i = 0; i < action.payload.fields.length; i++) {
        const element = action.payload.fields[i];
        if (unit_field_collector[element.name] === undefined) {
          unit_field_collector[element.name] = [];
        }
        unit_field_collector[element.name].push(element);
      }

      Object.values(unit_field_collector).forEach((field_list) => {
        field_list = field_list.sort((a, b) => {
          return new Date(a.date_created) - new Date(b.date_created);
        });
        grouped_field_tuples.push([field_list[0].name, field_list]);
      });
      action.payload.grouped_field_tuples = grouped_field_tuples;

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

const UnitsView = () => {
  const { state, dispatch } = React.useContext(StateContext);

  return (
    <div className="Units">
      <UnitsTopBar />
      <UnitsSideBar />
      {state.subPage === "UnitForm" ? (
        <UnitForm />
      ) : (
        <Unit unit={state.selectedUnit} />
      )}
    </div>
  );
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
        <List
          sx={{
            bgcolor: "background.paper",
            position: "relative",
            overflow: "auto",
            maxHeight: "80vh",
          }}
          subheader={<li />}
        >
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
                            selected={state.selectedUnit.id === unit.id}
                            key={unit.id}
                            className="UnitSideBar__list-item"
                            onClick={(e) => {
                              dispatch({
                                type: "SELECT_UNIT",
                                payload: unit,
                              });
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

const UnitForm = () => {
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

const UnitsTopBar = () => {
  return <div className="UnitsTopBar">Unit Details</div>;
};

const Units = () => {
  const [error, setError] = React.useState(false);
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { id } = useParams("id");
  // initialize customer list
  React.useEffect(() => {
    Axios.get("/api/customers/" + id)
      .then((response) => {
        dispatch({ type: "SELECT_CUSTOMER", payload: response.data });
        if (response.data.locations.length > 0) {
          if (response.data.locations[0].onprem_units.length > 0) {
            dispatch({
              type: "SELECT_UNIT",
              payload: response.data.locations[0].onprem_units[0],
            });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (Object.keys(state.selectedCustomer).length === 0) {
    return <></>;
  }

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      <Container>
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
