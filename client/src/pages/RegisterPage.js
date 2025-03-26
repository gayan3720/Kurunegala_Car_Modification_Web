import React, { useState } from "react";
import { useRegisterMutation } from "../redux/api_slices/authApiSlice";
import { Box, TextField, Button, Typography } from "@mui/material";
import { keyframes, styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import MessageModel from "../components/MessageModel";

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

// Neon container for the registration form
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

// Custom input field styling to ensure black background
const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#000", // Ensures the input field has a black background
    color: "#0ff", // Text color inside input field
    "& .MuiInputBase-input": {
      color: "#fff", // Ensures the text inside is cyan
    },
    "& fieldset": { borderColor: "#0ff" }, // Default border
    "&:hover fieldset": { borderColor: "#0cc" }, // Border on hover
    "&.Mui-focused fieldset": { borderColor: "#0ff" }, // Border when focused
  },
  "& .MuiInputLabel-root": {
    color: "#0ff !important", // Ensures the label stays neon cyan
  },
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // or "shopOwner"
  });
  const [register, { isLoading, error }] = useRegisterMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData, "form data");

      const result = await register(formData).unwrap();
      if (result && result.result === 1) {
        <MessageModel type="success" text={result.message} />;
        navigate("/auth/login");
      }
      console.log("Registration successful:", result);
      // Optionally, redirect or display a success message here.
    } catch (err) {
      <MessageModel type="error" text={err.message} />;
      console.error("Registration failed:", err);
    }
  };

  return (
    <DarkBackground>
      <NeonContainer>
        <NeonTitle variant="h4">Register</NeonTitle>
        <form onSubmit={handleSubmit}>
          <StyledTextField
            name="name"
            label="Name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <StyledTextField
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <StyledTextField
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <StyledTextField
            name="role"
            label="Role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
            margin="normal"
            helperText="Enter 'customer' or 'shopOwner'"
            required
          />
          {error && (
            <Typography color="error" variant="body2" align="center">
              {error.data?.message || "Registration failed"}
            </Typography>
          )}
          <NeonButton
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{ mt: 2 }}
          >
            {isLoading ? "Registering..." : "Register"}
          </NeonButton>
        </form>
      </NeonContainer>
    </DarkBackground>
  );
};

export default RegisterPage;
