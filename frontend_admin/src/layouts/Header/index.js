import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import AdbIcon from "@mui/icons-material/Adb";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { MuiColorInput } from "mui-color-input";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Menu,
  MenuItem,
  InputLabel,
  Grow,
} from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { useDispatch, useSelector } from "react-redux";
import { getColor, setColor, submitColor } from "../../redux/theme/themeSlice";
const pages = [{ title: "Ads", href: "/ads", role: ["user", "admin"] }];

const pages2 = [
  { title: "Products", href: "/products", role: ["admin"] },
  { title: "Top Products", href: "/top-products", role: ["admin"] },
  { title: "Top Stores", href: "/top-stores", role: ["admin"] },
];

const pages4 = [
  { title: "Hot", href: "/nexus-hot", role: ["admin"] },
  { title: "Trending", href: "/nexus-trending", role: ["admin"] },
  { title: "On The Rise", href: "/nexus-rise", role: ["admin"] },
  { title: "New", href: "/nexus-new", role: ["admin"] },
  { title: "All", href: "/nexus-all", role: ["admin"] },
];

const pages3 = [
  { title: "Amazon", href: "/marketplaces/amazon", role: ["admin"] },
  { title: "Users", href: "/users", role: ["admin"] },
];

const settings = [
  { title: "Account", href: "/setting", role: ["admin", "user"] },
];

function Header() {
  const { signOut, user, isLoading } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [showPattle, setShowPattle] = React.useState(false);
  const color = useSelector((state) => state.theme.color);
  const [color_, setColor_] = React.useState(color);
  const [openMenu1, setOpenMenu1] = React.useState(false);
  const [openMenu12, setOpenMenu2] = React.useState(false);

  const menuRef1 = React.useRef();
  const menuRef2 = React.useRef();

  const handleClose = () => {
    setOpenMenu1(false);
    setAnchorElNav(null);
  };
  const handleClose2 = () => {
    setOpenMenu2(false);
    setAnchorElNav(null);
  };

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

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        // mt: 2,
      }}
    >
      {!isLoading && user && (
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              borderRadius: "999px",
              bgcolor:
                theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(24px)",
              maxHeight: 40,
              border: "1px solid",
              borderColor: "divider",
              mt: 2,
              px: 2,
              boxShadow:
                theme.palette.mode === "light"
                  ? `0 0 32px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : "0 0 32px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
            })}
          >
            {/* <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} /> */}
            <a href="/ads">
              <img
                src={"/logo.png"}
                style={{
                  mr: 2,
                  maxHeight: 48,
                  filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.2))",
                }}
                alt="OnlyADS"
              />
            </a>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="dark"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page, key) => {
                  if (!page.role.includes(user.role)) return null;
                  return (
                    <MenuItem
                      key={key}
                      disabled={window.location.pathname.includes(page.href)}
                      onClick={() => {
                        navigate(page.href);
                        handleCloseNavMenu();
                      }}
                    >
                      <Typography textAlign="center">{page.title}</Typography>
                    </MenuItem>
                  );
                })}
                <Divider />
                <Box sx={{ px: 2 }}>
                  <Typography variant="h6" fontSize={12} color="gray">
                    Sales Tracker
                  </Typography>
                </Box>
                {pages2.map((page, key) => {
                  if (!page.role.includes(user.role)) return null;
                  return (
                    <MenuItem
                      key={key}
                      disabled={window.location.pathname.includes(page.href)}
                      onClick={() => {
                        navigate(page.href);
                        handleCloseNavMenu();
                      }}
                    >
                      <Typography textAlign="center">{page.title}</Typography>
                    </MenuItem>
                  );
                })}
                <Divider />
                <Box sx={{ px: 2 }}>
                  <Typography variant="h6" fontSize={12} color="gray">
                    Nexus
                  </Typography>
                </Box>
                {pages4.map((page, key) => {
                  if (!page.role.includes(user.role)) return null;
                  return (
                    <MenuItem
                      key={key}
                      disabled={window.location.pathname.includes(page.href)}
                      onClick={() => {
                        navigate(page.href);
                        handleCloseNavMenu();
                      }}
                    >
                      <Typography textAlign="center">{page.title}</Typography>
                    </MenuItem>
                  );
                })}
                <Divider />
                <Box sx={{ px: 2 }}>
                  <Typography variant="h6" fontSize={12} color="gray">
                    Users
                  </Typography>
                </Box>
                {pages3.map((page, key) => {
                  if (!page.role.includes(user.role)) return null;
                  return (
                    <MenuItem
                      key={key}
                      disabled={window.location.pathname.includes(page.href)}
                      onClick={() => {
                        navigate(page.href);
                        handleCloseNavMenu();
                      }}
                    >
                      <Typography textAlign="center">{page.title}</Typography>
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              OnlyADS
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "flex-start",
                mx: 4,
                gap: 1,
              }}
            >
              {pages.map((page, key) => {
                if (!page.role.includes(user.role)) return null;
                return (
                  <Button
                    key={key}
                    size="large"
                    href={page.href}
                    variant={
                      window.location.pathname.includes(page.href)
                        ? "contained"
                        : "text"
                    }
                    onClick={handleCloseNavMenu}
                    sx={{
                      my: 2,
                      color: "dark",
                      display: "block",
                      borderRadius: 100,
                      boxShadow: "none",
                    }}
                  >
                    {page.title}
                  </Button>
                );
              })}
              <Button
                size="large"
                id="basic-button"
                ref={menuRef1}
                onMouseEnter={() => {
                  setOpenMenu1(true);
                  setOpenMenu2(false);
                }}
                variant={
                  window.location.pathname.includes("products") ||
                  window.location.pathname.includes("top-products") ||
                  window.location.pathname.includes("top-stores")
                    ? "contained"
                    : "text"
                }
                sx={{
                  my: 2,
                  color: "dark",
                  display: "block",
                  borderRadius: 100,
                  boxShadow: "none",
                }}
              >
                Sales Tracker
              </Button>
              <Menu
                anchorEl={menuRef1.current}
                open={openMenu1}
                onClose={handleClose}
                onMouseMove={(e) => {
                  if (e.target.getAttribute("role") === "presentation") {
                    setOpenMenu1(false);
                  }
                }}
                sx={{
                  top: 80,
                  "& .MuiBackdrop-root": {
                    opacity: "0 !important",
                    display: "none",
                  },
                  "& .MuiPaper-root": {
                    top: "0 !important",
                  },
                }}
                TransitionComponent={Grow}
                TransitionProps={{
                  timeout: {
                    enter: 600,
                    exit: 0,
                  },
                }}
              >
                {pages2.map((page, key) => {
                  if (!page.role.includes(user.role)) return null;
                  return (
                    <MenuItem
                      key={key}
                      onClick={() => {
                        handleClose();
                        navigate(page.href);
                      }}
                      disabled={window.location.pathname.includes(page.href)}
                    >
                      {page.title}
                    </MenuItem>
                  );
                })}
              </Menu>
              <Button
                id="basic-button2"
                size="large"
                onMouseEnter={() => {
                  setOpenMenu2(true);
                  setOpenMenu1(false);
                }}
                ref={menuRef2}
                variant={
                  window.location.pathname.includes("nexus-")
                    ? "contained"
                    : "text"
                }
                sx={{
                  my: 2,
                  color: "dark",
                  display: "block",
                  borderRadius: 100,
                  boxShadow: "none",
                }}
              >
                NEXUS
              </Button>
              <Menu
                anchorEl={menuRef2.current}
                open={openMenu12}
                onClose={handleClose2}
                onMouseMove={(e) => {
                  if (e.target.getAttribute("role") === "presentation") {
                    setOpenMenu2(false);
                  }
                }}
                sx={{
                  top: 80,
                  "& .MuiBackdrop-root": {
                    opacity: "0 !important",
                    display: "none",
                  },
                  "& .MuiPaper-root": {
                    top: "0 !important",
                  },
                }}
                TransitionComponent={Grow}
                TransitionProps={{
                  timeout: {
                    enter: 600,
                    exit: 0,
                  },
                }}
              >
                {pages4.map((page, key) => {
                  if (!page.role.includes(user.role)) return null;
                  return (
                    <MenuItem
                      key={key}
                      onClick={() => {
                        handleClose2();
                        navigate(page.href);
                      }}
                      disabled={window.location.pathname.includes(page.href)}
                    >
                      {page.title}
                    </MenuItem>
                  );
                })}
              </Menu>
              {pages3.map((page, key) => {
                if (!page.role.includes(user.role)) return null;
                return (
                  <Button
                    key={key}
                    size="large"
                    href={page.href}
                    variant={
                      window.location.pathname.includes(page.href)
                        ? "contained"
                        : "text"
                    }
                    onClick={handleCloseNavMenu}
                    sx={{
                      my: 2,
                      color: "dark",
                      display: "block",
                      borderRadius: 100,
                      boxShadow: "none",
                    }}
                  >
                    {page.title}
                  </Button>
                );
              })}
            </Box>

            <IconButton
              color="primary"
              onClick={() => setShowPattle(true)}
              sx={{
                mr: 2,
                display: { sm: "flex", xs: "none" },
              }}
            >
              <ColorLensIcon sx={{ fontSize: 40 }} />
            </IconButton>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title={user.email}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user.userName} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
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
                <Box sx={{ p: 2, px: 4 }}>
                  <Typography variant="h6">{user.userName}</Typography>
                  <Typography variant="body2" color={"grey"}>
                    {user.email}
                  </Typography>
                </Box>
                <Divider
                  sx={{
                    my: 1,
                  }}
                />
                {settings.map((setting, key) => (
                  <MenuItem
                    key={key}
                    onClick={() => {
                      handleCloseUserMenu();
                      navigate(setting.href);
                    }}
                  >
                    <Typography textAlign="center">{setting.title}</Typography>
                  </MenuItem>
                ))}
                <MenuItem
                  key={"Logout"}
                  onClick={() => {
                    handleCloseUserMenu();
                    signOut();
                  }}
                >
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      )}
      <Dialog
        open={showPattle}
        fullWidth
        maxWidth="sm"
        onClose={() => setShowPattle(false)}
      >
        <DialogTitle>
          <Typography variant="h6">Color</Typography>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <InputLabel>Light</InputLabel>
            <MuiColorInput
              format="hex"
              value={color_.light}
              onChange={(v) => {
                setColor_({ ...color_, light: v });
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <InputLabel>Main</InputLabel>
            <MuiColorInput
              format="hex"
              value={color_.main}
              onChange={(v) => {
                setColor_({ ...color_, main: v });
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <InputLabel>Dark</InputLabel>
            <MuiColorInput
              format="hex"
              value={color_.dark}
              onChange={(v) => {
                setColor_({ ...color_, dark: v });
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => dispatch(getColor())} size="large">
            Reset
          </Button>
          <Button onClick={() => dispatch(setColor(color_))} size="large">
            Apply
          </Button>
          <Button
            onClick={() => dispatch(submitColor(color_))}
            size="large"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}
export default Header;
