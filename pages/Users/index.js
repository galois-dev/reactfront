import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { Axios } from "@pages/index";
import { TabPanel } from "@components/sitecore/TabPanel";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/router";
import RoundBox from "@components/sitecore/RoundBox";

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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Users = ({}) => {
  const [value, setValue] = React.useState(0);
  const [users, setUsers] = React.useState([]);
  const [error, setError] = React.useState(false);
  const navigate = useRouter();

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
    navigate.push(`/users/${row.id}`);
  };

  return (
    <Container fixed maxWidth="xl">
      <RoundBox sx={{ width: "100%", bgcolor: "#ffffff" }}>
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
        <TabPanel value={value} index={0}>
          <div style={{ width: "100%" }}>
            {/* <TextField
              style={{ marginBottom: "1.2em" }}
              id="public-user-search"
              label="Search for a user by email, username, or id"
              fullWidth={true}
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
        <TabPanel value={value} index={1}>
          <div style={{ width: "100%" }}>
            {/* <TextField
              style={{ marginBottom: "1.2em" }}
              id="public-staff-search"
              label="Search for an employee by email, username, or id"
              fullWidth={true}
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
      </RoundBox>
    </Container>
  );
};

export default Users;
