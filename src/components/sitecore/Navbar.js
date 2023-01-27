import * as React from "react";
import { useGlobalContext } from "../../helpers/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
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

const iconSwitch = (icon) => {
  switch (icon) {
    case "home":
      return;
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

const Navbar = () => {
  const { refreshToken } = useGlobalContext();
  const nav = useRouter();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [open, setOpen] = React.useState(true);
  const [openAPI, setOpenAPI] = React.useState(false);
  const [openPDF, setOpenPDF] = React.useState(false);
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
        sx={{
          width: "250px",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: "250px",
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
      >
        <Toolbar
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            color: "primary",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ mt: 4, display: { xs: "none", md: "flex" } }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 2, width: 320, maxWidth: "100%" }}>
            <MenuList>
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={() => {
                    redirectPage(page.to);
                  }}
                >
                  <ListItemText align="left" primary={page.name} />
                </MenuItem>
              ))}
            </MenuList>

            <ListItemButton
              onClick={() => {
                setOpenAPI(!openAPI);
              }}
            >
              <ListItemText primary="Integrations" />
              {openAPI ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openAPI} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <MenuItem
                  sx={{ pl: 4 }}
                  align="left"
                  onClick={() => {
                    redirectPage("/acctec");
                  }}
                >
                  <ListItemText primary="AccTec" />
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
