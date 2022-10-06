import * as React from "react";
import { useRouter, useParam } from "next/router";
import { Axios } from "./index";

const User = ({}) => {
  let { id } = useParam();
  let [data, setData] = React.useState();

  React.useEffect(() => {
    Axios.get(`/users/${id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="User">
      <p>{JSON.stringify(data)}</p>
    </div>
  );
};

export default User;
