import LoadingComponent from "@components/sitecore/LoadingComponent";
import { Checkbox, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";

export const SelectableList = ({
  items,
  selected,
  onChange,
  multiselect = false,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const onSelect = (item) => {
    if (multiselect) {
      if (selectedItems.includes(item)) {
        setSelectedItems(selectedItems.filter((i) => i !== item.id));
      } else {
        setSelectedItems([...selectedItems, item.id]);
      }
    } else {
      setSelectedItems([item.id]);
    }
  };

  useEffect(() => {
    setSelectedItems(selected.id);
  }, [selected]);

  useEffect(() => {
    onChange(selectedItems);
  }, [selectedItems]);

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
