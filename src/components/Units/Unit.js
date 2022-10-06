import * as React from "react";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import BuildIcon from "@mui/icons-material/Build";
import ListItemIcon from "@mui/material/ListItemIcon";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Rating from "@mui/material/Rating";
import { FieldBodyRow, InputHeaderRow } from "./UnitFields";
import { Input } from "@mui/material";

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
      if (Object.keys(action.payload).length !== 0) {
        let unit_field_collector = {};
        let grouped_field_tuples = [];

        for (let i = 0; i < action.payload.fields.length; i++) {
          const element = action.payload.fields[i];
          if (unit_field_collector[element.name] === undefined) {
            unit_field_collector[element.name] = [];
          }
          unit_field_collector[element.name].push(element);
        }
        console.log(unit_field_collector);
        Object.values(unit_field_collector).forEach((field_list) => {
          field_list = field_list.sort((a, b) => {
            return new Date(a.date_created) - new Date(b.date_created);
          });
          // field_list = field_list.reverse();
          grouped_field_tuples.push([field_list[0].name, field_list]);
        });
        action.payload.grouped_field_tuples = grouped_field_tuples;
      }
      return {
        ...state,
        selectedUnit: action.payload,
      };
    case "SET_CUSTOMERLIST":
      return { ...state, customerList: action.payload };
    case "PUSH_FIELD":
      return { ...state, selectedUnit: action.payload.field };
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

const UnitInfoView = ({ unit }) => {
  return (
    <div className="UnitInfoView">
      <div className="UnitInfoView__content">
        <List>
          <ListItem>Identifier: {unit.id}</ListItem>
          <ListItem>
            Status: {unit.status === "A" ? "Active" : "Inactive"}
          </ListItem>
          <ListItem>
            Created on: {new Date(unit.date_created).toLocaleDateString()}
          </ListItem>
          <ListItem>
            Updated on: {new Date(unit.date_modified).toLocaleDateString()}
          </ListItem>
          <ListItem>Created by: {unit.user_created}</ListItem>
          <ListItem>Updated By: {unit.user_modified}</ListItem>
        </List>
      </div>
    </div>
  );
};

const IdentityView = ({ unit }) => {
  return (
    <div className="IdentityView">
      <div className="IdentityView__header">Unit identity for {unit.id}</div>
      <div className="IdentityView__content">
        <IdentityJsonbView identity={unit.identity} />
      </div>
    </div>
  );
};

const UnitFieldView = ({ unit }) => {
  // let childRows = [];
  const [open, setOpen] = React.useState({});
  const handleClick = (index) => {
    // Cant mutate open state so we mutate a copy and overwrite
    let openRes = { ...open };
    // Get the open status of the selected drawer
    const currentOpen =
      open[String(index)] === undefined ? false : openRes[String(index)];
    // Close all other units
    Object.keys(openRes).forEach((key) => {
      openRes[key] = false;
    });
    // Open the new unit drawer
    openRes[String(index)] = !currentOpen;
    setOpen(openRes);
  };

  if (unit.identity === undefined || Object.keys(unit.identity).length === 0) {
    return <div>Identity not found</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Field Type \\ Field Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {unit.grouped_field_tuples.map((row, index) => {
            return (
              <List key={String(index)}>
                <ListItemButton
                  onClick={() => {
                    handleClick(index);
                  }}
                >
                  <ListItemIcon>
                    <BuildIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={row[1][0].type + "\t\\\\\t" + row[0]}
                  />
                  {open[String(index)] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open[String(index)]} timeout="auto" unmountOnExit>
                  <InputHeaderRow
                    row={row}
                    key={index}
                    identity={unit.identity}
                  />
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Type</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell>Value</TableCell>
                          <TableCell>Meta</TableCell>
                          <TableCell>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row[1]
                          .sort((a, b) => {
                            return (
                              new Date(a.date_created) -
                              new Date(b.date_created)
                            );
                          })
                          .reverse()
                          .map((field, Lindex) => {
                            return <FieldBodyRow field={field} key={Lindex} />;
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Collapse>
              </List>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const Unit = ({ unit }) => {
  React.useEffect(() => {
    if (unit !== undefined && Object.keys(unit).length !== 0) {
      if (unit.fields !== undefined && Object.keys(unit.fields).length !== 0) {
        let unit_field_collector = {};
        let grouped_field_tuples = [];

        for (let i = 0; i < unit.fields.length; i++) {
          const element = unit.fields[i];
          if (unit_field_collector[element.name] === undefined) {
            unit_field_collector[element.name] = [];
          }
          unit_field_collector[element.name].push(element);
        }

        Object.values(unit_field_collector).forEach((field_list) => {
          field_list = field_list.sort((a, b) => {
            return new Date(a.date_created) - new Date(b.date_created);
          });
          field_list = field_list.reverse();
          grouped_field_tuples.push([field_list[0].name, field_list]);
        });
        unit.grouped_field_tuples = grouped_field_tuples;
      }
    }
  }, [unit]);

  return (
    <Container fixed>
      <div className="UnitsDetailView">
        <UnitInfoView unit={unit} />
        <UnitFieldView unit={unit} />
      </div>
    </Container>
  );
};

const UnitsDetailView = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  if (state.selectedUnit === undefined) {
    return <></>;
  }
  console.log(state.selectedUnit);
  return (
    <StateContext.Provider value={{ state, dispatch }}>
      <Container fixed>
        <Unit unit={state.selectedUnit} />
      </Container>
    </StateContext.Provider>
  );
};

export default { Unit };
