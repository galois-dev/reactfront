import { Axios } from "@pages/index";

export const listControllerGroup = async (params = undefined) => {
  if (params === undefined) {
    return Axios.get("/api/ControllerGroup/")
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  } else {
    return Axios.get("/api/ControllerGroup/", { params: params })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  }
};

export const getControllerGroup = async (id, params = undefined) => {
  if (params === undefined) {
    return Axios.get(`/api/ControllerGroup/${id}/`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  } else {
    return Axios.get(`/api/ControllerGroup/${id}/`, { params: params })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  }
};

export const createControllerGroup = async (data) => {
  return Axios.post("/api/ControllerGroup/", data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const updateControllerGroup = async (id, data) => {
  return Axios.put(`/api/ControllerGroup/${id}/`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteControllerGroup = async (id) => {
  return Axios.delete(`/api/ControllerGroup/${id}/`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};
