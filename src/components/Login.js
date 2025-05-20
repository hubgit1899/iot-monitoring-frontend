import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  useTheme,
} from "@mui/material";
import { Lock as LockIcon } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (login(credentials.username, credentials.password)) {
      navigate("/admin");
    } else {
      setError("Invalid credentials");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        bgcolor: "background.default",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            mb: 4,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <LockIcon sx={{ fontSize: 40, mb: 2 }} />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Admin Login
            </Typography>
            <Typography variant="subtitle1">
              Enter your credentials to access the admin console
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{
                mb: 2,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(255, 255, 255, 0.9)",
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{
                mb: 3,
                bgcolor:
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(255, 255, 255, 0.9)",
              }}
            />
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  bgcolor: theme.palette.primary.dark,
                },
              }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
