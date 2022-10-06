import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";


export const IdentityJsonbView = ({ identity }) => {
  let childRows = [];

  if (identity === undefined || Object.keys(identity).length === 0) {
    return <div>Identity not found</div>;
  }

  if (typeof identity.field_jsonb === "string") {
    identity.field_jsonb = JSON.parse(identity.field_jsonb);
  }

  Object.keys(identity.field_jsonb).forEach((field) => {
    childRows.push({
      field: field,
      value: identity.field_jsonb[field].value,
      type: identity.field_jsonb[field].type,
      meta: identity.field_jsonb[field].meta,
    });
  });

  const RowItem = ({ field, value, type, meta }) => {
    return (
      <TableRow>
        <TableCell>{field}</TableCell>
        <TableCell>{type}</TableCell>
        <TableCell>{typeof value === "Object" ? value : ""}</TableCell>
        <TableCell>{typeof meta === "Object" ? meta : ""}</TableCell>
      </TableRow>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Field Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Default Value</TableCell>
            <TableCell>Meta Options</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {childRows.map((row, index) => {
            return (
              <RowItem
                key={index}
                field={row.field}
                value={row.value}
                type={row.type}
                meta={row.meta}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default IdentityJsonbView;
