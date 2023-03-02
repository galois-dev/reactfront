import * as React from "react";
import { useGlobalContext } from "../../helpers/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { alpha, styled } from "@mui/system";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Drawer from "@mui/material/Drawer";
import { settings, pages } from "../../../pages/index";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { blue, indigo, teal } from "@mui/material/colors";
import {
  ArrowBack,
  CableOutlined,
  CameraIndoor,
  Group,
  Home,
  PeopleOutline,
} from "@mui/icons-material";
import { useTheme } from "@mui/material";

const iconColor = indigo["100"];
const fontColor = indigo["100"];
const iconSwitch = (icon) => {
  switch (icon) {
    case "home":
      return <Home style={{ color: iconColor }} />;
    case "cable":
      return <CableOutlined style={{ color: iconColor }} />;
    case "peopleOutline":
      return <PeopleOutline style={{ color: iconColor }} />;
    case "group":
      return <Group style={{ color: iconColor }} />;
    default:
      break;
  }
};

const NavLink = ({ to, icon, children }) => {
  return (
    <MenuItem>
      <Link href={to}>
        <p>{children}</p>
      </Link>
    </MenuItem>
  );
};

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  alignItems: "flex-start",
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  // Override media queries injected by theme.mixins.toolbar
  "@media all": {
    minHeight: 128,
  },
}));

const Navbar = ({ setNavFold }) => {
  const theme = useTheme();
  const { refreshToken } = useGlobalContext();
  const nav = useRouter();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [open, setOpen] = React.useState(true);
  const [openAPI, setOpenAPI] = React.useState(false);
  const [openPDF, setOpenPDF] = React.useState(false);
  const [folded, setFolded] = React.useState(false);
  // #TODO: add condition to hide on login, signup and pwd reset pages.

  const redirectPage = (to) => nav.push(to);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  let style = {
    drawer: {
      transition: "width 150ms ease-in-out",
      width: folded ? "76px" : "250px",
      flexShrink: 0,
      "& .MuiDrawer-paper": {
        transition: "width 150ms ease-in-out",
        width: folded ? "76px" : "250px",
        boxSizing: "border-box",
      },
    },
  };

  React.useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ["login", "signup", "reset"].includes(
        window.location.pathname.split("/")[1].toLowerCase()
      )
    ) {
      return setOpen(false);
    } else {
      return setOpen(true);
    }
  }, [nav.pathname]);

  return (
    <AppBar position="fixed" open={open}>
      <Drawer
        ModalProps={{
          keepMounted: true,
        }}
        open={open}
        sx={style.drawer}
        variant="persistent"
        anchor="left"
      >
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            color: fontColor,
            alignItems: "self-start",
            backgroundColor: indigo["400"],
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: folded ? "column" : "row",
              justifyContent: "space-between",
              gap: folded ? "15px" : "0px",
              width: "100%",
              alignItems: "center",
              mt: folded ? 2 : 4,
              mb: 2,
            }}
          >
            <div></div>
            {folded ? (
              <Typography
                variant="h6"
                component="div"
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <img src="/favicon.ico" alt="logo" width="32" />
              </Typography>
            ) : (
              <Typography
                variant="h6"
                component="div"
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <img src="/jyskas.png" alt="logo" width="100" />
              </Typography>
            )}
            <IconButton
              sx={{ p: 0, m: 0, mr: "2px" }}
              onClick={() => {
                setFolded(!folded);
                setNavFold(!folded);
              }}
            >
              {folded ? (
                <MenuIcon style={{ color: iconColor }} />
              ) : (
                <ArrowBack style={{ color: iconColor }} />
              )}
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 2, width: "100%" }}>
            <MenuList>
              {pages.map((page) => (
                <MenuItem
                  fullWidth
                  sx={{ p: folded ? 0 : 0.5, m: folded ? 0 : 0.5, pb: 1.5 }}
                  key={page.name}
                  onClick={() => {
                    redirectPage(page.to);
                  }}
                >
                  <ListItemIcon>{iconSwitch(page.icon)}</ListItemIcon>
                  {folded ? null : (
                    <ListItemText align="left" primary={page.name} />
                  )}
                </MenuItem>
              ))}
            </MenuList>
            {folded ? null : (
              <ListItemButton
                onClick={() => {
                  setOpenAPI(!openAPI);
                }}
              >
                <ListItemText primary="Integrations" />
                {openAPI ? (
                  <ExpandLess style={{ color: iconColor }} />
                ) : (
                  <ExpandMore style={{ color: iconColor }} />
                )}
              </ListItemButton>
            )}
            <Collapse in={openAPI || folded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <MenuItem
                  sx={{ pl: folded ? 0 : 3 }}
                  align="left"
                  onClick={() => {
                    redirectPage("/acctec");
                  }}
                >
                  <ListItemIcon>
                    <CameraIndoor style={{ color: iconColor }} />
                  </ListItemIcon>
                  {folded ? null : <ListItemText primary="AccTec" />}
                </MenuItem>
                {/* <MenuItem
                  sx={{ pl: 4 }}
                  align="left"
                  onClick={() => {
                    redirectPage("/SIM");
                  }}
                >
                  <ListItemText primary="SIM" />
                </MenuItem> */}
              </List>
            </Collapse>

            {/* <ListItemButton
              onClick={() => {
                setOpenPDF(!openPDF);
              }}
            >
              <ListItemText primary="PDF" />
              {openPDF ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton> */}
            {/* <Collapse in={openPDF} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <MenuItem
                  sx={{ pl: 4 }}
                  align="left"
                  onClick={() => {
                    redirectPage("/pdf");
                  }}
                >
                  <ListItemText primary="Overview" />
                </MenuItem>
                <MenuItem
                  sx={{ pl: 4 }}
                  align="left"
                  onClick={() => {
                    redirectPage("/pdf/forholdsordre");
                  }}
                >
                  <ListItemText primary="Forholdsordre" />
                </MenuItem>
              </List>
            </Collapse> */}
          </Box>

          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" /> */}
            </IconButton>
          </Tooltip>

          <Box sx={{ mb: 2 }}>
            <Menu
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
