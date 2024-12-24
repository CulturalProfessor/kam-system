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
    outcome: "",
    details: "",
    duration_minutes: 0,
    restaurant_id: "",
    contact_id: "",
  });
  const [restaurants, setRestaurants] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      fetch(`${SERVER_URL}/api/interactions/${id}`)
        .then((response) => response.json())
        .then((data) => setFormData(data))
        .catch((err) => setError(err.message));
    }
  }, [id, isEdit]);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/restaurants`)
      .then((response) => response.json())
      .then((data) => setRestaurants(data))
      .catch((error) => console.error("Error fetching restaurants:", error));

    fetch(`${SERVER_URL}/api/contacts`)
      .then((response) => response.json())
      .then((data) => setContacts(data))
      .catch((error) => console.error("Error fetching contacts:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "restaurant_id") {
      setFormData((prev) => ({
        ...prev,
        restaurant_id: value,
        contact_id: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

  const handleAutofill = () => {
    const randomIndex = Math.floor(Math.random() * restaurants.length);
    const randomRestaurant = restaurants[randomIndex];
    const contactsForRestaurant = contacts.filter(
      (contact) => contact.restaurant_id === randomRestaurant.id
    );

    setFormData({
      interaction_date: new Date().toISOString().split("T")[0],
      type: "Call",
      outcome: "Successful",
      details: "Sample interaction details",
      duration_minutes: 30,
      restaurant_id: randomRestaurant.id,
      contact_id: contactsForRestaurant[0].id,
    });
  };

  if (isEdit && !formData.type) {
    return <Loader />;
  }

  const filteredContacts = contacts.filter(
    (contact) => contact.restaurant_id === Number(formData.restaurant_id)
  );

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

        <FormControl fullWidth margin="normal">
          <InputLabel>Outcome</InputLabel>
          <Select
            name="outcome"
            value={formData.outcome}
            onChange={handleChange}
            required
            sx={{ marginTop: 1 }}
          >
            <MenuItem value="Successful">Success</MenuItem>
            <MenuItem value="Needs Follow-Up">Needs Follow-Up</MenuItem>
            <MenuItem value="No Response">No Response</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
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

        <TextField
          fullWidth
          label="Duration (minutes)"
          name="duration_minutes"
          value={formData.duration_minutes}
          onChange={handleChange}
          type="number"
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

        <FormControl fullWidth margin="normal">
          <InputLabel>Contact ID</InputLabel>
          <Select
            name="contact_id"
            value={formData.contact_id}
            onChange={handleChange}
            required
            sx={{ marginTop: 1 }}
            disabled={!formData.restaurant_id}
          >
            {filteredContacts.map((contact) => (
              <MenuItem key={contact.id} value={contact.id}>
                {contact.id} - {contact.name}
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
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mt: 2, ml: 2 }}
          onClick={handleAutofill}
        >
          Autofill
        </Button>
      </form>
    </Container>
  );
}

export default InteractionForm;
