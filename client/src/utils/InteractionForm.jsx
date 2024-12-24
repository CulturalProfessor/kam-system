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

InteractionForm.propTypes = {
  isEdit: PropTypes.bool,
};

function InteractionForm({ isEdit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    interaction_date: "",
    type: "",
    details: "",
    restaurant_id: "",
  });
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  // Fetch existing interaction data if in edit mode
  useEffect(() => {
    if (isEdit) {
      fetch(`${SERVER_URL}/api/interactions/${id}`)
        .then((response) => response.json())
        .then((data) => setFormData(data))
        .catch((err) => setError(err.message));
    }
  }, [id, isEdit]);

  // Fetch the list of restaurants
  useEffect(() => {
    fetch(`${SERVER_URL}/api/restaurants`)
      .then((response) => response.json())
      .then((data) => setRestaurants(data))
      .catch((error) => console.error("Error fetching restaurants:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEdit
      ? `${SERVER_URL}/api/interactions/${id}`
      : `${SERVER_URL}/api/interactions`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        navigate("/interactions");
      } else {
        const errData = await response.json();
        setError(
          errData.error || `Error ${isEdit ? "updating" : "adding"} interaction`
        );
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (isEdit && !formData.type) {
    return <Loader />;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? "Update Interaction" : "Add New Interaction"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Interaction Date"
          name="interaction_date"
          value={formData.interaction_date}
          onChange={handleChange}
          required
          type="date"
          InputLabelProps={{ shrink: true }}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Interaction Type</InputLabel>
          <Select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            sx={{ marginTop: 1 }}
          >
            <MenuItem value="Call">Call</MenuItem>
            <MenuItem value="Meeting">Meeting</MenuItem>
            <MenuItem value="Email">Email</MenuItem>
            <MenuItem value="Site Visit">Site Visit</MenuItem>
            <MenuItem value="Follow-Up">Follow-Up</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Details"
          name="details"
          value={formData.details}
          onChange={handleChange}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Restaurant ID</InputLabel>
          <Select
            name="restaurant_id"
            value={formData.restaurant_id}
            onChange={handleChange}
            required
            sx={{ marginTop: 1 }}
          >
            {restaurants.map((restaurant) => (
              <MenuItem key={restaurant.id} value={restaurant.id}>
                {restaurant.id} - {restaurant.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

export default InteractionForm;
