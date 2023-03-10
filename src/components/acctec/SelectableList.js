import LoadingComponent from "@components/sitecore/LoadingComponent";
import {
  Checkbox,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";

export const SelectableList = ({
  items,
  selected,
  onChange,
  multiselect = false,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const onSelect = (item) => {
    if (item !== undefined) {
      if (multiselect) {
        let newSelect = selectedItems.filter((i) => i !== item);
        if (newSelect.length === selectedItems.length) {
          newSelect.push(item);
        }
        setSelectedItems(newSelect);
        onChange(newSelect);
      } else {
        if (selectedItems.includes(item)) {
          setSelectedItems([]);
          onChange([]);
        } else {
          setSelectedItems(item);
          onChange(item);
        }
      }
    } else {
      setSelectedItems([]);
      onChange([]);
    }
  };

  useEffect(() => {
    if (selected !== undefined) {
      if (multiselect === false) {
        setSelectedItems([selected]);
      } else {
        if (selected.length !== 0) {
          setSelectedItems(selected.map((i) => i));
        }
      }
    }
  }, [selected]);

  if (items === undefined || items.length === 0) {
    return <LoadingComponent />;
  }

  return (
    <div>
      {items.map((item) => (
        <ListItemButton
          key={item.id}
          button
          selected={selectedItems.includes(item.id)}
          onClick={() => onSelect(item.id)}
        >
          <ListItemText primary={item.Name} />
          <Checkbox checked={selectedItems.includes(item.id)} />
        </ListItemButton>
      ))}
    </div>
  );
};
export default SelectableList;
