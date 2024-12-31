import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Paper,
  Divider,
  Avatar,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { registerUser } from "../utils/apis";
import { useUser } from "../hooks/useUser";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(formData);
      const accessToken = data.access_token;
      const userId = data.id;
      login(userId, accessToken);
      navigate("/restaurants");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box textAlign="center" sx={{ mb: 2 }}>
          <Avatar sx={{ bgcolor: "primary.main", mx: "auto", mb: 1 }}>
            <PersonAddIcon />
          </Avatar>
          <Typography variant="h4" align="center" gutterBottom>
            Create Your Account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Join the KAM Lead Management System and streamline your workflow.
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
          </Box>
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
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                label="Role"
              >
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="KAM">Key Account Manager</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <InfoOutlinedIcon color="info" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Roles define your access level within the system.
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mb: 2 }}
          >
            Register
          </Button>
        </form>

        <Typography align="center" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Button variant="text" onClick={() => navigate("/login")}>
            Login
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

export default Register;
