import * as React from "react";
import { Axios } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
import { IdentityJsonbView } from "./Unit";
import {
  ListItemButton,
  List,
  ListItemText,
  Button,
  FormControl,
  FormGroup,
  ListItem,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import identity from "./identity.scss";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { TabPanel } from "../HR/Users";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import NumberFormat from "react-number-format";
import { DataGrid } from "@mui/x-data-grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix="$"
    />
  );
});

const InitialFormData = {
  default_string: {
    type: "string",
    name: "default_string",
    value: "",
    meta: {
      default: "",
      required: true,
      max_char: 0,
    },
  },
  default_text: {
    type: "text",
    name: "default_text",
    value: "",
    meta: {
      required: true,
      default: "",
    },
  },
  default_single_choice: {
    type: "text",
    name: "default_single_choice",
    value: "",
    pre_new_choice: "",
    meta: {
      required: true,
      default: "",
      choices: [],
    },
  },
  default_multiple_choice: {
    type: "text",
    name: "default_multiple_choice",
    value: "",
    pre_new_choice: "",
    meta: {
      required: true,
      default: "",
      choices: [],
    },
  },
  default_number: {
    type: "number",
    name: "default_number",
    value: "",
    meta: {
      required: true,
      default: -1,
      min: -1,
      max: -1,
    },
  },
  default_integer: {
    type: "integer",
    name: "default_integer",
    value: "",
    meta: {
      required: true,
      default: -1,
      min: -1,
      max: -1,
    },
  },
  default_rating: {
    type: "string",
    name: "default_rating",
    value: "",
    meta: {
      required: true,
      default: "",
    },
  },
  default_file: {
    type: "string",
    name: "default_file",
    value: "",
    meta: {
      required: true,
      default: "",
    },
  },
  default_image: {
    type: "string",
    name: "default_image",
    value: "",
    meta: {
      required: true,
      default: "",
    },
  },
};

const MultiSelectTableColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "value", headerName: "Value", width: 200 },
  { field: "default", headerName: "Default", width: 76 },
  { field: "delete", headerName: "Delete", width: 76 },
];
const SingleSelectTableColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "value", headerName: "Value", width: 200 },
  { field: "default", headerName: "Default", width: 76 },
  { field: "delete", headerName: "Delete", width: 76 },
];

const IdentityForm = () => {
  const [identity, setIdentity] = React.useState({});
  const [identityFieldType, setIdentityFieldType] = React.useState("string");
  const [formData, setFormData] = React.useState(InitialFormData);
  const [tabRoute, setTabRoute] = React.useState(0);
  const [fieldArray, setFieldArray] = React.useState([]);
  const [selectedField, setSelectedField] = React.useState({});

  function handleChangeFieldType(type) {
    setIdentityFieldType(type);
  }

  function handleChangeTabRoute(event, route) {
    setTabRoute(route);
  }

  function retrieveMetaList(list) {
    if (formData["default_" + list]?.meta?.choices?.length > 0) {
      return formData["default_" + list].meta.choices;
    } else {
      return [{ value: "", default: true }];
    }
  }

  function addItemToList() {
    let choice = formData["default_" + identityFieldType].pre_new_choice;
    let choices = [...formData["default_" + identityFieldType].meta.choices];
    if (choice && !choices.some((item) => item.value === choice)) {
      choices.push({ value: choice, id: choices.length + 1, default: false });
      formData["default_" + identityFieldType].meta.choices = choices;
      formData["default_" + identityFieldType].pre_new_choice = "";
      setFormData({ ...formData });
    }
  }

  function toggleDefaultToList(field) {
    let choices = [...formData["default_" + identityFieldType].meta.choices];
    if (identityFieldType === "single_choice") {
      choices.forEach((item) => {
        if (item.value !== field.value) item.default = false;
      });
    }
    let index = choices.findIndex((x) => x.id === field.id);
    choices[index].default = !choices[index].default;
    formData["default_" + identityFieldType].meta.choices = choices;
    setFormData({ ...formData });
  }

  function removeItemFromList(value) {
    let choices = [...formData["default_" + identityFieldType].meta.choices];
    choices = choices.filter((choice) => choice.value !== value);
    formData["default_" + identityFieldType].meta.choices = choices;
    setFormData({ ...formData });
  }

  function handleChangeFieldParam(event) {
    function clampDefaultNumber(newMin = -1, newMax = -1) {
      let { Default } = formData["default_" + identityFieldType];
      let { min, max } = formData["default_" + identityFieldType].meta;
      let newDefaultVal = -1;

      if (min === -1 && newMin !== min) min = newMin;
      if (max === -1 && newMax !== max) max = newMax;
      if (max !== -1) {
        if (value > max) value = max;
      }
      if (max !== -1) {
        if (value < min) value = min;
      }
      let newFormData = { ...formData };
      newFormData["default_" + identityFieldType].default = min;
    }
    let { value, name, checked } = event.target;
    const META_FIELDS = ["required", "default", "max_char", "min", "max"];
    let meta_escape_flag = true;
    // Validation

    if (name === "default_number") {
      name = "default";
      meta_escape_flag = false;
      clampDefaultNumber();
    }

    if (name === "required") {
      value = checked;
    }
    if (
      name === "max_char" ||
      name === "min" ||
      name === "max" ||
      (name === "default" && meta_escape_flag === false)
    ) {
      value = parseFloat(value);
      if (isNaN(value) || value < -1) {
        value = 0;
      }
      if (name === "min") clampDefaultNumber(value);
      if (name === "max") clampDefaultNumber(-1, value);
    }

    console.log(name, meta_escape_flag);
    // Data persisting
    if (META_FIELDS.includes(name) && meta_escape_flag) {
      setFormData({
        ...formData,
        ["default_" + identityFieldType]: {
          ...formData["default_" + identityFieldType],
          meta: {
            ...formData["default_" + identityFieldType].meta,
            [name]: value,
          },
        },
      });
    } else {
      setFormData({
        ...formData,
        ["default_" + identityFieldType]: {
          ...formData["default_" + identityFieldType],
          [name]: value,
        },
      });
    }
  }

  function handleAddField() {
    setFieldArray([
      ...fieldArray,
      {
        type: identityFieldType,
        name: formData[`default_${identityFieldType}`].name,
        value: formData[`default_${identityFieldType}`].value,
        meta: {
          ...formData[`default_${identityFieldType}`].meta,
        },
      },
    ]);
    setFormData(InitialFormData);
  }

  function handleClickField(index) {}

  return (
    <div className="IdentityContainer">
      <div className="IdentityForm">
        {/* add MUI list of field types [text, string, single_choice, multiple_choice, number, integer, rating, file, image, location] */}
        <div className="IdentityTypeList">
          <Box sx={{ padding: 0, m: 0 }}>
            <Tabs value={tabRoute} onChange={handleChangeTabRoute}>
              <Tab label="Types"></Tab>
              <Tab label={"Fields: " + fieldArray.length}></Tab>
            </Tabs>

            <TabPanel value={tabRoute} index={0}>
              <List sx={{ padding: 0 }}>
                <ListItemButton
                  selected={identityFieldType === "string"}
                  onClick={() => {
                    handleChangeFieldType("string");
                  }}
                >
                  <ListItemText primary="String" />
                </ListItemButton>
                <ListItemButton
                  selected={identityFieldType === "text"}
                  onClick={() => {
                    handleChangeFieldType("text");
                  }}
                >
                  <ListItemText primary="Text" />
                </ListItemButton>
                <ListItemButton
                  selected={identityFieldType === "single_choice"}
                  onClick={() => {
                    handleChangeFieldType("single_choice");
                  }}
                >
                  <ListItemText primary="Single Choice" />
                </ListItemButton>
                <ListItemButton
                  selected={identityFieldType === "multiple_choice"}
                  onClick={() => {
                    handleChangeFieldType("multiple_choice");
                  }}
                >
                  <ListItemText primary="Multiple Choice" />
                </ListItemButton>
                <ListItemButton
                  selected={identityFieldType === "number"}
                  onClick={() => {
                    handleChangeFieldType("number");
                  }}
                >
                  <ListItemText primary="Number" />
                </ListItemButton>
                <ListItemButton
                  selected={identityFieldType === "integer"}
                  onClick={() => {
                    handleChangeFieldType("integer");
                  }}
                >
                  <ListItemText primary="Integer" />
                </ListItemButton>
                <ListItemButton
                  selected={identityFieldType === "rating"}
                  onClick={() => {
                    handleChangeFieldType("rating");
                  }}
                >
                  <ListItemText primary="Rating" />
                </ListItemButton>
                <ListItemButton
                  selected={identityFieldType === "file"}
                  onClick={() => {
                    handleChangeFieldType("file");
                  }}
                >
                  <ListItemText primary="File" />
                </ListItemButton>
                <ListItemButton
                  selected={identityFieldType === "image"}
                  onClick={() => {
                    handleChangeFieldType("image");
                  }}
                >
                  <ListItemText primary="Image" />
                </ListItemButton>
                <ListItemButton
                  selected={identityFieldType === "location"}
                  onClick={() => {
                    handleChangeFieldType("location");
                  }}
                  disabled
                >
                  <ListItemText primary="Location" />
                </ListItemButton>
              </List>
            </TabPanel>
            <TabPanel value={tabRoute} index={1}>
              <List sx={{ padding: 0 }}>
                {fieldArray.map((field, index) => {
                  return (
                    <ListItemButton
                      key={index}
                      onClick={() => {
                        handleClickField(index);
                      }}
                    >
                      <ListItemText primary={field.name} />
                    </ListItemButton>
                  );
                })}
              </List>
            </TabPanel>
          </Box>
        </div>
        <Container
          component={Paper}
          sx={{ maxWidth: "60ch", marginTop: 4, p: 1 }}
        >
          <div className="IdentityFormInput">
            {/* --- ALL BEFORE --- */}
            <FormControl fullWidth variant="standard">
              <span className="UnitFormInput__SingleFile">
                <TextField
                  id="standard-basic"
                  label="Field Name"
                  variant="standard"
                  sx={{ width: "100%" }}
                  name="name"
                  onChange={handleChangeFieldParam}
                  value={formData["default_" + identityFieldType].name}
                />
                <FormControlLabel
                  label="Input Required"
                  control={
                    <Checkbox
                      name="required"
                      onChange={handleChangeFieldParam}
                      checked={
                        formData["default_" + identityFieldType].meta?.required
                      }
                    />
                  }
                />
              </span>
            </FormControl>

            {/* --- STRING FIELD --- */}
            <div
              className={`${
                identityFieldType === "string" ? "active" : "hidden"
              }`}
            >
              <FormControl FormControl fullWidth variant="standard">
                <span className="UnitFormInput__SingleFile">
                  <TextField
                    id="standard-basic"
                    label="Default value"
                    variant="standard"
                    name="default"
                    onChange={handleChangeFieldParam}
                    value={
                      formData["default_" + identityFieldType].meta.default
                    }
                    sx={{ width: "100%", paddingRight: 3 }}
                  ></TextField>
                </span>
              </FormControl>
              <FormControl
                fullWidth
                sx={{
                  m: 1,
                  width: "auto",
                  display: "grid",
                  justifyContent: "center",
                }}
                variant="standard"
              >
                <FormControlLabel
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                  control={
                    <TextField
                      sx={{
                        width: "30%",
                        marginRight: "1em",
                        marginLeft: "2em",
                      }}
                      name="max_char"
                      onChange={handleChangeFieldParam}
                      value={
                        formData["default_" + identityFieldType].meta.max_char
                      }
                      id="outlined-adornment-weight"
                      inputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                      aria-describedby="outlined-weight-helper-text"
                    />
                  }
                  label="# Max characters"
                />
              </FormControl>
            </div>

            {/* --- TEXT FIELD --- */}
            <div
              className={`${
                identityFieldType === "text" ? "active" : "hidden"
              }`}
            >
              <span className="UnitFormInput__SingleFile">
                <TextField
                  id="standard-basic"
                  multiline
                  label="Default value"
                  name="default"
                  onChange={handleChangeFieldParam}
                  variant="standard"
                  sx={{ width: "100%", paddingRight: 3 }}
                />
              </span>
            </div>

            {/* --- SINGLE CHOICE FIELD --- */}
            <div
              className={`${
                identityFieldType === "single_choice" ? "active" : "hidden"
              }`}
            >
              <div className="IdentityForm__single_choice">
                <Box sx={{ m: 1, display: "flex" }}>
                  <TextField
                    id="standard-basic"
                    label="Add Choice"
                    name="pre_new_choice"
                    value={
                      formData["default_" + identityFieldType].pre_new_choice
                    }
                    onChange={handleChangeFieldParam}
                    sx={{ width: "100%", m: 0.5 }}
                    variant="standard"
                  />
                  <Button
                    variant="outlined"
                    sx={{ m: 0.5 }}
                    onClick={addItemToList}
                  >
                    Add
                  </Button>
                </Box>
                <TableContainer sx={{ m: 1, marginTop: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell width={200}>Choice</TableCell>
                        <TableCell width={78}>Default</TableCell>
                        <TableCell width={78}>Delete</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {retrieveMetaList("single_choice").map((field, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>{field.value}</TableCell>
                            <TableCell>
                              <Checkbox
                                checked={field.default}
                                onClick={() => {
                                  toggleDefaultToList(field);
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                aria-label="Example"
                                onClick={() => {
                                  removeItemFromList(field.value);
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>

            {/* --- MULTIPLE CHOICE FIELD --- */}
            <div
              className={`${
                identityFieldType === "multiple_choice" ? "active" : "hidden"
              }`}
            >
              <div className="IdentityForm__single_choice">
                <Box sx={{ m: 1, display: "flex" }}>
                  <TextField
                    id="standard-basic"
                    label="Add Choice"
                    name="pre_new_choice"
                    value={
                      formData["default_" + identityFieldType].pre_new_choice
                    }
                    onChange={handleChangeFieldParam}
                    sx={{ width: "100%", m: 0.5 }}
                    variant="standard"
                  />
                  <Button
                    variant="outlined"
                    sx={{ m: 0.5 }}
                    onClick={addItemToList}
                  >
                    Add
                  </Button>
                </Box>
                <TableContainer sx={{ m: 1, marginTop: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell width={200}>Choice</TableCell>
                        <TableCell width={78}>Default</TableCell>
                        <TableCell width={78}>Delete</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {retrieveMetaList("multiple_choice").map(
                        (field, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell>{field.value}</TableCell>
                              <TableCell>
                                <Checkbox
                                  checked={field.default}
                                  onClick={() => {
                                    toggleDefaultToList(field);
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <IconButton
                                  aria-label="Example"
                                  onClick={() => {
                                    removeItemFromList(field.value);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>

            {/* --- NUMBER FIELD --- */}
            <div
              className={`${
                identityFieldType === "number" ? "active" : "hidden"
              }`}
            >
              <FormControl
                fullWidth
                sx={{
                  m: 1,
                  width: "auto",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
                variant="standard"
              >
                <FormControlLabel
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                  control={
                    <TextField
                      sx={{
                        width: "30%",
                      }}
                      name="default_number"
                      onChange={handleChangeFieldParam}
                      value={formData["default_" + identityFieldType].default}
                      id="outlined-adornment-weight"
                      inputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                      aria-describedby="outlined-weight-helper-text"
                    />
                  }
                  label="Default Value"
                />
              </FormControl>
              <FormControl
                fullWidth
                sx={{
                  m: 1,
                  width: "auto",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
                variant="standard"
              >
                <FormControlLabel
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                  control={
                    <TextField
                      sx={{
                        width: "30%",
                      }}
                      name="min"
                      onChange={handleChangeFieldParam}
                      value={formData["default_" + identityFieldType].meta.min}
                      id="outlined-adornment-weight"
                      inputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                      aria-describedby="outlined-weight-helper-text"
                    />
                  }
                  label="Min Value"
                />
                <FormControlLabel
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                  control={
                    <TextField
                      sx={{
                        width: "30%",
                      }}
                      name="max"
                      onChange={handleChangeFieldParam}
                      value={formData["default_" + identityFieldType].meta.max}
                      id="outlined-adornment-weight"
                      inputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                      aria-describedby="outlined-weight-helper-text"
                    />
                  }
                  label="Max Value"
                />
              </FormControl>
            </div>

            {/* --- INTEGER FIELD --- */}
            <div
              className={`${
                identityFieldType === "integer" ? "active" : "hidden"
              }`}
            >
              <FormControl
                fullWidth
                sx={{
                  m: 1,
                  width: "auto",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
                variant="standard"
              >
                <FormControlLabel
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                  control={
                    <TextField
                      sx={{
                        width: "30%",
                      }}
                      name="default_number"
                      onChange={handleChangeFieldParam}
                      value={formData["default_" + identityFieldType].default}
                      id="outlined-adornment-weight"
                      inputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                      aria-describedby="outlined-weight-helper-text"
                    />
                  }
                  label="Default Value"
                />
              </FormControl>
              <FormControl
                fullWidth
                sx={{
                  m: 1,
                  width: "auto",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
                variant="standard"
              >
                <FormControlLabel
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                  control={
                    <TextField
                      sx={{
                        width: "30%",
                      }}
                      name="min"
                      onChange={handleChangeFieldParam}
                      value={formData["default_" + identityFieldType].meta.min}
                      id="outlined-adornment-weight"
                      inputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                      aria-describedby="outlined-weight-helper-text"
                    />
                  }
                  label="Min Value"
                />
                <FormControlLabel
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                  control={
                    <TextField
                      sx={{
                        width: "30%",
                      }}
                      name="max"
                      onChange={handleChangeFieldParam}
                      value={formData["default_" + identityFieldType].meta.max}
                      id="outlined-adornment-weight"
                      inputProps={{
                        inputComponent: NumberFormatCustom,
                      }}
                      aria-describedby="outlined-weight-helper-text"
                    />
                  }
                  label="Max Value"
                />
              </FormControl>
            </div>

            {/* --- RATING FIELD --- */}
            <div
              className={`${
                identityFieldType === "rating" ? "active" : "hidden"
              }`}
            >
              7
            </div>

            {/* --- FILE FIELD --- */}
            <div
              className={`${
                identityFieldType === "file" ? "active" : "hidden"
              }`}
            >
              8
            </div>

            {/* --- IMAGE FIELD --- */}
            <div
              className={`${
                identityFieldType === "image" ? "active" : "hidden"
              }`}
            >
              9
            </div>

            {/* --- LOCATION FIELD --- */}
            <div
              className={`${
                identityFieldType === "location" ? "active" : "hidden"
              }`}
            >
              10
            </div>

            {/* --- ALL AFTER --- */}
            <Button
              variant="outlined"
              onClick={() => {
                handleAddField();
              }}
            >
              Add field
            </Button>
          </div>
        </Container>
      </div>
    </div>
  );
};

export const Identity = ({}) => {
  // get identity from api
  const [identity, setIdentity] = React.useState({});
  const { id } = useParams("id");

  React.useEffect(() => {
    if (id !== undefined) {
      Axios.get("/api/unit_identities/" + id)
        .then((response) => {
          setIdentity(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);
  if (id === undefined) {
    return <IdentityForm />;
  }
  return <IdentityJsonbView identity={identity} />;
};

export default Identity;
