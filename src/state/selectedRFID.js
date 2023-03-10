import { createContext, useContext, useReducer } from "react";

const selectedRFIDContext = createContext({});
const selectedRFIDDispatchContext = createContext({});

export function SelectedRFIDProvider({ children }) {
  let [selectedRFID, dispatchSelectedRFID] = useReducer(
    selectedRFIDReducer,
    initialState
  );

  return (
    <selectedRFIDContext.Provider value={selectedRFID}>
      <selectedRFIDDispatchContext.Provider value={dispatchSelectedRFID}>
        {children}
      </selectedRFIDDispatchContext.Provider>
    </selectedRFIDContext.Provider>
  );
}

// Provider and reducer patterns for state management

export function useSelectedRFIDContext() {
  return useContext(selectedRFIDContext);
}

export function useSelectedRFIDDispatchContext() {
  return useContext(selectedRFIDDispatchContext);
}

export function useSelectedRFID() {
  return [useSelectedRFIDContext(), useSelectedRFIDDispatchContext()];
}

function selectedRFIDReducer(state, action) {
  switch (action.type) {
    case "SET":
      return {
        ...state,
        heldRFID: action.payload,
        selectedRFID: action.payload,
      };
    case "CANCEL_CHANGES":
      return {
        ...state,
        selectedRFID: state.heldRFID,
      };
    case "CHANGE_ARG":
      return {
        ...state,
        selectedRFID: {
          ...state.selectedRFID,
          [action.payload.key]: action.payload.arg,
        },
      };
    case "SET_PRIVATE_ACCTEC_GROUP":
      return {
        ...state,
        selectedRFID: {
          ...state.selectedRFID,
          _Group: action.payload,
        },
      };
    case "SET_PRIVATE_CONTROLLER_GROUP":
      return {
        ...state,
        selectedRFID: {
          ...state.selectedRFID,
          _ControllerGroup: action.payload,
        },
      };
    case "MODAL_MODE_EDIT":
      return {
        ...state,
        modalMode: "edit",
      };
    case "MODAL_MODE_LOGS":
      return {
        ...state,
        modalMode: "logs",
      };
    case "MODAL_MODE_DELETE":
      return {
        ...state,
        modalMode: "delete",
      };
    case "MODAL_CLOSE":
      return {
        ...state,
        modalActive: false,
      };
    case "MODAL_OPEN":
      return {
        ...state,
        modalActive: true,
      };
    case "MODAL_CANCEL":
      return {
        ...state,
        selectedRFID: heldRFID,
        modalActive: false,
      };

    default:
      console.log("Invalid action type for selectedRFIDReducer");
  }
}

let initialState = {
  selectedRFID: {
    Active: true,
    Token: "",
    Group: [],
    id: "",
    ControllerGroup: null,
    admin_note: "",
    status: "A",
    NumUses: 0,
    MaxUses: 1,
  },
  heldRFID: undefined,
  modalMode: "logs",
  modalActive: false,
};

export default SelectedRFIDProvider;
