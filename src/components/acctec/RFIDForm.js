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

export const RFIDForm = ({
  selectedRFID,
  setSelectedRFID,
  onCancel,
  onSave,
  controllerGroups,
  acctecGroups,
}) => {
  const [stagedChanges, setStagedChanges] = useState({});
  const [dateActive, setDateActive] = useState(false);

  const onChange = (key, arg) => {
    if (stagedChanges[key] === undefined) {
      setStagedChanges({ ...stagedChanges, [key]: selectedRFID[key] });
    }
    setSelectedRFID({ ...selectedRFID, [key]: arg, dateActive: dateActive });
  };

  const handleCancel = () => {
    for (const key in stagedChanges) {
      selectedRFID[key] = stagedChanges[key];
    }
    onCancel();
  };

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
              selected={selectedRFID.Group}
              onChange={(e) => {}}
            />
            {/* <ListSelect
              priorList={AcctecGroups}
              setPriorList={setAcctecGroups}
              selectedList={selectedAcctecGroups}
              setSelectedList={setSelectedAcctecGroups}
              onChange={(e) => {
                onChange("Group", e);
              }}
            /> */}
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
            {/* <ListSelect
              priorList={ControllerGroups}
              setPriorList={setControllerGroups}
              selectedList={selectedControllerGroups}
              setSelectedList={setSelectedControllerGroups}
              onChange={(e) => {
                onChange("controllerGroup", e);
              }}
            /> */}
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
              onChange={() => {
                onChange("AdminNote", e.target.value);
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
