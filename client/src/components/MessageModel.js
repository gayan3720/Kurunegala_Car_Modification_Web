import React from "react";
import { Typography } from "@mui/material";
import { keyframes, styled } from "@mui/system";

// Neon flicker animation
const flicker = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.95;
  }
  100% {
    opacity: 1;
  }
`;

// Styled Typography that accepts a custom "colorProp"
const NeonText = styled(Typography)(({ colorProp }) => ({
  color: colorProp,
  textShadow: `0 0 10px ${colorProp}`,
  animation: `${flicker} 2s infinite`,
  textAlign: "center",
  marginTop: "1rem",
}));

/**
 * Reusable Neon Message Component
 * @param {string} type - The type of message ("success", "error", "info", "warning", etc.)
 * @param {string} text - The message text to display
 * @returns {JSX.Element|null}
 */
const MessageModel = ({ type, text }) => {
  if (!text) return null; // If there's no text, don't render anything

  let color = "#0ff"; // Default neon cyan
  switch (type) {
    case "success":
      color = "#0f0"; // Neon green
      break;
    case "error":
      color = "#f00"; // Bright red
      break;
    case "warning":
      color = "#ff0"; // Bright yellow
      break;
    case "info":
    default:
      color = "#0ff"; // Neon cyan
      break;
  }

  return <NeonText colorProp={color}>{text}</NeonText>;
};

export default MessageModel;
