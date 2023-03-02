export const time_delta_on_unit_time = (date, delta_scale = "day") => {
  // check that date is a valid date
  if (isNaN(new Date(date))) {
    return "Invalid Date";
  }
  // check that delta_scale is a valid scale
  if (
    !["second", "minute", "hour", "day", "week", "month", "year"].includes(
      delta_scale
    )
  ) {
    return "Invalid Scale";
  }

  let numerator = -1; // day default
  switch (delta_scale) {
    case "second":
      numerator = 1000;
      break;
    case "minute":
      numerator = 1000 * 60;
      break;
    case "hour":
      numerator = 1000 * 60 * 60;
      break;
    case "day":
      numerator = 1000 * 60 * 60 * 24;
      break;
    case "week":
      numerator = 1000 * 60 * 60 * 24 * 7;
      break;
    case "month":
      numerator = 1000 * 60 * 60 * 24 * 30;
      break;
    case "year":
      numerator = 1000 * 60 * 60 * 24 * 365;
      break;
    default:
      numerator = 1000 * 60 * 60 * 24;
  }
  return new Intl.RelativeTimeFormat("en-DK", {
    numeric: "auto",
  }).format(Math.ceil((new Date(date) - new Date()) / numerator), delta_scale);
};
