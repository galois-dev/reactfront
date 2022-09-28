import * as React from "react";
import status_switch from "../../helpers/status";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";
import GiteIcon from "@mui/icons-material/Gite";
import ShieldIcon from "@mui/icons-material/Shield";
import Unit from "../Units/Unit";
import { ErrorBoundary } from "react-error-boundary";

const initialState = {
  location: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOCATION":
      return { ...state, location: action.payload };
    default:
      return state;
  }
}

const StateContext = React.createContext(initialState);

function ErrorHandler({ error }) {
  return (
    <div>
      <div>An error occurred:</div>
      <div>{error.message}</div>
    </div>
  );
}

const LocationDetailGrid = ({ location }) => {
  return (
    <div className="Location__details">
      <div className="Location_details__address">
        <div className="Location__detail__label">address</div>
        <div className="Location__detail__value">{location.address}</div>
      </div>
      <div className="Location_details__city">
        <div className="Location__detail__label">city</div>
        <div className="Location__detail__value">{location.city}</div>
      </div>
      <div className="Location_details__zipcode">
        <div className="Location__detail__label">zipcode</div>
        <div className="Location__detail__value">{location.zipcode}</div>
      </div>
      <div className="Location_details__state">
        <div className="Location__detail__label">state</div>
        <div className="Location__detail__value">{location.state}</div>
      </div>
      <div className="Location_details__email">
        <div className="Location__detail__label">email</div>
        <div className="Location__detail__value">{location.email}</div>
      </div>
      <div className="Location_details__phone">
        <div className="Location__detail__label">phone</div>
        <div className="Location__detail__value">{location.phone}</div>
      </div>
      <div className="Location_details__website">
        <div className="Location__detail__label">website</div>
        <div className="Location__detail__value">{location.website}</div>
      </div>
      <div className="Location_details__status">
        <div className="Location__detail__label">status</div>
        <div className="Location__detail__value">
          {status_switch(location.status)}
        </div>
      </div>
      <div className="Location_details__note">
        <div className="Location__detail__label">note</div>
        <div className="Location__detail__value">{location.note}</div>
      </div>
      <div className="Location_details__units">
        <div className="Location__detail__label">units</div>
        <div className="Location__detail__value">
          {location.onprem_units.length}
        </div>
      </div>
      <div className="Location_details_id">
        <div className="Location__detail__label">id</div>
        <div className="Location__detail__value">{location.id}</div>
      </div>
      <div className="Location_details_subscription">
        <div className="Location__detail__label">active_subscription</div>
        <div className="Location__detail__value">
          {location.active_subscription}
        </div>
      </div>
      <div className="Location_details__created">
        <div className="Location__detail__label">date_created</div>
        <div className="Location__detail__value">
          {new Date(location.date_created).toLocaleDateString()}
        </div>
      </div>
      <div className="Location_details__modified">
        <div className="Location__detail__label">date_modified</div>
        <div className="Location__detail__value">
          {new Date(location.date_modified).toLocaleDateString()}
        </div>
      </div>
      <div className="Location_details__ucreated">
        <div className="Location__detail__label">user_created</div>
        <div className="Location__detail__value">{location.user_created}</div>
      </div>
      <div className="Location_details__umodified">
        <div className="Location__detail__label">user_modified</div>
        <div className="Location__detail__value">{location.user_modified}</div>
      </div>
    </div>
  );
};

const LocationUnitList = ({ units }) => {
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

  return (
    <div>
      <ErrorBoundary FallbackComponent={ErrorHandler}>
        {units.map((unit, index) => {
          return (
            <List key={String(index)}>
              <ListItemButton
                onClick={() => {
                  handleClick(index);
                }}
              >
                <ListItemIcon>
                  <ShieldIcon />
                </ListItemIcon>
                <ListItemText
                  primary={unit?.identity?.name + " - " + String(index)}
                />
                {open[String(index)] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open[String(index)]} timeout="auto" unmountOnExit>
                <Unit unit={unit} />
              </Collapse>
            </List>
          );
        })}
      </ErrorBoundary>
    </div>
  );
};

const LocationView = ({ location }) => {
  return (
    <div className="Location_view__container">
      <LocationDetailGrid location={location} />
      <LocationUnitList units={location.onprem_units} />
    </div>
  );
};

const Location = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      <locationView location={state.location} />
    </StateContext.Provider>
  );
};

export default LocationView;
