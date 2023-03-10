import LoadingComponent from "@components/sitecore/LoadingComponent";
import LoadingPage from "@components/sitecore/LoadingPage";
import { time_delta_on_unit_time } from "@helpers/intl_date";
import status_pill from "@helpers/status_pill";
import { Delete, Edit, Label, Summarize } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  ButtonGroup,
  IconGroup,
  IconButton,
  Icon,
} from "@mui/material";
import { useSelectedCustomerDispatchContext } from "@state/selectedCustomer";
import {
  useSelectedRFIDContext,
  useSelectedRFIDDispatchContext,
} from "@state/selectedRFID";

// Table helper
const dataToRow = (data) => {
  let selectedRFIDContext = useSelectedRFIDContext();
  let selectedRFIDDispatch = useSelectedRFIDDispatchContext();
  let { modalActive } = selectedRFIDContext;

  // validate the arguments exist
  if (!data || data == undefined) {
    console.log("data is null");
    return <LoadingComponent />;
  }
  // return the table row
  return (
    <TableRow>
      <TableCell>{data.Token}</TableCell>
      <TableCell>
        <span>{data.ControllerGroup ? data.ControllerGroup : ""}</span>
      </TableCell>
      <TableCell>
        {data.Group?.map((group_id, idx) => {
          return idx !== data.Group.length - 1 ? (
            <span key={String(idx)}>
              {group_id}
              <br />
              <br />
            </span>
          ) : (
            <span key={String(idx)}>{group_id}</span>
          );
        })}
      </TableCell>
      <TableCell>{data.Name}</TableCell>
      <TableCell align="center">{data.NumUses}</TableCell>
      <TableCell align="center">{data.MaxUses}</TableCell>
      <TableCell>{data.LastUse}</TableCell>
      <TableCell>
        {data.Expiration ? time_delta_on_unit_time(data.Expiration) : "Never"}
      </TableCell>
      <TableCell>{status_pill(data.status)}</TableCell>
      <TableCell>{time_delta_on_unit_time(data.date_created, "day")}</TableCell>
      <TableCell align="right">
        <ButtonGroup>
          <IconButton
            variant="contained"
            icon="summarize"
            color="info"
            onClick={() => {
              console.log("clicked");
              if (!modalActive) {
                selectedRFIDDispatch({
                  type: "SET",
                  payload: data,
                });
                selectedRFIDDispatch({
                  type: "MODAL_MODE_LOGS",
                });
                selectedRFIDDispatch({
                  type: "MODAL_OPEN",
                });
              } else {
                selectedRFIDDispatch({
                  type: "MODAL_CLOSE",
                });
              }
            }}
          >
            <Icon>
              <Summarize />
            </Icon>
          </IconButton>
          <IconButton
            variant="contained"
            icon="edit"
            color="warning"
            onClick={() => {
              if (!modalActive) {
                selectedRFIDDispatch({
                  type: "SET",
                  payload: data,
                });
                selectedRFIDDispatch({
                  type: "MODAL_MODE_EDIT",
                });
                selectedRFIDDispatch({
                  type: "MODAL_OPEN",
                });
              } else {
                selectedRFIDDispatch({
                  type: "MODAL_CLOSE",
                });
              }
            }}
          >
            <Icon>
              <Edit />
            </Icon>
          </IconButton>
          <IconButton
            variant="contained"
            color="error"
            onClick={() => {
              if (!modalActive) {
                selectedRFIDDispatch({
                  type: "SET",
                  payload: data,
                });
                selectedRFIDDispatch({
                  type: "MODAL_MODE_DELETE",
                });
                selectedRFIDDispatch({
                  type: "MODAL_OPEN",
                });
              } else {
                selectedRFIDDispatch({
                  type: "MODAL_CLOSE",
                });
              }
            }}
          >
            <Icon>
              <Delete />
            </Icon>
          </IconButton>
        </ButtonGroup>
      </TableCell>
    </TableRow>
  );
};

const Rfidtable = ({
  data,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  if (!data || data == undefined || data == null) {
    return <LoadingComponent />;
  }

  let rows = data.map((row) => {
    return dataToRow(row);
  });
  return (
    <span>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Token</TableCell>
              <TableCell>Controller Group</TableCell>
              <TableCell>Group</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Number of uses</TableCell>
              <TableCell>Limit of uses</TableCell>
              <TableCell>Last use date</TableCell>
              <TableCell>Expiration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </span>
  );
};

export default Rfidtable;
