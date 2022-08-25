let status_switch = (params) => {
  switch (params) {
    case "A":
      return "Active";
      break;
    case "I":
      return "Inactive";
    default:
      return "Not Found";
      break;
  }
};

export default status_switch;
