import { IdentityJsonbView } from "@components/Units/IdentityJsonbView";
import { Axios } from "@pages/index";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
export const Identity = ({}) => {
  const [identity, setIdentity] = useState({});
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (id !== undefined) {
      Axios.get("/api/unit_identities/" + id)
        .then((response) => {
          setIdentity(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);
  return <IdentityJsonbView identity={identity} />;
};

export default Identity;
