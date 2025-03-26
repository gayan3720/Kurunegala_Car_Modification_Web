import React from "react";
import { styled, keyframes } from "@mui/system";
import { Fab } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";

// Optional neon flicker animation
const flicker = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.95; }
  100% { opacity: 1; }
`;

// Neon-styled Fab (Floating Action Button)
const NeonFab = styled(Fab)({
  position: "fixed",
  bottom: "20px",
  right: "20px",
  backgroundColor: "#0ff", // Neon cyan
  color: "#000", // Black icon color
  boxShadow: "0 0 20px #0ff", // Neon glow
  animation: `${flicker} 2s infinite`,
  "&:hover": {
    backgroundColor: "#0cc",
    transform: "scale(1.05)",
    transition: "all 0.3s ease",
  },
});

const FloatingHomeButton = () => {
  return (
    <NeonFab component={Link} to="/">
      <HomeIcon />
    </NeonFab>
  );
};

export default FloatingHomeButton;
