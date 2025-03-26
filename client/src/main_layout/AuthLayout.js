import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import FloatingHomeButton from "../components/FloatingHomeButton";

// Main container with a gradient background and neon accents
const MainContainer = styled(Box)({
  background: "linear-gradient(135deg, #1a1a1d, #4e4e50)",
  minHeight: "100vh",
  margin: 0,
  padding: 0,
  color: "#fff",
});

// Content area for nested routes
const Content = styled(Box)({
  padding: "20px",
});

const AuthLayout = () => {
  return (
    <MainContainer>
      <Content>
        <Outlet />
        <FloatingHomeButton />
      </Content>
    </MainContainer>
  );
};

export default AuthLayout;
