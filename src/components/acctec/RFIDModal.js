import RoundBox from "@components/sitecore/RoundBox";
import style from "@styles/AcctecAdmin.module.scss";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  ModalRoot,
  Select,
  Typography,
} from "@mui/material";
import { RFIDForm } from "./RFIDForm";
import FormActionButtons from "./FormActionButtons";
import { grey } from "@mui/material/colors";

export const RFIDModal = ({
  selectedRFID,
  setSelectedRFID,
  modalActive,
  setModalActive,
  modalMode,
  cancel,
  save,
  deleteRFID,
  acctecGroups,
  controllerGroups,
}) => {
  return (
    <Modal open={modalActive} onClose={() => setModalActive(false)}>
      <RoundBox
        sx={{
          m: 0,
          p: 2,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 550,
        }}
      >
        <Typography variant="h4" color="primary" align="center">
          {modalMode[0].toUpperCase() +
            modalMode.slice(1, modalMode.length) +
            " " +
            selectedRFID["Token"]}
        </Typography>

        {modalMode === "edit" ? (
          <RFIDForm
            selectedRFID={selectedRFID}
            setSelectedRFID={setSelectedRFID}
            acctecGroups={acctecGroups}
            controllerGroups={controllerGroups}
            onCancel={() => {
              cancel(selectedRFID);
            }}
            onSave={() => {
              save(selectedRFID);
            }}
          />
        ) : modalMode == "delete" ? (
          <div>
            <br />
            <FormActionButtons
              onCancel={() => {
                setModalActive(false);
              }}
              onDelete={() => {
                deleteRFID(selectedRFID);
              }}
            />
          </div>
        ) : (
          <div>
            <br />
            <Box sx={{ backgroundColor: grey[300] }}>
              <Typography variant="p">No entries found</Typography>
            </Box>
          </div>
        )}
      </RoundBox>
    </Modal>
  );
};

export default RFIDModal;
