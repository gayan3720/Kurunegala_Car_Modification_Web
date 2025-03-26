import React, { useState } from "react";
import { useLoginMutation } from "../redux/api_slices/authApiSlice";
import { Box, TextField, Button, Typography } from "@mui/material";
import { keyframes, styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import MessageModel from "../components/MessageModel";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";

// Define a fade-in animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Full-page dark background container
const DarkBackground = styled(Box)({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1a1a1d, #4e4e50)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

// Neon container for the login form
const NeonContainer = styled(Box)({
  maxWidth: 400,
  padding: "2rem",
  background: "rgba(0, 0, 0, 0.6)",
  borderRadius: "8px",
  border: "2px solid #0ff",
  boxShadow: "0 0 20px #0ff",
  animation: `${fadeIn} 1s ease-out`,
});

// Neon styled title
const NeonTitle = styled(Typography)({
  color: "#0ff",
  textShadow: "0 0 10px #0ff",
  textAlign: "center",
  marginBottom: "1rem",
  animation: `${fadeIn} 1.5s ease-out`,
});

// Neon styled button with hover animation
const NeonButton = styled(Button)({
  backgroundColor: "#0ff",
  color: "#000",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#0cc",
    transform: "scale(1.05)",
    transition: "all 0.3s ease",
  },
});

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [login, { isLoading, error }] = useLoginMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(formData).unwrap();
      if (result && result.result === 1) {
        <MessageModel type="success" text={result.message} />;
        navigate("/");
        dispatch(setCredentials(result));
      }
      console.log("Login successful:", result);
      // Optionally, store the token or redirect the user after successful login.
    } catch (err) {
      <MessageModel type="error" text={err.message} />;
      console.error("Login failed:", err);
    }
  };

  return (
    <DarkBackground>
      <NeonContainer>
        <NeonTitle variant="h4">Login</NeonTitle>
        <form onSubmit={handleSubmit}>
          <TextField
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{ style: { color: "#0ff" } }}
            InputLabelProps={{ style: { color: "#0ff" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#0ff" },
                "&:hover fieldset": { borderColor: "#0cc" },
                "&.Mui-focused fieldset": { borderColor: "#0ff" },
              },
            }}
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{ style: { color: "#0ff" } }}
            InputLabelProps={{ style: { color: "#0ff" } }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#0ff" },
                "&:hover fieldset": { borderColor: "#0cc" },
                "&.Mui-focused fieldset": { borderColor: "#0ff" },
              },
            }}
          />
          {error && (
            <Typography color="error" variant="body2" align="center">
              {error.data?.message || "Login failed"}
            </Typography>
          )}
          <NeonButton
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </NeonButton>
        </form>
      </NeonContainer>
    </DarkBackground>
  );
};

export default LoginPage;
