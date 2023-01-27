import React from "react";
import styles from "@styles/Subroutinglist.module.scss";
import { useRouter } from "next/router";
import Icon from "@mui/material/Icon";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import RadarIcon from "@mui/icons-material/Radar";
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

export const SubRoutingList = ({ items }) => {
  let [expanded, setExpanded] = React.useState(-1);
  React.useEffect(() => {
    items.forEach((item) => {
      assert(item["name"] !== undefined, "name is undefined");
      assert(item["body"] !== undefined, "name is undefined");
      assert(item["to"] !== undefined, "name is undefined");
    });
  }, [items]);
  let router = useRouter();

  if (items.length === 0) return null;

  return (
    <div className={styles.container}>
      {items.map((item, index) => {
        return (
          <div
            className={styles.pill}
            key={index}
            onClick={() => {
              router.push(item.to);
            }}
            onMouseOver={() => {
              setExpanded(index);
            }}
            onMouseLeave={() => {
              setExpanded(-1);
            }}
            onTouchMove={() => {
              setExpanded(index);
            }}
            data-expanded={expanded === index}
          >
            <div className={styles.icon_container}>
              <Icon
                component={() => {
                  switch (item.icon) {
                    case "FormatListBulletedIcon":
                      return (
                        <FormatListBulletedIcon
                          sx={{
                            fontSize: 40,
                          }}
                        />
                      );
                    case "RadarIcon":
                      return (
                        <RadarIcon
                          sx={{
                            fontSize: 40,
                          }}
                        />
                      );

                    default:
                      break;
                  }
                }}
              />
            </div>
            <div className={styles.title_container}>{item.name}</div>
            <div className={styles.line_container}></div>
            <div className={styles.text_container}>{item.body}</div>
          </div>
        );
      })}
    </div>
  );
};

export default SubRoutingList;
