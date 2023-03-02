import { Axios } from "@pages/index";

export const listUser = async (params = undefined) => {
  if (params === undefined) {
    return Axios.get("/api/user/")
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  } else {
    return Axios.get("/api/user/", { params: params })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  }
};

export const getUser = async (id, params = undefined) => {
  if (params === undefined) {
    return Axios.get(`/api/user/${id}/`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  } else {
    return Axios.get(`/api/user/${id}/`, { params: params })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  }
};

export const createUser = async (data) => {
  return Axios.post("/api/user/", data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const updateUser = async (id, data) => {
  return Axios.put(`/api/user/${id}/`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const deleteUser = async (id) => {
  return Axios.delete(`/api/user/${id}/`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const changePassword = async (id, data) => {
  return Axios.post(`/api/user/change_password/${id}/`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const resetPassword = async (id) => {
  return Axios.post(`/api/user/reset_password/${id}/`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};
