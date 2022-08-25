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

const UnitInfoView = ({ unit }) => {
  return (
    <div className="UnitInfoView">
      <div className="UnitInfoView__content">
        <List>
          <ListItem>Identifier: {unit.id}</ListItem>
          <ListItem>
            Status: {unit.status === "A" ? "Active" : "Inactive"}
          </ListItem>
          <ListItem>Created on: {unit.date_created}</ListItem>
          <ListItem>Updated on: {unit.date_modified}</ListItem>
          <ListItem>Created by: {unit.user_created}</ListItem>
          <ListItem>Updated By: {unit.user_modified}</ListItem>
        </List>
      </div>
    </div>
  );
};

export const IdentityJsonbView = ({ identity }) => {
  let childRows = [];

  if (identity === undefined) {
    return <div>Identity not found</div>;
  }

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
  let childRows = [];
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

  if (unit.identity === undefined) {
    return <div>Identity not found</div>;
  }

  unit?.fields.forEach((field) => {
    childRows.push({
      field: field.name,
      value: field.value,
      type: field.type,
      meta: field.meta,
    });
  });

  // const RowItem = ({ field, value, type, meta }) => {
  //   return (
  //     <TableRow>
  //       <TableCell>{field}</TableCell>
  //       <TableCell>{type}</TableCell>
  //       <TableCell>{typeof value === "Object" ? value : ""}</TableCell>
  //       <TableCell>{typeof meta === "Object" ? meta : ""}</TableCell>
  //     </TableRow>
  //   );
  // };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Field Type \\ Field Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {childRows.map((row, index) => {
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
                  <ListItemText primary={row.type + "\t\\\\\t" + row.field} />
                  {open[String(index)] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse
                  in={open[String(index)]}
                  timeout="auto"
                  unmountOnExit
                ></Collapse>
              </List>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Unit = ({ unit }) => {
  return (
    <div className="UnitsDetailView">
      <UnitInfoView unit={unit} />
      <UnitFieldView unit={unit} />
    </div>
  );
};

const UnitsDetailView = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      <Unit unit={state.selectedUnit} />
    </StateContext.Provider>
  );
};

export default Unit;
