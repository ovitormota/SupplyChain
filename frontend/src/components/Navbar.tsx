import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ListIcon from "@mui/icons-material/List";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import StorefrontIcon from "@mui/icons-material/Storefront";
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const NavBar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isActive = (route: string) => location.pathname === route;

  const toggleDrawer = (open: boolean) => () => {
    setOpen(open);
  };

  const handleNavigation = (route: string) => {
    navigate(route);
    setOpen(false);
  };

  const navItems = [
    {
      label: "Dashboard",
      route: "/dashboard",
      icon: <DashboardOutlinedIcon />,
      desktopIcon: <DashboardOutlinedIcon sx={{ marginRight: 1 }} />,
    },
    {
      label: "Produtos",
      route: "/produtos/listagem",
      icon: <CategoryOutlinedIcon />,
      desktopIcon: <CategoryOutlinedIcon sx={{ marginRight: 1 }} />,
    },
    {
      label: "Entradas",
      route: "/entradas/listagem",
      icon: <AddShoppingCartIcon />,
      desktopIcon: <AddShoppingCartIcon sx={{ marginRight: 1 }} />,
    },
    {
      label: "Saídas",
      route: "/saidas/listagem",
      icon: <RemoveShoppingCartIcon />,
      desktopIcon: <RemoveShoppingCartIcon sx={{ marginRight: 1 }} />,
    },
    {
      label: "Relatórios", // Novo item para o ReportGenerator
      route: "/report",
      icon: <PictureAsPdfIcon />,
      desktopIcon: <PictureAsPdfIcon sx={{ marginRight: 1 }} />,
    },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: theme.palette.primary.main,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <IconButton
            onClick={() => navigate("/")}
            sx={{
              color: "white",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.1)",
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <StorefrontIcon fontSize="large" />
          </IconButton>

          {isMobile && (
            <IconButton
              size="large"
              aria-label="open navigation menu"
              onClick={toggleDrawer(true)}
              sx={{
                color: "white",
                transition: "background-color 0.2s",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                },
              }}
            >
              <ListIcon />
            </IconButton>
          )}

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 2,
              alignItems: "center",
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.route}
                onClick={() => handleNavigation(item.route)}
                startIcon={item.desktopIcon}
                sx={{
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  textTransform: "none",
                  fontWeight: "bold",
                  backgroundColor: isActive(item.route)
                    ? "rgba(255,255,255,0.2)"
                    : "transparent",
                  borderRadius: 2,
                  paddingX: 2,
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transform: "scale(1.05)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {navItems.map((item) => (
              <ListItem key={item.route} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.route)}
                  sx={{
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default NavBar;
