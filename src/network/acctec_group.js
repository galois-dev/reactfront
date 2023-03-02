import { Axios } from "@pages/index";

export const listAcctecGroup = async (params = undefined) => {
  if (params === undefined) {
    return Axios.get("/api/AcctGroup/").then((res) => {
      return res.data;
    });
  } else {
    return Axios.get("/api/AcctGroup/", { params: params }).then((res) => {
      return res.data;
    });
  }
};

export const getAcctecGroup = async (id, params = undefined) => {
  if (params === undefined) {
    return Axios.get(`/api/AcctGroup/${id}/`).then((res) => {
      return res.data;
    });
  } else {
    return Axios.get(`/api/AcctGroup/${id}/`, { params: params }).then(
      (res) => {
        return res.data;
      }
    );
  }
};

export const createAcctecGroup = async (data) => {
  return Axios.post("/api/AcctGroup/", data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const updateAcctecGroup = async (id, data) => {
  return Axios.put(`/api/AcctGroup/${id}/`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteAcctecGroup = async (id) => {
  return Axios.delete(`/api/AcctGroup/${id}/`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};
