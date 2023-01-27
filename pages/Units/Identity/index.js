import * as React from "react";
import { Axios } from "@pages/index";
import { useRouter } from "next/router";
import { IdentityJsonbView } from "@components/Units/IdentityJsonbView";
import {
  ListItemButton,
  List,
  ListItemText,
  Button,
  FormControl,
  FormGroup,
  ListItem,
  Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { TabPanel } from "@components/sitecore/TabPanel";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { DataGrid } from "@mui/x-data-grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";

const InitialFormData = {
  default_string: {
    type: "string",
    name: "default_string",
    value: "",
    meta: {
      default: "",
      required: true,
      recall_last: true,
      max_char: 0,
    },
  },
  default_text: {
    type: "text",
    name: "default_text",
    value: "",
    meta: {
      required: true,
      recall_last: true,
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
      recall_last: true,
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
      recall_last: true,
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
      recall_last: true,
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
      recall_last: true,
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
      recall_last: true,
      default: 3,
      double_precision: false,
      max: 5,
    },
  },
  default_file: {
    type: "string",
    name: "default_file",
    value: "",
    meta: {
      required: true,
      recall_last: true,
      default: "",
    },
  },
  default_image: {
    type: "string",
    name: "default_image",
    value: "",
    meta: {
      required: true,
      recall_last: true,
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
  const [fieldIndex, setFieldIndex] = React.useState(-1);
  const [identityName, setIdentityName] = React.useState("");

  function handleRemoveIdentity() {
    console.log("Remove Identity");
  }

  function PostIdentity() {
    // remove the pre_new_choice prop from all fields in fieldArray
    let fields = fieldArray.map((field) => {
      delete field.pre_new_choice;
      return field;
    });
    // turn the fieldArray into an object
    let identity = {};
    fields.forEach((field) => {
      identity[field.name] = field;
    });
    // post the identity
    Axios.post("/api/unit_identities/", {
      name: identityName,
      status: "A",
      field_jsonb: identity,
    })
      .then((res) => {
        setFormData(InitialFormData);
        setFieldArray([]);
        setIdentityName("");
        setTabRoute(0);
        setFieldIndex(-1);
      })
      .catch((err) => {
        console.log(err);
      });
  }

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
    function clampDefaultNumber(value) {
      let { min, max } = formData["default_" + identityFieldType].meta;
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
    const META_FIELDS = [
      "required",
      "default",
      "max_char",
      "min",
      "max",
      "recall_last",
      "double_precision",
    ];
    let meta_escape_flag = true;
    // Validation

    if (name === "default_number") {
      name = "default";
      meta_escape_flag = false;
      clampDefaultNumber(value);
    }

    if (
      name === "required" ||
      name === "recall_last" ||
      name === "double_precision"
    ) {
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
      // if (name === "min") clampDefaultNumber(value);
      // if (name === "max") clampDefaultNumber(-1, value);
    }

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
    // Add a field to the fieldArray and reset the formData. Keep it unique on field name.
    let newField = {
      id: fieldArray.length + 1,
      name: formData["default_" + identityFieldType].name,
      type: identityFieldType,
      value: formData["default_" + identityFieldType].default,
      meta: formData["default_" + identityFieldType].meta,
    };
    if (fieldArray.some((item) => item.name === newField.name)) {
      alert("Field name already exists.");
      return;
    }
    setFieldArray([...fieldArray, newField]);
    setFormData(InitialFormData);
  }

  function handleSaveField() {
    // Take field parameters from fromData and save it to fieldArray with unique on field name
    let newFieldArray = [...fieldArray];
    newFieldArray[fieldIndex] = {
      type: identityFieldType,
      name: formData[`default_${identityFieldType}`].name,
      value: formData[`default_${identityFieldType}`].value,
      meta: {
        ...formData[`default_${identityFieldType}`].meta,
      },
    };
    setFieldArray(newFieldArray);
    setFormData(InitialFormData);
    setFieldIndex(-1);
  }

  function handleRemoveField() {
    let newFieldArray = [...fieldArray];
    newFieldArray.splice(fieldIndex, 1);
    setFieldArray(newFieldArray);
    setFormData(InitialFormData);
    setFieldIndex(-1);
  }

  function handleClickField(index) {
    const field = fieldArray[index];
    setFieldIndex(index);
    setFormData({ ...formData, [`default_${field.type}`]: field });
  }

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
                      selected={fieldIndex === index}
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
        <div className={fieldIndex === -1 && tabRoute !== 0 ? "hidden" : ""}>
          <Container component={Paper} sx={{ mt: 4, p: 1 }} fixed>
            <div className="IdentityFormInput">
              {/* --- ALL BEFORE --- */}
              <FormControl fullWidth={true} variant={"standard"}>
                <TextField
                  id="standard-basic"
                  label="Field Name"
                  variant={"standard"}
                  sx={{ width: "100%" }}
                  name="name"
                  onChange={handleChangeFieldParam}
                  value={formData["default_" + identityFieldType].name}
                />
                <span className="UnitFormInput__SingleFile">
                  <FormControlLabel
                    label="Input Required"
                    control={
                      <Checkbox
                        name="required"
                        onChange={handleChangeFieldParam}
                        checked={
                          formData["default_" + identityFieldType].meta
                            ?.required
                        }
                      />
                    }
                  />
                  <FormControlLabel
                    label="Recall Previous Value"
                    control={
                      <Checkbox
                        name="recall_last"
                        onChange={handleChangeFieldParam}
                        checked={
                          formData["default_" + identityFieldType].meta
                            .recall_last
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
                <FormControl FormControl fullWidth={true} variant={"standard"}>
                  <span className="UnitFormInput__SingleFile">
                    <TextField
                      id="standard-basic"
                      label="Default value"
                      variant={"standard"}
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
                  fullWidth={true}
                  sx={{
                    m: 1,
                    width: "auto",
                    display: "grid",
                    justifyContent: "center",
                  }}
                  variant={"standard"}
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
                    variant={"standard"}
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
                      variant={"standard"}
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
                        {retrieveMetaList("single_choice").map(
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
                      variant={"standard"}
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
                  fullWidth={true}
                  sx={{
                    m: 1,
                    width: "auto",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                  variant={"standard"}
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
                        aria-describedby="outlined-weight-helper-text"
                      />
                    }
                    label="Default Value"
                  />
                </FormControl>
                <FormControl
                  fullWidth={true}
                  sx={{
                    m: 1,
                    width: "auto",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                  variant={"standard"}
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
                        value={
                          formData["default_" + identityFieldType].meta.min
                        }
                        id="outlined-adornment-weight"
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
                        value={
                          formData["default_" + identityFieldType].meta.max
                        }
                        id="outlined-adornment-weight"
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
                  fullWidth={true}
                  sx={{
                    m: 1,
                    width: "auto",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                  variant={"standard"}
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
                        aria-describedby="outlined-weight-helper-text"
                      />
                    }
                    label="Default Value"
                  />
                </FormControl>
                <FormControl
                  fullWidth={true}
                  sx={{
                    m: 1,
                    width: "auto",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                  variant={"standard"}
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
                        value={
                          formData["default_" + identityFieldType].meta.min
                        }
                        id="outlined-adornment-weight"
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
                        value={
                          formData["default_" + identityFieldType].meta.max
                        }
                        id="outlined-adornment-weight"
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
                <span className="UnitFormInput__SingleFile">
                  <div>
                    <Typography component="legend">Default Value</Typography>
                    <Rating
                      name="default"
                      precision={
                        formData["default_rating"].meta?.double_precision !==
                        undefined
                          ? formData["default_rating"].meta.double_precision
                            ? 0.5
                            : 1
                          : 1
                      }
                      max={
                        formData["default_rating"].meta.max !== undefined
                          ? formData["default_rating"].meta?.max
                          : 5
                      }
                      value={formData["default_rating"].meta?.default}
                      onChange={handleChangeFieldParam}
                    />
                  </div>
                </span>
                <span className="UnitFormInput__SingleFile">
                  <div>
                    <Typography component="legend">Rating size</Typography>
                    <TextField
                      sx={{
                        width: "40%",
                      }}
                      name="max"
                      onChange={handleChangeFieldParam}
                      value={formData["default_" + identityFieldType].meta.max}
                      id="outlined-adornment-weight"
                      aria-describedby="outlined-weight-helper-text"
                    />
                  </div>
                  <div>
                    <FormControlLabel
                      label="Double precision"
                      control={
                        <Checkbox
                          name="double_precision"
                          onChange={handleChangeFieldParam}
                          checked={
                            formData["default_" + identityFieldType].meta
                              .double_precision
                          }
                        />
                      }
                    />
                  </div>
                </span>
              </div>

              {/* --- FILE FIELD --- */}
              <div
                className={`${
                  identityFieldType === "file" ? "active" : "hidden"
                }`}
              ></div>

              {/* --- IMAGE FIELD --- */}
              <div
                className={`${
                  identityFieldType === "image" ? "active" : "hidden"
                }`}
              ></div>

              {/* --- LOCATION FIELD --- */}
              <div
                className={`${
                  identityFieldType === "location" ? "active" : "hidden"
                }`}
              >
                10
              </div>

              {/* --- ALL AFTER --- */}
              {
                {
                  0: (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        handleAddField();
                      }}
                    >
                      Add field
                    </Button>
                  ),
                  1: (
                    <span className="UnitFormInput__SingleFile">
                      <Button
                        sx={{ width: "100%" }}
                        variant="outlined"
                        onClick={() => {
                          handleRemoveField();
                        }}
                        color="error"
                      >
                        Delete field
                      </Button>
                      <Button
                        sx={{ width: "100%" }}
                        variant="outlined"
                        onClick={() => {
                          handleSaveField();
                        }}
                        color="success"
                      >
                        Save field
                      </Button>
                    </span>
                  ),
                }[tabRoute]
              }
            </div>
          </Container>
          <Container
            component={Paper}
            sx={{ maxWidth: "60ch", marginTop: 4, p: 3, marginBottom: 4 }}
          >
            <Typography variant="h6" component="h1" gutterBottom={true}>
              Name of the identity
            </Typography>
            <TextField
              id="name"
              sx={{ width: "100%", marginBottom: 2 }}
              label="Name"
              variant={"standard"}
              value={identityName}
              onChange={(e) => {
                setIdentityName(e.target.value);
              }}
            />
            {
              {
                1: (
                  <span className="UnitFormInput__SingleFile">
                    <Button
                      sx={{ width: "100%", m: 1 }}
                      variant="outlined"
                      onClick={() => {
                        handleRemoveIdentity();
                      }}
                      color="error"
                    >
                      Delete identity
                    </Button>
                    <Button
                      sx={{ width: "100%", m: 1 }}
                      variant="outlined"
                      onClick={() => {
                        PostIdentity();
                      }}
                      color="success"
                    >
                      Save identity
                    </Button>
                  </span>
                ),
              }[tabRoute]
            }
          </Container>
        </div>
      </div>
    </div>
  );
};

export const Identity = ({}) => {
  // get identity from api
  const [identity, setIdentity] = React.useState({});
  const router = useRouter();
  const { id } = router.query;

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
