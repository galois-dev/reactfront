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

// Table helper
function dataToRow(
  data,
  handleEdit,
  HandleDelete,
  handleLogs,
  deselectModal,
  modalActive
) {
  // validate the arguments exist
  if (!data || data == undefined) {
    console.log("data is null");
    return <LoadingComponent />;
  }
  if (!handleEdit || handleEdit == undefined) {
    console.log("handleEdit is null");
    return <LoadingComponent />;
  }
  if (!HandleDelete || HandleDelete == undefined) {
    console.log("HandleDelete is null");
    return <LoadingComponent />;
  }
  if (!handleLogs || handleLogs == undefined) {
    console.log("handleLogs is null");
    return <LoadingComponent />;
  }
  if (!deselectModal || deselectModal == undefined) {
    console.log("deselectModal is null");
    return <LoadingComponent />;
  }
  if (modalActive == null || modalActive == undefined) {
    console.log("modalActive is null");
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
              !modalActive ? handleLogs(data.id) : deselectModal();
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
              !modalActive ? handleEdit(data.id) : deselectModal();
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
              !modalActive ? HandleDelete(data.id) : deselectModal();
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
}

const Rfidtable = ({
  data,
  rowsPerPage,
  page,
  handleEdit,
  handleDelete,
  handleLogs,
  handleChangePage,
  handleChangeRowsPerPage,
  deselectModal,
  modalActive,
}) => {
  if (!data || data == undefined || data.length == 0 || data == null) {
    return <LoadingComponent />;
  }

  let rows = data.map((row) => {
    return dataToRow(
      row,
      handleEdit,
      handleDelete,
      handleLogs,
      deselectModal,
      modalActive
    );
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
