import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import TransferList from "./TransferList";

export const ListSelect = ({
  priorList,
  selectedList,
  setPriorList,
  setSelectedList,
  onChange,
}) => {
  return (
    <Box>
      <TransferList
        left={priorList || []}
        right={selectedList || []}
        setLeft={setPriorList}
        setRight={setSelectedList}
        onChange={onChange}
      />
    </Box>
  );
};

export default ListSelect;
