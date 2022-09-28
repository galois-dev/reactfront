import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Rating from "@mui/material/Rating";
import { Axios } from "../../../pages/index";

export const InputHeaderRow = ({ row, identity }) => {
  const [formData, setFormData] = React.useState({
    stringValue: "",
    numberValue: 0,
    integerValue: 0,
    textValue: "",
    single_choice_value: "",
    multiple_choice_value: [],
    ratingValue: 0,
    fileValue: {},
  });
  const previousField = row[1][0];
  const { unit, type, status, id, meta, name } = previousField;
  console.log(unit);
  function uploadField() {
    console.log("uploading field");

    if (type === "file" || type === "image") {
      console.log({
        id: unit,
        type: type,
        status: status,
        meta: meta,
        name: name,
        file_holder: formData["fileValue"],
      });
      Axios.post("/api/addUnitField", {
        id: unit,
        type: type,
        status: status,
        meta: meta,
        name: name,
      })
        .then((res) => {
          console.log(res);
          let id = res.data.id;
          let file = document.querySelector("#file").files[0];
          let formdata = new FormData(file);
          Axios.put(
            "/api/addUnitField",
            { id, formdata },
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          ).catch((err) => {
            console.log(err);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      let value_result = undefined;
      console.log(type);
      switch (type) {
        case "string":
          value_result = defaultValueChain("stringValue");
          break;
        case "number":
          value_result = defaultValueChain("numberValue");
          break;
        case "integer":
          value_result = defaultValueChain("integerValue");
          break;
        case "text":
          value_result = defaultValueChain("textValue");
          break;
        case "single_choice":
          value_result = defaultValueChain("single_choice_value");
          break;
        case "multiple_choice":
          value_result = defaultValueChain("multiple_choice_value");
          break;
        case "rating":
          value_result = defaultValueChain("ratingValue");
          break;
        case "file":
          value_result = defaultValueChain("fileValue");
          break;
        case "image":
          value_result = defaultValueChain("fileValue");
          break;
      }

      Axios.post("/api/addUnitField", {
        id: unit,
        type: type,
        status: "A",
        meta: meta,
        name: name,
        value: value_result,
      });
    }
  }

  function handleParamChange(event) {
    let { value, name, checked, files } = event.target;
    if (type === "file" || type === "image") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  }

  function defaultValueChain(name) {
    console.log(formData[name]);
    if (
      (name === "multiple_choice_value" || name === "single_choice_value") &&
      (formData[name] === "" || formData[name].length === 0)
    ) {
      let choices = meta.choices;
      let defaults = [];

      choices.forEach((choice) => {
        if (choice.default) {
          defaults.push(choice.value);
        }
      });

      if (name === "multiple_choice_value") {
        formData[name] = defaults;
        return defaults;
      } else {
        formData[name] = defaults[0];
        return defaults[0];
      }
    }

    if (
      (typeof formData[name] === "string" && formData[name] !== "") ||
      (typeof formData[name] === "number" && formData[name] !== 0) ||
      (typeof formData[name] === "object" &&
        Object.keys(formData[name]).length !== 0)
    ) {
      return formData[name];
    }

    if (meta.recall_last === true) {
      if (
        previousField.value !== undefined &&
        previousField.value !== "" &&
        formData[name] === ""
      ) {
        return previousField.value;
      }
    }

    if (meta.default !== undefined && meta.default !== "") {
      return meta.default;
    }

    return formData[name];
  }

  // console.log(row[1][0]);
  // console.log(identity.field_jsonb[row[0]].meta.default);
  return (
    <Paper sx={{ m: 2 }}>
      <div className="unit_table__input">
        <div className="input__form_info">
          {Object.keys(identity.field_jsonb[row[0]].meta).map(
            (value, index) => {
              return (
                <div className="input_form_info_cell" key={String(index)}>
                  <div sx={{ color: "gray", fontSize: "10" }}>
                    {String(value).replaceAll("_", " ")}
                  </div>
                  <div>
                    {(() => {
                      switch (
                        Object.keys(identity.field_jsonb[row[0]].meta)[index]
                      ) {
                        case "choices":
                          return (
                            <div sx={{ color: "black", fontSize: "16px" }}>
                              {Object.values(identity.field_jsonb[row[0]].meta)[
                                index
                              ].map((V, I) => {
                                return (
                                  <div
                                    key={String(I)}
                                    sx={{ color: "black", fontSize: "16px" }}
                                  >
                                    {I + 1}: {V.value}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        default:
                          return (
                            <p sx={{ color: "black", fontSize: "16px" }}>
                              {String(
                                Object.values(
                                  identity.field_jsonb[row[0]].meta
                                )[index]
                              )
                                .replace("0", "unset")
                                .replace("-1", "unset")}
                            </p>
                          );
                      }
                    })()}
                  </div>
                </div>
              );
            }
          )}
        </div>
        <div className="input__form">
          {(() => {
            switch (row[1][0].type) {
              case "string":
                return (
                  <TextField
                    id="outlined-basic"
                    label="Value"
                    variant="outlined"
                    name="stringValue"
                    onChange={handleParamChange}
                    value={defaultValueChain("stringValue")}
                  />
                );
              case "text":
                return (
                  <TextField
                    id="outlined-basic"
                    label="Value"
                    variant="outlined"
                  />
                );
              case "single_choice":
                return (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="single_choice_value"
                    value={defaultValueChain("single_choice_value")}
                    label="Age"
                    onChange={handleParamChange}
                  >
                    {meta.choices.map((choice, index) => {
                      console.log(choice);
                      return (
                        <MenuItem key={index} value={choice.value}>
                          {choice.value}
                        </MenuItem>
                      );
                    })}
                  </Select>
                );
              case "multiple_choice":
                return (
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={defaultValueChain("multiple_choice_value")}
                    label="Age"
                    onChange={handleParamChange}
                    multiple
                  >
                    {meta.choices.map((choice, index) => {
                      return (
                        <MenuItem key={index} value={choice.value}>
                          {choice.value}
                        </MenuItem>
                      );
                    })}
                  </Select>
                );
              case "number":
                return (
                  <TextField
                    id="outlined-basic"
                    label="Value"
                    variant="outlined"
                    name="numberValue"
                    onChange={handleParamChange}
                    value={Number(defaultValueChain("numberValue"))}
                  />
                );
              case "integer":
                return (
                  <TextField
                    id="outlined-basic"
                    label="Value"
                    variant="outlined"
                    name="integerValue"
                    onChange={handleParamChange}
                    value={Number(defaultValueChain("integerValue"))}
                  />
                );
              case "rating":
                return (
                  <div>
                    <Rating
                      name="ratingValue"
                      value={Number(defaultValueChain("ratingValue"))}
                      onChange={handleParamChange}
                    />
                  </div>
                );
              case "file":
                return (
                  <input
                    type="file"
                    name="fileValue"
                    id="file"
                    onChange={handleParamChange}
                  />
                );
              case "image":
                return (
                  <input
                    type="file"
                    name="fileValue"
                    id="file"
                    onChange={handleParamChange}
                  />
                );
              case "location":
                return <p>Under construction</p>;
              default:
                return <p>Under construction</p>;
            }
          })()}
          <Button
            variant="outlined"
            onClick={() => {
              uploadField();
            }}
          >
            Add field
          </Button>
        </div>
      </div>
    </Paper>
  );
};

export const FieldBodyRow = ({ field }) => {
  // if (typeof field?.value === "string" && field.value !== "") {
  //   if (field?.value?.includes('"')) {
  //     field.value = JSON.parse(field?.value.replaceAll("'", '"'));
  //   } else {
  //     field.value = JSON.parse(field?.value);
  //   }
  // }
  console.log(field);
  if (
    field.value === undefined ||
    field.value === null ||
    (typeof field.value === "object" && Object.keys(field.value).length === 0)
  ) {
    field.value = "";
  }
  if (
    field.meta === undefined ||
    (typeof field.meta === "object" && Object.keys(field.meta).length === 0)
  ) {
    field.meta = "";
  }

  return (
    <TableRow>
      <TableCell>{field.type}</TableCell>
      <TableCell>{field.name}</TableCell>
      <TableCell>{String(field.value)}</TableCell>
      <TableCell></TableCell>
      {/* <TableCell>{JSON.stringify(field.meta)}</TableCell> */}
      <TableCell>
        {new Date(field.date_created).toLocaleDateString() +
          " - " +
          new Date(field.date_created).toLocaleTimeString()}
      </TableCell>
    </TableRow>
  );
};

export default { FieldBodyRow, InputHeaderRow };
