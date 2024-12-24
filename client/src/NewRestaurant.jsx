import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Paper,
} from "@mui/material";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function NewRestaurant() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("New");

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { name, address, status };

    fetch(`${SERVER_URL}/api/restaurants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create restaurant");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Restaurant
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Name"
            variant="outlined"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Address"
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <FormControl fullWidth>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Converted">Converted</MenuItem>
              <MenuItem value="Lost">Lost</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" type="submit">
            Create
          </Button>
        </Box>
      </Paper>
      <Box mt={2}>
        <NavLink to="/" style={{ textDecoration: "none", color: "#1976d2" }}>
          Back to List
        </NavLink>
      </Box>
    </Container>
  );
}

export default NewRestaurant;
