import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Divider,
} from "@mui/material";
import { loginUser } from "../utils/apis";
import { useUser } from "../hooks/useUser";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EventNoteIcon from "@mui/icons-material/EventNote";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login } = useUser();

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);

      const accessToken = data.access_token;
      const userId = data.id;
      login(userId, accessToken);
      navigate("/restaurants");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box textAlign="center" sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to <strong>KAM Lead Management System</strong>
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Streamline your restaurant, contact, and interaction management
            efficiently.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-around", mb: 4 }}>
          <Box textAlign="center">
            <RestaurantMenuIcon fontSize="large" color="primary" />
            <Typography variant="body2">Manage Restaurants</Typography>
          </Box>
          <Box textAlign="center">
            <AccountCircleIcon fontSize="large" color="primary" />
            <Typography variant="body2">Organize Contacts</Typography>
          </Box>
          <Box textAlign="center">
            <EventNoteIcon fontSize="large" color="primary" />
            <Typography variant="body2">Track Interactions</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h5" align="center" gutterBottom>
          Login to Your Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mb: 2 }}
          >
            Login
          </Button>
        </form>

        <Typography align="center" sx={{ mt: 2 }}>
          Don&apos;t have an account?{" "}
          <Button variant="text" onClick={() => navigate("/")}>
            Register
          </Button>
        </Typography>

        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default Login;
