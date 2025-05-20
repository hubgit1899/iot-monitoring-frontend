import React, { useState, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  GlobalStyles,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { DeviceDataProvider } from "./context/DeviceDataContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Dashboard from "./components/Dashboard";
import AdminConsole from "./components/AdminConsole";
import Login from "./components/Login";
import ThemeToggle from "./components/ThemeToggle";
import {
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Main App component
const AppContent = () => {
  const [mode, setMode] = useState("light");
  const { isAuthenticated, logout } = useAuth();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // 1. Create theme first
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "light" ? "#6366f1" : "#818cf8", // daisyUI indigo
            contrastText: "#fff",
          },
          secondary: {
            main: mode === "light" ? "#f472b6" : "#f9a8d4", // daisyUI pink
            contrastText: "#fff",
          },
          background: {
            default: mode === "light" ? "#f3f4f6" : "#181825", // daisyUI base-200/base-300
            paper: mode === "light" ? "#fff" : "#232336",
          },
          info: {
            main: "#06b6d4", // daisyUI cyan
          },
          success: {
            main: "#22d3ee", // daisyUI teal
          },
          warning: {
            main: "#facc15", // daisyUI yellow
          },
          error: {
            main: "#f87171", // daisyUI red
          },
        },
        typography: {
          fontFamily: "Poppins, DotGothic16, sans-serif",
          h4: {
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontFamily: "Poppins, DotGothic16, sans-serif",
          },
          h6: {
            fontWeight: 700,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            fontFamily: "Poppins, DotGothic16, sans-serif",
          },
          h3: {
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            fontFamily: "Poppins, DotGothic16, sans-serif",
          },
          button: {
            fontFamily: "Poppins, DotGothic16, sans-serif",
            fontWeight: 600,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                borderRadius: 12,
                fontWeight: 600,
                letterSpacing: 0.5,
                boxShadow: "0 2px 8px 0 rgba(26,34,63,0.08)",
                transition: "background 0.3s, color 0.3s",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 20,
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
                backdropFilter: "blur(8px)",
                background:
                  mode === "light"
                    ? "rgba(255,255,255,0.90)"
                    : "rgba(35,39,47,0.90)",
                transition: "background 0.3s",
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                background:
                  mode === "light"
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(24,24,37,0.95)",
                color: mode === "light" ? "#232336" : "#f3f4f6",
                boxShadow: "0 4px 24px 0 rgba(99,102,241,0.10)",
                backdropFilter: "blur(12px)",
                borderRadius: 0,
                zIndex: 1201,
                px: { xs: 1, sm: 4 },
                borderBottom: `1.5px solid ${
                  mode === "light" ? "#e0e7ef" : "#232336"
                }`,
                transition: "background 0.3s",
              },
            },
          },
        },
        transitions: {
          create: () => "all 0.3s cubic-bezier(0.4,0,0.2,1) 0ms",
        },
      }),
    [mode]
  );

  // 2. Now use theme in useMediaQuery
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobileNav = useMediaQuery(theme.breakpoints.down("sm"));

  // Initialize theme based on system preference
  React.useEffect(() => {
    setMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const navLinks = [
    { label: "Dashboard", to: "/", icon: <DashboardIcon /> },
    isAuthenticated
      ? { label: "Admin Console", to: "/admin", icon: <SettingsIcon /> }
      : { label: "Admin Login", to: "/login", icon: <SettingsIcon /> },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: { fontFamily: "'DotGothic16', monospace" },
        }}
      />
      <DeviceDataProvider>
        <Router>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            {/* Modern Navbar */}
            <AppBar
              position="fixed"
              elevation={0}
              sx={{
                background:
                  theme.palette.mode === "light"
                    ? "rgba(255,255,255,0.85)"
                    : "rgba(26,34,63,0.95)",
                boxShadow: "0 4px 24px 0 rgba(26,34,63,0.10)",
                backdropFilter: "blur(12px)",
                borderRadius: 0,
                zIndex: 1201,
                px: { xs: 1, sm: 4 },
              }}
            >
              <Toolbar
                disableGutters
                sx={{
                  minHeight: 72,
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      letterSpacing: 2,
                      fontFamily: "Poppins, sans-serif",
                      textShadow: "0 2px 8px rgba(0,201,167,0.10)",
                      ml: { xs: 1, sm: 0 },
                    }}
                  >
                    IoT
                    <span style={{ color: theme.palette.secondary.main }}>
                      •
                    </span>
                    Monitor
                  </Typography>
                </Box>
                {/* Desktop Nav */}
                {!isMobileNav && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {navLinks.map((link, idx) => (
                      <Button
                        key={link.label}
                        color="inherit"
                        component={Link}
                        to={link.to}
                        startIcon={link.icon}
                        sx={{
                          fontWeight: 600,
                          fontFamily: "Poppins, sans-serif",
                          fontSize: 18,
                          px: 2,
                          borderRadius: 2,
                          transition: "background 0.2s",
                          "&:hover": {
                            background: theme.palette.action.hover,
                          },
                        }}
                        onClick={() => setDrawerOpen(false)}
                      >
                        {link.label}
                      </Button>
                    ))}
                    {isAuthenticated && (
                      <Button
                        color="inherit"
                        onClick={logout}
                        startIcon={<LogoutIcon />}
                        sx={{
                          fontWeight: 600,
                          fontFamily: "Poppins, sans-serif",
                          fontSize: 18,
                          px: 2,
                          borderRadius: 2,
                        }}
                      >
                        Logout
                      </Button>
                    )}
                    <ThemeToggle toggleTheme={toggleTheme} />
                  </Box>
                )}
                {/* Mobile Nav */}
                {isMobileNav && (
                  <>
                    <IconButton
                      color="inherit"
                      onClick={() => setDrawerOpen(true)}
                    >
                      <MenuIcon fontSize="large" />
                    </IconButton>
                    <Drawer
                      anchor="right"
                      open={drawerOpen}
                      onClose={() => setDrawerOpen(false)}
                      PaperProps={{
                        sx: {
                          bgcolor: theme.palette.background.paper,
                          minWidth: 220,
                          pt: 2,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          pr: 1,
                        }}
                      >
                        <IconButton onClick={() => setDrawerOpen(false)}>
                          <CloseIcon />
                        </IconButton>
                      </Box>
                      <Divider sx={{ mb: 1 }} />
                      <List>
                        {navLinks.map((link) => (
                          <ListItem key={link.label} disablePadding>
                            <ListItemButton
                              component={Link}
                              to={link.to}
                              onClick={() => setDrawerOpen(false)}
                            >
                              <ListItemIcon>{link.icon}</ListItemIcon>
                              <ListItemText
                                primary={link.label}
                                primaryTypographyProps={{
                                  fontFamily: "Poppins, sans-serif",
                                  fontWeight: 600,
                                  fontSize: 18,
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                        {isAuthenticated && (
                          <ListItem disablePadding>
                            <ListItemButton
                              onClick={() => {
                                logout();
                                setDrawerOpen(false);
                              }}
                            >
                              <ListItemIcon>
                                <LogoutIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary="Logout"
                                primaryTypographyProps={{
                                  fontFamily: "Poppins, sans-serif",
                                  fontWeight: 600,
                                  fontSize: 18,
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        )}
                      </List>
                      <Box sx={{ px: 2, py: 1 }}>
                        <ThemeToggle toggleTheme={toggleTheme} />
                      </Box>
                    </Drawer>
                  </>
                )}
              </Toolbar>
            </AppBar>
            <Box component="main" sx={{ flexGrow: 1, pt: { xs: 10, sm: 11 } }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminConsole />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Box>
          </Box>
        </Router>
      </DeviceDataProvider>
    </ThemeProvider>
  );
};

// Root App component with providers
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
