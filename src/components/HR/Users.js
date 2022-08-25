import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { Axios } from "../../App";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";

export function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "email", headerName: "Email", width: 100 },
  {
    field: "username",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    // valueGetter: (params) =>
    //   `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
];

const Users = ({}) => {
  const [value, setValue] = React.useState("0");
  const [users, setUsers] = React.useState([]);
  const [error, setError] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    Axios.get("/users")
      .then((resp) => {
        setUsers(resp.data);
      })
      .catch((err) => {
        setError(true);
        return (
          <Container fixed maxWith="xl">
            <Typography variant="h6" noWrap>
              Users not found due to networking error
            </Typography>
          </Container>
        );
      });
  }, []);
  if (error) {
    // return (
    //   <Container fixed maxWith="xl">
    //     <Typography variant="h6" noWrap>
    //       Users not found due to networking error
    //     </Typography>
    //   </Container>
    // );
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRowClick = ({ columns, getValue, id, row }) => {
    navigate(`../users/${row.id}`, { replace: false });
  };

  return (
    <Container fixed maxWidth="xl">
      <Box sx={{ width: "100%", bgcolor: "#ffffff" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Public Users" {...a11yProps(0)} />
            <Tab label="Staff Users" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={"0"}>
          <div style={{ width: "100%" }}>
            {/* <TextField
              style={{ marginBottom: "1.2em" }}
              id="public-user-search"
              label="Search for a user by email, username, or id"
              fullWidth
              variant="outlined"
            /> */}
            <DataGrid
              autoHeight
              rows={users}
              columns={columns}
              pageSize={15}
              rowsPerPageOptions={[5]}
              onRowClick={handleRowClick}
            />
          </div>
        </TabPanel>
        <TabPanel value={value} index={"1"}>
          <div style={{ width: "100%" }}>
            {/* <TextField
              style={{ marginBottom: "1.2em" }}
              id="public-staff-search"
              label="Search for an employee by email, username, or id"
              fullWidth
              variant="outlined"
            /> */}
            <DataGrid
              autoHeight
              rows={users}
              columns={columns}
              pageSize={15}
              rowsPerPageOptions={[15]}
            />
          </div>
        </TabPanel>
      </Box>
    </Container>
  );
};

export default Users;
