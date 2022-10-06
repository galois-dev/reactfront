import { useRouter } from "next/router";
import * as React from "react";
import { Axios } from "@pages/index";
import {
  Box,
  Button,
  Container,
  FormControl,
  Input,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import RoundBox from "@components/sitecore/RoundBox";

const GroupCard = ({ group, selected, selectable }) => {
  const [hover, setHover] = React.useState(false);
  let background =
    (selected || hover) && selectable ? "lightblue" : "lightgray";
  let border = (selected || hover) && selectable ? "1px solid gray" : "";
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
      }}
    >
      <RoundBox
        sx={{
          background,
          border,
          transition: "250ms",
          p: 1,
          m: 0,
        }}
      >
        <Typography variant="h6" align="left">
          {group.Name}
        </Typography>
        <Typography align="left">{group.Description}</Typography>
      </RoundBox>
    </div>
  );
};

const TagMetaHeader = ({ tag }) => {
  return (
    <RoundBox sx={{ p: 2 }}>
      <Typography>Found tag for</Typography>
      <Typography variant="h5">{tag.Token}</Typography>
      <Typography>with id</Typography>
      <Typography variant="h5">{tag.id}</Typography>
    </RoundBox>
  );
};

export const ScanPK = () => {
  const router = useRouter();
  const { id } = router.query;
  const [response, setResponse] = React.useState("");
  const [tagExists, settagExists] = React.useState(false);
  const [selectedGroup, setSelectedGroup] = React.useState(null);
  const [selectedGroupIndexes, setSelectedGroupIndexes] = React.useState([]);
  const [groups, setGroups] = React.useState([]);
  const [Name, setName] = React.useState("");
  const [Phone, setPhone] = React.useState("");
  const [maxUses, setMaxUses] = React.useState(1);
  const [numUses, setNumUses] = React.useState(1);

  React.useEffect(() => {
    Axios.get("/api/AcctGroup")
      .then((res) => {
        setGroups(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  React.useEffect(() => {
    console.log(response.Group);
    let incides = [];
    for (let i = 0; i < response?.Group?.length; i++) {
      let index = groups.findIndex((g) => g.id === response.Group[i]);
      incides.push(index);
    }
    setSelectedGroupIndexes(incides);
    setName(response.Name);
    setPhone(response.Phone);
    setMaxUses(response.MaxUses);
    setNumUses(response.NumUses);
  }, [response]);

  function setgroup(group, index) {
    setSelectedGroup(group);
    setSelectedGroupIndex(index);
  }

  function handleSelectGroup(group, index) {
    if (selectedGroupIndexes.includes(index)) {
      setSelectedGroupIndexes(selectedGroupIndexes.filter((i) => i !== index));
    } else {
      setSelectedGroupIndexes([...selectedGroupIndexes, index]);
    }
  }

  function postToken() {
    let selectedGroups = selectedGroupIndexes.map((i) => groups[i].id);
    Axios.post("/api/rfid/", {
      status: "A",
      Token: id,
      Group: selectedGroups,
    })
      .then((res) => {
        router.reload(`/acctec/${id}`);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function putToken() {
    let data = {
      ...response,
      Token: id,
      Name,
      Phone,
      MaxUses: maxUses,
      NumUses: numUses,
    };
    if (selectedGroupIndexes?.length > 0) {
      let newGroups = [];
      selectedGroupIndexes.forEach((i) => {
        if (i !== -1) {
          newGroups.push(groups[i].id);
        }
      });
      data.Group = newGroups;
    }
    Axios.put(`/api/rfid/${response.id}/`, data)
      .then((res) => {
        router.push(`/acctec/${id}`);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  React.useEffect(() => {
    if (id !== undefined) {
      Axios.get(`/api/rfid/${id}`)
        .then((res) => {
          setResponse(res.data);
          settagExists(true);
        })
        .catch((err) => {
          console.log(err);
          settagExists(false);
        });
    }
  }, [id]);
  return (
    <>
      {
        {
          // >======> Check status if token exists <======<
          true: (
            <Container fixed>
              <TagMetaHeader tag={response} />
              <RoundBox sx={{ p: 2 }}>
                <FormControl>
                  <Typography variant="h5" align="center" gutterBottom={true}>
                    Enter group
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(100px, 1fr))",
                      gridAutoRows: "auto",
                      gap: "20px",
                      alignItems: "start",
                      justifyItems: "center",
                      p: 2,
                    }}
                  >
                    {groups.map((group, index) => {
                      return (
                        <div
                          key={String(index)}
                          style={{ width: "100%" }}
                          onClick={() => handleSelectGroup(group, index)}
                        >
                          <GroupCard
                            selectable={true}
                            group={group}
                            selected={selectedGroupIndexes?.includes(index)}
                          />
                        </div>
                      );
                    })}
                  </Box>
                </FormControl>
              </RoundBox>
              <RoundBox sx={{ p: 2 }}>
                <Typography>Customer Info</Typography>
                <FormControl sx={{ m: 1 }}>
                  <InputLabel>Name</InputLabel>
                  <Input
                    value={Name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </FormControl>
                <FormControl sx={{ m: 1 }}>
                  <InputLabel>Phone</InputLabel>
                  <Input
                    value={Phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                  />
                </FormControl>
              </RoundBox>
              <RoundBox sx={{ p: 2 }}>
                <Typography>Usage info</Typography>
                <FormControl sx={{ m: 1 }}>
                  <InputLabel>Max uses</InputLabel>
                  <Input
                    value={maxUses}
                    onChange={(e) => {
                      setMaxUses(e.target.value);
                    }}
                  />
                </FormControl>
                <FormControl sx={{ m: 1 }}>
                  <InputLabel>Current uses</InputLabel>
                  <Input
                    value={numUses}
                    onChange={(e) => {
                      setNumUses(e.target.value);
                    }}
                  />
                </FormControl>
              </RoundBox>
              <RoundBox sx={{ p: 2 }}>
                <Button fullWidth variant="outlined" onClick={putToken}>
                  <Typography>Save</Typography>
                </Button>
              </RoundBox>
            </Container>
          ),
          // >======> Initiate new token <======<
          false: (
            <Container fixed>
              <RoundBox sx={{ p: 2 }}>
                <Typography variant="h4" align="center" gutterBottom={true}>
                  Set up tag with id {id}
                </Typography>
              </RoundBox>
              <RoundBox sx={{ p: 2 }}>
                <FormControl>
                  <Typography variant="h5" align="center" gutterBottom={true}>
                    Enter group
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(100px, 1fr))",
                      gridAutoRows: "auto",
                      gap: "20px",
                      alignItems: "start",
                      justifyItems: "center",
                      p: 2,
                    }}
                  >
                    {groups.map((group, index) => {
                      return (
                        <div
                          key={String(index)}
                          onClick={() => handleSelectGroup(group, index)}
                          style={{ width: "100%" }}
                        >
                          <GroupCard
                            selectable={true}
                            group={group}
                            selected={selectedGroupIndexes?.includes(index)}
                          />
                        </div>
                      );
                    })}
                  </Box>
                </FormControl>
              </RoundBox>
              {
                {
                  true: (
                    <>
                      <RoundBox sx={{ p: 2 }}>
                        <Typography
                          variant="h5"
                          align="center"
                          gutterBottom={true}
                        >
                          Accept new tag
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            postToken();
                          }}
                        >
                          <Typography variant="h6">Accept</Typography>
                        </Button>
                      </RoundBox>
                    </>
                  ),
                }[selectedGroupIndexes?.length > 0]
              }
            </Container>
          ),
        }[String(tagExists)]
      }
    </>
  );
};

export default ScanPK;
