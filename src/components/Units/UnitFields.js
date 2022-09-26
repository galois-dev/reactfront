import * as React from "react";
import "./Units.scss";
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

export const InputHeaderRow = ({ row }) => {
  return (
    <TableRow>
      <TableCell>
        <TextField
          disabled
          id="outlined-disabled"
          label="Disabled"
          defaultValue={row[1][0].type}
        />
      </TableCell>
      <TableCell>
        <TextField
          disabled
          id="outlined-disabled"
          label="Disabled"
          defaultValue={row[1][0].name}
        />
      </TableCell>
      <TableCell>
        {
          {
            string: (
              <TextField id="outlined-basic" label="Value" variant="outlined" />
            ),
            text: (
              <TextField id="outlined-basic" label="Value" variant="outlined" />
            ),
            single_choice: (
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={age}
                label="Age"
                // onChange={handleChange}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            ),
            multiple_choice: (
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={[10]}
                label="Age"
                multiple
                // onChange={handleChange}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            ),
            number: (
              <TextField id="outlined-basic" label="Value" variant="outlined" />
            ),
            integer: (
              <TextField id="outlined-basic" label="Value" variant="outlined" />
            ),
            rating: (
              <Rating
                name="simple-controlled"
                // value={value}
                // onChange={(event, newValue) => {
                //   setValue(newValue);
                // }}
              />
            ),
            file: (
              <input
                type="file"
                // value={selectedFile}
                // onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            ),
            image: (
              <input
                type="file"
                // value={selectedFile}
                // onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            ),
            location: <p>Under construction</p>,
          }[row[1][0].type]
        }
      </TableCell>
      <TableCell>
        <TextField
          id="outlined-basic"
          label="Disabled"
          variant="outlined"
          disabled
          defaultValue="meta"
        />
      </TableCell>
      <TableCell>
        <Button variant="outlined">Add field</Button>
      </TableCell>
    </TableRow>
  );
};

export const FieldBodyRow = ({ field }) => {
  return (
    <TableRow>
      <TableCell>{field.type}</TableCell>
      <TableCell>{field.name}</TableCell>
      <TableCell>
        {field?.value.includes('"')
          ? JSON.parse(field?.value).value
          : JSON.parse(field?.value.replaceAll("'", '"')).value}
      </TableCell>
      <TableCell>{field.meta}</TableCell>
      <TableCell>
        {new Date(field.date_created).toLocaleDateString() +
          " - " +
          new Date(field.date_created).toLocaleTimeString()}
      </TableCell>
    </TableRow>
  );
};

export default { FieldBodyRow, InputHeaderRow };
