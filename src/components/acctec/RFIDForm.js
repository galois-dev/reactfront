// import style from "@styles/Rfid.module.scss";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";

import FormActionButtons from "./FormActionButtons";
import ListSelect from "./ListSelect";
import SelectableList from "./SelectableList";
import {
  useSelectedRFIDContext,
  useSelectedRFIDDispatchContext,
} from "@state/selectedRFID";

export const RFIDForm = ({
  onCancel,
  onSave,
  controllerGroups,
  acctecGroups,
}) => {
  const [dateActive, setDateActive] = useState(false);
  let selectedRFIDContext = useSelectedRFIDContext();
  let selectedRFIDDispatch = useSelectedRFIDDispatchContext();
  let { selectedRFID } = selectedRFIDContext;

  const onChange = (key, arg) =>
    selectedRFIDDispatch({
      type: "CHANGE_ARG",
      payload: { key: key, arg: arg },
    });

  const handleCancel = () => selectedRFIDDispatch({ type: "CANCEL_CHANGES" });

  return (
    <div
      style={{
        display: "flex",
        gap: "1em",
        flexDirection: "column",
        marginTop: "1em",
      }}
    >
      <FormControl
        fullWidth
        sx={{ display: "flex", flexDirection: "row", gap: "1em" }}
      >
        <InputLabel id="demo-simple-select-label">Status</InputLabel>
        <Select
          controlled="true"
          label="Status"
          value={selectedRFID.status}
          onChange={(e) => {
            onChange("status", e.target.value);
          }}
          fullWidth
          size="small"
        >
          <MenuItem value="A">Active</MenuItem>
          <MenuItem value="I">Inactive</MenuItem>
          <MenuItem value="D">Deleted</MenuItem>
        </Select>
        <TextField
          size="small"
          label="Maximum Uses"
          defaultValue={selectedRFID.MaxUses}
          onChange={(e) => {
            onChange("MaxUses", e.target.value);
          }}
        ></TextField>
      </FormControl>
      <FormControl
        fullWidth
        sx={{ display: "flex", flexDirection: "row", gap: "1em" }}
      >
        <FormControlLabel
          control={
            <Checkbox
              defaultValue={
                selectedRFID.Expiration === undefined ||
                selectedRFID.Expiration === null ||
                selectedRFID.Expiration === ""
              }
              onChange={() => {
                setDateActive(!dateActive);
              }}
            />
          }
          label="Expires"
        />
        <FormControl fullWidth>
          <MobileDatePicker
            label="Date mobile"
            inputFormat="MM/DD/YYYY"
            minDate={new Date()}
            value={selectedRFID.Expiration || null}
            onChange={(e) => {
              onChange("Expiration", new Date(e));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                disabled={!dateActive}
                size="small"
                value={selectedRFID.Expiration || ""}
              />
            )}
          />
        </FormControl>
      </FormControl>
      <FormControl
        fullWidth
        sx={{ display: "flex", flexDirection: "row", gap: "1em" }}
      >
        <TextField
          size="small"
          label="Phone"
          sx={{ width: "100%" }}
          defaultValue={selectedRFID.Phone || ""}
          onChange={(e) => {
            onChange("Phone", e.target.value);
          }}
        ></TextField>
        <TextField
          size="small"
          label="E-mail"
          sx={{ width: "100%" }}
          defaultValue={selectedRFID.Email || ""}
          onChange={(e) => {
            onChange("Email", e.target.value);
          }}
        ></TextField>
      </FormControl>
      <FormControl fullWidth>
        <TextField
          size="small"
          label="Name"
          defaultValue={selectedRFID.Name || ""}
          onChange={(e) => {
            onChange("name", e.target.value);
          }}
        ></TextField>
      </FormControl>

      <FormControl fullWidth>
        <Accordion>
          <AccordionSummary>
            <Typography color="primary.dark" variant="h6">
              Access Technologies Groups
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SelectableList
              items={acctecGroups}
              multiselect={true}
              selected={selectedRFID._Group}
              onChange={(e) => {
                selectedRFIDDispatch({
                  type: "SET_PRIVATE_ACCTEC_GROUP",
                  payload: e,
                });
              }}
            />
          </AccordionDetails>
        </Accordion>
      </FormControl>
      <FormControl fullWidth>
        <Accordion>
          <AccordionSummary>
            <Typography color="primary.dark" variant="h6">
              Controller Groups
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SelectableList
              items={controllerGroups}
              multiselect={false}
              selected={selectedRFID._ControllerGroup}
              onChange={(e) => {
                selectedRFIDDispatch({
                  type: "SET_PRIVATE_CONTROLLER_GROUP",
                  payload: e,
                });
              }}
            />
          </AccordionDetails>
        </Accordion>
      </FormControl>
      <FormControl fullWidth>
        <Accordion>
          <AccordionSummary>
            <Typography color="primary.dark" variant="h6">
              Admin Note
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              size="small"
              label="Write anything here for your own reference"
              multiline
              fullWidth
              defaultValue={selectedRFID.AdminNote || ""}
              onChange={(e) => {
                onChange("admin_note", e.target.value);
              }}
            ></TextField>
          </AccordionDetails>
        </Accordion>
      </FormControl>
      <FormActionButtons
        onCancel={() => {
          handleCancel();
        }}
        onSave={() => {
          onSave();
        }}
      />
    </div>
  );
};
