import React from "react";
import { IconButton, Tooltip, useTheme } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const ThemeToggle = ({ toggleTheme }) => {
  const theme = useTheme();

  return (
    <Tooltip
      title={`Switch to ${
        theme.palette.mode === "light" ? "dark" : "light"
      } mode`}
    >
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        sx={{
          ml: 1,
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "rotate(180deg)",
          },
        }}
      >
        {theme.palette.mode === "light" ? <Brightness4 /> : <Brightness7 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
