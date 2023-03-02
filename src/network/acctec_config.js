import { Axios } from "@pages/index";

export const listAcctecConfig = async (params = undefined) => {
  if (params === undefined) {
    return Axios.get("/api/AccTecConfig/")
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  } else {
    return Axios.get("/api/AccTecConfig/", { params: params })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  }
};

export const getAcctecConfig = async (id, params = undefined) => {
  if (params === undefined) {
    return Axios.get(`/api/AccTecConfig/${id}/`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  } else {
    return Axios.get(`/api/AccTecConfig/${id}/`, { params: params })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  }
};

export const createAcctecConfig = async (data) => {
  return Axios.post("/api/AccTecConfig/", data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const updateAcctecConfig = async (id, data) => {
  return Axios.put(`/api/AccTecConfig/${id}/`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteAcctecConfig = async (id) => {
  return Axios.delete(`/api/AccTecConfig/${id}/`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};
