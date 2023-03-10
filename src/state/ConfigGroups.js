import { createContext, useContext, useReducer } from "react";

const configGroupContext = createContext({});
const configGroupDispatchContext = createContext({});

export function ConfigCustomerProvider({ children }) {
  let [configGroup, dispatchconfigGroup] = useReducer(
    configGroupReducer,
    initialState
  );

  return (
    <configGroupContext.Provider value={configGroup}>
      <configGroupDispatchContext.Provider value={dispatchconfigGroup}>
        {children}
      </configGroupDispatchContext.Provider>
    </configGroupContext.Provider>
  );
}

// Provider and reducer patterns for state management
export function useConfigGroupContext() {
  return useContext(configGroupContext);
}

export function useConfigGroupDispatchContext() {
  return useContext(configGroupDispatchContext);
}

export function useConfigGroup() {
  return [useConfigGroupContext(), useConfigGroupDispatchContext()];
}

function configGroupReducer(state, action) {
  switch (action.type) {
    case "SET_ACCTEC_GROUPS":
      return {
        ...state,
        acctecGroups: action.payload,
        heldAcctecGroups: action.payload,
      };
    case "SET_CONTROLLER_GROUPS":
      return {
        ...state,
        controllerGroups: action.payload,
        heldControllerGroups: action.payload,
      };
    case "ADD_CONTROLLER_GROUP":
      return {
        ...state,
        controllerGroups: [...state.controllerGroups, action.payload],
      };
    case "ADD_ACCTEC_GROUP":
      return {
        ...state,
        acctecGroups: [...state.acctecGroups, action.payload],
      };
    case "UPDATE_CONTROLLER_GROUP_BY_ID":
      return {
        ...state,
        controllerGroups: state.controllerGroups.map((group) => {
          if (group.id === action.payload.id) {
            return action.payload;
          } else {
            return group;
          }
        }),
      };
    case "UPDATE_ACCTEC_GROUP_BY_ID":
      return {
        ...state,
        acctecGroups: state.acctecGroups.map((group) => {
          if (group.id === action.payload.id) {
            return action.payload;
          } else {
            return group;
          }
        }),
      };
    case "UPDATE_CONTROLLER_GROUP_BY_NAME_AND_ID":
      return {
        ...state,
        controllerGroups: state.controllerGroups.map((group) => {
          if (group.id !== action.payload.id) {
            return { ...group, name: action.payload.name };
          } else {
            return group;
          }
        }),
      };
    case "UPDATE_ACCTEC_GROUP_BY_NAME_AND_ID":
      return {
        ...state,
        acctecGroups: state.acctecGroups.map((group) => {
          if (group.id !== action.payload.id) {
            return { ...group, name: action.payload.name };
          } else {
            return group;
          }
        }),
      };
    case "DELETE_CONTROLLER_GROUP_BY_ID":
      return {
        ...state,
        controllerGroups: state.controllerGroups.filter(
          (group) => group.id !== action.payload.id
        ),
      };
    case "DELETE_ACCTEC_GROUP_BY_ID":
      return {
        ...state,
        acctecGroups: state.acctecGroups.filter(
          (group) => group.id !== action.payload.id
        ),
      };
    case "CLEAR_CHANGES":
      return {
        ...state,
        controllerGroups: state.heldControllerGroups,
        acctecGroups: state.heldAccountGroups,
      };
    default:
      console.log("Invalid action type for configCustomerReducer");
  }
}

let initialState = {
  acctecGroups: [],
  heldAccountGroups: [],
  controllerGroups: [],
  heldControllerGroups: [],
};

export default ConfigCustomerProvider;
