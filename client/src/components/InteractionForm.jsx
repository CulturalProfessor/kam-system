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
import {
  fetchInteractionById,
  fetchAllRestaurants,
  fetchAllContacts,
  saveInteraction,
} from "../utils/apis";

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
      fetchInteractionById(id)
        .then((data) => setFormData(data))
        .catch((err) => setError(err.message));
    }
  }, [id, isEdit]);

  useEffect(() => {
    fetchAllRestaurants()
      .then((data) => setRestaurants(data))
      .catch((error) => console.error("Error fetching restaurants:", error));

    fetchAllContacts()
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
    try {
      await saveInteraction(formData, isEdit, id);
      navigate("/interactions");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAutofill = () => {
    if (restaurants.length === 0) return;
  
    const randomRestaurant =
      restaurants[Math.floor(Math.random() * restaurants.length)] || {};
  
    const validContacts = contacts.filter(
      (contact) => contact.restaurant_id === randomRestaurant.id
    );
  
    setFormData({
      interaction_date: new Date().toISOString().split("T")[0],
      type: ["Call", "Meeting", "Email", "Site_Visit", "Follow_Up"][
        Math.floor(Math.random() * 5)
      ],
      outcome: ["Successful", "Needs_Follow_Up", "No_Response", "Cancelled"][
        Math.floor(Math.random() * 4)
      ],
      details: "Random interaction details",
      duration_minutes: Math.floor(Math.random() * 120) + 1,
      restaurant_id: randomRestaurant.id || "",
      contact_id:
        validContacts.length > 0
          ? validContacts[Math.floor(Math.random() * validContacts.length)].id
          : "",
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
            <MenuItem value="Site_Visit">Site Visit</MenuItem>
            <MenuItem value="Follow_Up">Follow-Up</MenuItem>
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

        <FormControl
          fullWidth
          margin="normal"
          disabled={!formData.restaurant_id}
        >
          <InputLabel>Contact ID</InputLabel>
          <Select
            name="contact_id"
            value={formData.contact_id}
            onChange={handleChange}
            required
            sx={{ marginTop: 1 }}
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
