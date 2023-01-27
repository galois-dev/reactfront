export let status_switch = (params) => {
  switch (params) {
    case "A":
      return "Active";
    case "I":
      return "Inactive";
    default:
      return "Not Found";
  }
};
export default status_switch;
