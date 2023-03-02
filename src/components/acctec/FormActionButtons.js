const { FormControl, Button } = require("@mui/material");

export const FormActionButtons = ({ onCancel, onSave, onDelete }) => {
  return (
    <FormControl
      fullWidth
      sx={{
        display: "flex",
        flexDirection: "row",
        mt: 2,
        gap: 2,
      }}
    >
      {onCancel && (
        <Button
          fullWidth
          variant="outlined"
          color="warning"
          onClick={() => {
            onCancel();
          }}
        >
          Cancel
        </Button>
      )}
      {onSave && (
        <Button
          fullWidth
          variant="contained"
          color="success"
          onClick={() => {
            onSave();
          }}
        >
          Accept
        </Button>
      )}
      {onDelete && (
        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={() => {
            onDelete();
          }}
        >
          Delete
        </Button>
      )}
    </FormControl>
  );
};

export default FormActionButtons;
