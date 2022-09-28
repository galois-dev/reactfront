import * as React from "react";
import { useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Axios } from "./index";
import { useNavigate } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

const initialState = {
  customerList: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CUSTOMER_LIST":
      return { ...state, customerList: action.payload };
    default:
      return state;
  }
}

const StateContext = React.createContext(initialState);

const columns = [
  { field: "name", headerName: "Name", width: 100 },
  { field: "status", headerName: "status", width: 100 },
  { field: "num_locations", headerName: "locations", width: 100 },
  { field: "num_users", headerName: "users", width: 25 },
  { field: "description", headerName: "description" },
];

const CustomerListSelector = ({}) => {
  const { state, dispatch } = React.useContext(StateContext);
  const navigate = useNavigate();

  function handleRowClick({ columns, getValue, id, row }) {
    navigate(`/Customers/${row.id}`, { replace: true });
  }

  return (
    <Box sx={{ width: "100%", bgcolor: "#ffffff" }}>
      <DataGrid
        autoHeight
        rows={state.customerList}
        columns={columns}
        rowsPerPageOptions={[15, 25, 50, 100, 500, 1000]}
        onRowClick={(e) => {
          handleRowClick(e);
        }}
      />
    </Box>
  );
};

const Customers = ({}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    Axios.get("api/customers").then((res) => {
      res.data = res.data.map((customer) => {
        return {
          ...customer,
          num_locations: customer.locations?.length,
          num_users: customer?.user_list.length,
        };
      });
      dispatch({ type: "SET_CUSTOMER_LIST", payload: res.data });
    });
  }, []);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      <Container fixed>
        <CustomerListSelector />
      </Container>
    </StateContext.Provider>
  );
};

export default Customers;
