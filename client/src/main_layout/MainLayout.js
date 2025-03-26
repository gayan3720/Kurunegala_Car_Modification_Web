import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Modal,
} from "@mui/material";
import { keyframes, styled } from "@mui/system";
import FloatingHomeButton from "../components/FloatingHomeButton";
import PersonOffOutlined from "@mui/icons-material/PersonOffOutlined";
import Person2TwoTone from "@mui/icons-material/Person2TwoTone";
import { useSelector } from "react-redux";
import { getUser } from "../redux/slices/authSlice";

// 1) NEON FLICKER ANIMATION
const neonAnimation = keyframes`
  0% {
    text-shadow: 0 0 5px #0ff, 0 0 10px #0ff;
  }
  50% {
    text-shadow: 0 0 20px #0ff, 0 0 30px #0ff;
  }
  100% {
    text-shadow: 0 0 5px #0ff, 0 0 10px #0ff;
  }
`;

// 2) NEON TYPOGRAPHY
const NeonTypography = styled(Typography)({
  color: "#0ff",
  animation: `${neonAnimation} 1.5s infinite alternate`,
});

// 3) MAIN CONTAINER
const MainContainer = styled(Box)({
  background: "linear-gradient(135deg, #1a1a1d, #4e4e50)",
  minHeight: "100vh",
  margin: 0,
  padding: 0,
  color: "#fff",
});

// 4) CONTENT AREA
const Content = styled(Box)({
  padding: "20px",
});

// 5) MODAL BOX STYLING
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "#111",
  border: "2px solid #0ff",
  boxShadow: 24,
  p: 4,
  color: "#fff",
  width: 300,
  textAlign: "center",
};

const MainLayout = () => {
  const user = useSelector(getUser);

  // State to control modal open/close
  const [open, setOpen] = useState(false);

  // Toggle modal visibility
  const handleAvatarClick = () => {
    setOpen(!open);
  };

  // Close modal
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <MainContainer>
      <AppBar
        position="static"
        sx={{
          background: "#111",
          boxShadow: "0 0 10px #0ff",
          mb: 2,
        }}
      >
        <Toolbar>
          <NeonTypography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Car Modifications
          </NeonTypography>

          {/* Example Links */}
          <Button component={Link} to="/" sx={{ color: "#0ff" }}>
            Home
          </Button>
          <Button component={Link} to="/recognition" sx={{ color: "#0ff" }}>
            Vehicle Recognition
          </Button>
          <Button component={Link} to="/shops" sx={{ color: "#0ff" }}>
            Shops Management
          </Button>
          <Button component={Link} to="/parts" sx={{ color: "#0ff" }}>
            Parts Management
          </Button>
          <Button component={Link} to="/users" sx={{ color: "#0ff" }}>
            User Management
          </Button>

          {/* 6) AVATAR THAT OPENS MODAL ON CLICK */}
          <Avatar
            onClick={handleAvatarClick}
            sx={{ cursor: "pointer", bgcolor: "#0ff", color: "#000", ml: 2 }}
          >
            {!user ? <PersonOffOutlined /> : <Person2TwoTone />}
          </Avatar>

          {/* 7) MODAL WITH CONDITIONAL CONTENT */}
          <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
              {user ? (
                <>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Welcome, {user.name}!
                  </Typography>
                  <Typography variant="subtitle1">Role: {user.role}</Typography>
                  {/* Additional user info or logout button could go here */}
                </>
              ) : (
                <>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Please Login or Register
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Button
                      component={Link}
                      to="/auth/login"
                      variant="contained"
                      sx={{ bgcolor: "#0ff", color: "#000" }}
                      onClick={handleClose}
                    >
                      Login
                    </Button>
                    <Button
                      component={Link}
                      to="/auth/register"
                      variant="contained"
                      sx={{ bgcolor: "#0ff", color: "#000" }}
                      onClick={handleClose}
                    >
                      Register
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Modal>
        </Toolbar>
      </AppBar>

      <Content>
        {/* 8) RENDER CHILD ROUTES */}
        <Outlet />
        {/* 9) FLOATING HOME BUTTON ON ALL PAGES */}
        <FloatingHomeButton />
      </Content>
    </MainContainer>
  );
};

export default MainLayout;
