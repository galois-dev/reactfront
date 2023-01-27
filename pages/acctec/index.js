import { SubRoutingList } from "@components/sitecore/SubRoutingList";
import { Container, Paper } from "@mui/material";
export const Acctec = () => {
  return (
    <Container
      fixed
      sx={{
        position: "relative",
        height: "100vh",
        m: 0,
        p: 0,
        top: 0,
      }}
    >
      <SubRoutingList
        items={[
          {
            to: "/acctec/admin",
            name: "Overview",
            icon: "FormatListBulletedIcon",
            body: (
              <div>
                View cursory statistics pertaining to the Access Technologies
                installation. And view the members list and usage statistics
                about the RFID tags allocated to the system.
              </div>
            ),
          },
          {
            to: "/acctec/scan",
            name: "Scan",
            icon: "RadarIcon",
            body: (
              <div>
                Scan RFID tags and set up new members in the system, or
                administer existing members.
              </div>
            ),
          },
        ]}
      />
    </Container>
  );
};

export default Acctec;
