import * as React from "react";
import { useRouter } from "next/router";
import { Axios } from "./index";

const User = ({}) => {
  const router = useRouter();
  const { id } = router.query;
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
