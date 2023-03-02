import { Axios } from "@pages/index";

export const getRFID = async (params = undefined) => {
  if (params === undefined) {
    return Axios.get(`/api/rfid/${id}/`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  } else {
    return Axios.get(`/api/rfid/${id}/`, { params: params })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  }
};

export const listRFID = async (params = undefined) => {
  if (params === undefined) {
    return Axios.get("/api/rfid/")
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  } else {
    return Axios.get("/api/rfid/", { params: params })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  }
};

export const createRFID = async (data) => {
  return Axios.post("/api/rfid/", data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const updateRFID = async (id, data) => {
  return Axios.put(`/api/rfid/${id}/`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const dehydrateRFID = (data) => {
  if (data._Group === undefined) {
    data.Group = data._Group;
    data._Group = undefined;
  }
  if (data._ControllerGroup === undefined) {
    data._ControllerGroup.map((group) => {
      return group.id;
    });
    data.ControllerGroup = data._ControllerGroup;
    data._ControllerGroup = undefined;
  }
  return data;
};

export const listDehydrateRfid = (data) => {
  let res = [];
  data.forEach((rfid) => {
    res.push(dehydrateRFID(rfid));
  });
  return res;
};
