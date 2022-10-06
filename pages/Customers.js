import * as React from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Axios } from "./index";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import CustomerForm from "@components/sitecore/CustomerForm";
import RoundBox from "@components/sitecore/RoundBox";
import { useRouter } from "next/router";
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
  const navigate = useRouter();

  function handleRowClick({ columns, getValue, id, row }) {
    navigate.push(`/Customer/${row.id}`);
  }

  return (
    <RoundBox>
      <DataGrid
        autoHeight
        rows={state.customerList}
        columns={columns}
        rowsPerPageOptions={[15, 25, 50, 100, 500, 1000]}
        onRowClick={(e) => {
          handleRowClick(e);
        }}
      />
    </RoundBox>
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
        <CustomerForm />
      </Container>
    </StateContext.Provider>
  );
};

export default Customers;
