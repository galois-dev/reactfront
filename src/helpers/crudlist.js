import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Axios } from "../../pages/index";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

export const Crudlist = ({
  api_endpoint = "/",
  haslist = true, // flag for listing the endpoint
  hassort = false, // flag for sorting the columns
  hasfilter = false, // flag for filtering the columns
  hassearch = false, // flag for searching the columns
  hasmodal = true, // flag for adding
  select = false, // flag for selecting
  dense = false, // flag for dense table
  columns = [], // column list @ mui
  handleedit = (event) => {}, // callback function
  handledelete = (event) => {}, // callback function
  handleadd = (event) => {}, // callback function
  addformelement = <></>, // jsx form element for modal
  editformelement = <></>, // jsx form element for modal
  handleclickrow = () => {}, // callback function
}) => {
  const [data, setData] = React.useState([]);
  const [error, setError] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [modalAction, setModalAction] = React.useState("add");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState({});
  const [modalError, setModalError] = React.useState({});

  React.useEffect(() => {
    Axios.get(`${api_endpoint}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    if (hasmodal) {
      columns.push({
        id: "actions",
        label: "Actions",
        minWidth: 170,
      });
    }
  }, [columns]);

  React.useEffect(() => {
    if (hasmodal) {
      data.forEach((item) => {
        item.actions = (
          <>
            <Button onClick={() => preEdit(item)}>Edit</Button>
            <Button onClick={() => preDelete(item)}>Delete</Button>
          </>
        );
      });
    }
  }, [data]);

  function onAdd(event) {
    handleadd(event);
    setModalAction("add");
  }

  function preEdit(event) {
    setModalAction("edit");
    setModalData(event);
    setModalOpen(true);
  }

  function onEdit(event) {
    handleedit(event);
    setModalAction("edit");
  }

  function preDelete(event) {
    setModalAction("delete");
    setModalData(event);
  }

  function onDelete(event) {
    handledelete(event);
    setModalAction("delete");
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
  }

  function handleConfirm() {
    if (modalAction === "add") {
      onAdd(modalData);
    } else if (modalAction === "edit") {
      onEdit(modalData);
    } else if (modalAction === "delete") {
      onDelete(modalData);
    }
  }

  return (
    <div className="CRUDConfig">
      {hasmodal ? (
        <Modal
          hideBackdrop
          open={modalOpen}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ width: 200 }}>
            {
              {
                add: addformelement,
                edit: editformelement,
                delete: <p>Are you sure you want to delete?</p>,
              }[modalAction]
            }
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={handleConfirm}>Save</Button>
          </Box>
        </Modal>
      ) : (
        <></>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.forEach((column, index) => {
                return <TableCell key={String(index)}>{column}</TableCell>;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => {
              return (
                <TableRow
                  key={String(index)}
                  onClick={() => handleclickrow(row)}
                >
                  {columns.map((column, index) => {
                    return (
                      <TableCell key={String(index)}>{row[column]}</TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Crudlist;
