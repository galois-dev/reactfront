import { Axios } from "@pages/index";

export const listCustomer = async (params = undefined) => {
  if (params === undefined) {
    return Axios.get("/api/customers/")
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  } else {
    return Axios.get("/api/customers/", { params: params })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  }
};

export const getCustomer = async (id, params = undefined) => {
  if (params === undefined) {
    return Axios.get(`/api/customers/${id}/`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  } else {
    return Axios.get(`/api/customers/${id}/`, { params: params })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  }
};

export const createCustomer = async (data) => {
  return Axios.post("/api/customers/", data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const updateCustomer = async (id, data) => {
  return Axios.put(`/api/customers/${id}/`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteCustomer = async (id) => {
  return Axios.delete(`/api/customers/${id}/`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};
