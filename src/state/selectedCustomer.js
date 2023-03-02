import { createContext, useContext, useReducer } from "react";

const selectedCustomerContext = createContext({});
const selectedCustomerDispatchContext = createContext({});

export function SelectedCustomerProvider({ children }) {
  let [selectedCustomer, dispatchSelectedCustomer] = useReducer(
    selectedCustomerReducer,
    initialState
  );

  return (
    <selectedCustomerContext.Provider value={selectedCustomer}>
      <selectedCustomerDispatchContext.Provider
        value={dispatchSelectedCustomer}
      >
        {children}
      </selectedCustomerDispatchContext.Provider>
    </selectedCustomerContext.Provider>
  );
}

// Provider and reducer patterns for state management

export function useSelectedCustomerContext() {
  return useContext(selectedCustomerContext);
}

export function useSelectedCustomerDispatchContext() {
  return useContext(selectedCustomerDispatchContext);
}
function selectedCustomerReducer(state, action) {
  switch (action.type) {
    case "SET":
      return {
        ...state,
        heldCustomer: action.payload,
        selectedCustomer: action.payload,
      };
    case "CANCEL_CHANGES":
      return {
        ...state,
        selectedCustomer: state.heldCustomer,
      };
    case "ADD_CONTROLLER_GROUP":
      return {
        ...state,
        selectedCustomer: {
          ...state.selectedCustomer,
          controller_groups: [
            ...state.selectedCustomer.controller_groups,
            action.payload,
          ],
        },
      };
    case "ADD_ACCTEC_GROUP":
      return {
        ...state,
        selectedCustomer: {
          ...state.selectedCustomer,
          acctec_groups: [
            ...state.selectedCustomer.acctec_groups,
            action.payload,
          ],
        },
      };
    case "REMOVE_ACCTEC_GROUP":
      return {
        ...state,
        selectedCustomer: {
          ...state.selectedCustomer,
          acctec_groups: state.selectedCustomer.acctec_groups.filter(
            (group) => group.id !== action.payload.id
          ),
        },
      };
    case "REMOVE_CONTROLLER_GROUP":
      return {
        ...state,
        selectedCustomer: {
          ...state.selectedCustomer,
          controller_groups: state.selectedCustomer.controller_groups.filter(
            (group) => group.id !== action.payload.id
          ),
        },
      };
    case "REMOVE_CONTROLLER_GROUP_BY_ID":
      return {
        ...state,
        selectedCustomer: {
          ...state.selectedCustomer,
          controller_groups: state.selectedCustomer.controller_groups.filter(
            (group) => group.id !== action.payload
          ),
        },
      };
    case "REMOVE_ACCTEC_GROUP_BY_ID":
      return {
        ...state,
        selectedCustomer: {
          ...state.selectedCustomer,
          acctec_groups: state.selectedCustomer.acctec_groups.filter(
            (group) => group.id !== action.payload
          ),
        },
      };
    case "UPDATE_CONTROLLER_GROUP":
      return {
        ...state,
        selectedCustomer: {
          ...state.selectedCustomer,
          controller_groups: state.selectedCustomer.controller_groups.map(
            (group) => {
              if (group.id === action.payload.id) {
                return action.payload;
              } else {
                return group;
              }
            }
          ),
        },
      };
    case "UPDATE_ACCTEC_GROUP":
      return {
        ...state,
        selectedCustomer: {
          ...state.selectedCustomer,
          acctec_groups: state.selectedCustomer.acctec_groups.map((group) => {
            if (group.id === action.payload.id) {
              return action.payload;
            } else {
              return group;
            }
          }),
        },
      };
    default:
      console.log("Invalid action type for selectedCustomerReducer");
  }
}

let initialState = {
  selectedCustomer: undefined,
  heldCustomer: undefined,
};

export default SelectedCustomerProvider;
