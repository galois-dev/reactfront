import { maxHeight } from "@mui/system";
import * as React from "react";

const styles = {
  dayColumn: {
    width: "100%",
    borderRight: "1px solid gray",
    position: "relative",
  },
  timeStamps: {
    width: "100%",
    gridArea: "timestamps",
    textAlign: "right",
    paddingRight: "10px",
    borderRight: "1px solid gray",
  },
  weekContainer: {
    display: "grid",
    gridArea: "week",
    gridTemplateColumns: "repeat(7, 1fr)",
    gridTemplateRows: "1fr",
    gap: "0.5em",
  },
  dayContainer: {
    display: "grid",
    gridArea: "days",
    alignItems: "end",
    gridTemplateColumns: "repeat(7, 1fr)",
    gridTemplateRows: "1fr",
  },
  segment: {},
};

const initialState = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "setDay":
      return {
        ...state,
        [action.payload.day]: action.payload.segments,
      };
    default:
      throw new Error();
  }
}

const StateContext = React.createContext();

const TimeStamp = (hour = 0, minute = 0) => {
  let extradays = Math.floor(hour / 24); // Calculate how many days are added
  let extrahours = Math.floor(minute / 60); // Calculate how many hours are added
  hour = hour - Math.floor(hour / 24) * 24; // Clamp hour to 0-23
  if (String(hour).split(".")[1] !== undefined) {
    // Take the decimal part of the hour and convert it to minutes
    minute = minute + (hour - Math.floor(hour)) * 60;
    hour = Math.floor(hour);
  }
  minute = minute - Math.floor(minute / 60) * 60; // Clamp minute to 0-59
  return {
    hour,
    minute,
    extradays,
    extrahours,
  };
};

const Segment = ({
  segment,
  day,
  cellHeight,
  subdivide,
  children,
  offSet,
  id,
  editable,
  inplace = false,
}) => {
  const { state, dispatch } = React.useContext(StateContext);

  return (
    <div
      style={{
        position: "absolute",
        top: (segment.start.hour - offSet) * cellHeight + "px",
        backgroundColor: inplace ? "skyblue" : "lightgray",
        borderRadius: "15px",
        border: "6px solid rgba(0,0,100,0.1)",
        margin: "-6px",
        marginLeft: "-8px",
        marginBottom: "-10px",
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "auto auto 1fr",
        width: "100%",
        boxShadow: "0px 0px 10px 5px rgba(0,0,0,0.3)",
        height:
          (segment.end.hour +
            segment.end.minute / 60 -
            (segment.start.hour + segment.start.minute / 60) +
            segment.end.extradays * 24) *
            cellHeight +
          "px",
      }}
      onDoubleClick={(e) => {
        // Remove segment from state
        if (editable) {
          let newSegments = state[day].filter((item) => item.id !== segment.id);
          dispatch({
            type: "setDay",
            payload: {
              day: day,
              segments: newSegments,
            },
          });
        }
      }}
    >
      {segment.start.hour + 1 <= segment.end.hour ||
      segment.end.extradays !== 0 ? (
        <>
          <span>
            {segment.start.hour}:
            {String(segment.start.minute).length === 1
              ? "0" + segment.start.minute
              : segment.start.minute}
          </span>
          <span>
            {segment.end.hour}:
            {String(segment.end.minute).length === 1
              ? "0" + segment.end.minute
              : segment.end.minute}
          </span>
          {children}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

const DayColumn = ({ cellHeight, day, editable = true, subdivide, offSet }) => {
  const { state, dispatch } = React.useContext(StateContext);
  const [mouseCaptureSegment, setMouseCaptureSegment] = React.useState({
    started: false,
    hasend: false,
  });

  // Mouse click effects
  function handleDown(Index) {
    if (editable && Index < 24 * subdivide) {
      setMouseCaptureSegment({
        start: Index,
        end: Index,
        started: true,
        hasend: false,
      });
    } else {
      setMouseCaptureSegment({
        start: Math.min(Index, subdivide * offSet),
        end: Index,
        started: true,
        hasend: false,
      });
    }
  }
  function handleUp() {
    // setMouseCaptureSegment({
    //   ...mouseCaptureSegment,
    //   started: false,
    // });
    // Add segment to state
    if (editable) {
      dispatch({
        type: "setDay",
        payload: {
          day: day,
          segments: [toTimeStamp()],
        },
      });

      // Clear setMouseCaptureSegment
      setMouseCaptureSegment({
        started: false,
        hasend: false,
      });
    }
  }
  // Mouse over effects
  function handleEnter(Index) {
    if (mouseCaptureSegment.started && editable) {
      setMouseCaptureSegment({
        ...mouseCaptureSegment,
        end: Index,
        hasend: true,
      });
    }
  }

  function handleLeave(Index) {
    // if (mouseCaptureSegment.started) {
    //   setMouseCaptureSegment({
    //     ...mouseCaptureSegment,
    //     end: Index,
    //     hasend: true,
    //   });
    // }
  }
  // Functional casting
  function toTimeStamp() {
    return {
      start: TimeStamp(mouseCaptureSegment.start / subdivide),
      end: TimeStamp(mouseCaptureSegment.end / subdivide),
    };
  }
  return (
    <div style={styles.dayColumn}>
      {[...Array(24 * subdivide + 1).keys()].map((cell) => {
        if (cell >= offSet * subdivide) {
          return (
            <div
              key={String(cell)}
              onMouseDown={(e) => {
                e.preventDefault();
                handleDown(String(cell));
              }}
              onMouseEnter={(e) => {
                e.preventDefault();
                handleEnter(String(cell));
              }}
              onMouseLeave={(e) => {
                e.preventDefault();
                handleLeave(String(cell));
              }}
              onMouseUp={(e) => {
                e.preventDefault();
                handleUp(String(cell));
              }}
              style={{
                height: cellHeight / subdivide + "px",
                borderTop: "1px solid gray",
                marginTop: "-1px",
                opacity: cell % subdivide === 0 ? 0.5 : 0.25,
              }}
            ></div>
          );
        } else {
          return <></>;
        }
      })}

      {
        {
          true: (
            <Segment
              segment={toTimeStamp()}
              subdivide={subdivide}
              cellHeight={cellHeight}
              offSet={offSet}
              editable={editable}
              style={{ backgroundColor: "red" }}
              onMouseUp={(e) => {
                e.preventDefault();
                handleUp(String(mouseCaptureSegment.end));
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                handleUp(String(mouseCaptureSegment.end));
              }}
            >
              <div
                className="InvisibleTouchableBottom"
                onMouseEnter={(e) => {
                  handleEnter(mouseCaptureSegment.end - 1);
                }}
                onMouseUp={(e) => {
                  e.preventDefault();
                  handleUp(String(mouseCaptureSegment.end));
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleUp(String(mouseCaptureSegment.end));
                }}
                style={{
                  height: (cellHeight * 2) / subdivide + "px",
                  width: "100%",
                  justifySelf: "end",
                  alignSelf: "end",
                  // marginBottom: cellHeight + "px",
                }}
              ></div>
            </Segment>
          ),
        }[mouseCaptureSegment.hasend || mouseCaptureSegment.started]
      }

      {state[day].map((segment, index) => (
        <Segment
          offSet={offSet}
          key={String(index)}
          segment={segment}
          subdivide={subdivide}
          day={day}
          cellHeight={cellHeight}
          id={day + index}
          editable={editable}
          inplace={true}
        />
      ))}
    </div>
  );
};
const onChangeDefault = () => {
  console.log("onChange function fired but is not defined");
};
const TimeTable = ({
  segments,
  editable = true,
  onChange = onChangeDefault,
  cellHeight = 32,
  subdivide = 2,
  offSet = 6,
}) => {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [state, dispatch] = React.useReducer(reducer, initialState);
  React.useEffect(() => {
    if (typeof segments !== "undefined") {
      days.forEach((day) => {
        if (Object.keys(segments).includes(day)) {
          dispatch({
            type: "setDay",
            payload: {
              day: day,
              segments: segments[day],
            },
          });
        }
      });
    }
  }, [segments]);

  React.useEffect(() => {
    state["offSet"] = offSet;
    onChange(state);
  }, [state]);

  return (
    <div className="TimeTableContainer">
      <StateContext.Provider value={{ state, dispatch }}>
        <div className="TimeTableDays" style={styles.dayContainer}>
          {days.map((day) => {
            return <div key={String(day)}>{day}</div>;
          })}
        </div>
        <div style={styles.timeStamps}>
          {[...Array(25).keys()].map((hour) => {
            if (hour >= offSet) {
              return (
                <div
                  key={String(hour)}
                  style={{
                    height: cellHeight + "px",
                  }}
                >
                  {hour}:00
                </div>
              );
            } else {
              return <></>;
            }
          })}
        </div>
        <div style={styles.weekContainer}>
          {days.map((day) => {
            return (
              <DayColumn
                key={String(day)}
                cellHeight={cellHeight}
                day={day}
                editable={editable}
                subdivide={subdivide}
                offSet={offSet}
              />
            );
          })}
        </div>
      </StateContext.Provider>
    </div>
  );
};

export default TimeTable;
