import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import Loader from "./Loader";
import PropTypes from "prop-types";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

RestaurantForm.propTypes = {
  isEdit: PropTypes.bool,
};

function RestaurantForm({ isEdit }) {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    status: "New",
    call_frequency: "Weekly",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      fetch(`${SERVER_URL}/api/restaurants/${id}`)
        .then((response) => response.json())
        .then((data) => setFormData(data))
        .catch((err) => setError(err.message));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEdit
      ? `${SERVER_URL}/api/restaurants/${id}`
      : `${SERVER_URL}/api/restaurants`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        navigate("/");
      } else {
        const errData = await response.json();
        setError(
          errData.error || `Error ${isEdit ? "updating" : "adding"} restaurant`
        );
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (isEdit && !formData.name) {
    return <Loader />;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? "Update Restaurant" : "Add New Restaurant"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            sx={{ marginTop: 1 }}
          >
            <MenuItem value="New">New</MenuItem>
            <MenuItem value="Contacted">Contacted</MenuItem>
            <MenuItem value="Converted">Converted</MenuItem>
            <MenuItem value="Lost">Lost</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Call Frequency</InputLabel>
          <Select
            name="call_frequency"
            value={formData.call_frequency}
            onChange={handleChange}
            required
            sx={{ marginTop: 1 }}
          >
            <MenuItem value="Daily">Daily</MenuItem>
            <MenuItem value="Weekly">Weekly</MenuItem>
            <MenuItem value="Monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Last Call Date"
          name="last_call_date"
          type="date"
          value={formData.last_call_date || ""}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          margin="normal"
        />
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          {isEdit ? "Update" : "Submit"}
        </Button>
      </form>
    </Container>
  );
}

export default RestaurantForm;
