import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Loader from "./Loader";
import PropTypes from "prop-types";
import { fetchContactById, fetchAllRestaurants, saveContact } from "../utils/apis";

ContactForm.propTypes = {
  isEdit: PropTypes.bool,
};

function ContactForm({ isEdit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    preferred_contact_method: "",
    time_zone: "",
    restaurant_id: "",
  });
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      fetchContactById(id)
        .then((data) => setFormData(data))
        .catch((err) => setError(err.message));
    }
  }, [id, isEdit]);

  useEffect(() => {
    fetchAllRestaurants()
      .then((data) => setRestaurants(data))
      .catch((err) => setError(err.message));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveContact(formData, isEdit, id);
      navigate("/contacts");
    } catch (err) {
      setError(err.message);
    }
  };

  const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

  const handleAutofill = () => {
    const randomNames = ["John Doe", "Jane Smith", "Alice Brown", "Bob White"];
    const randomRoles = ["Manager", "Supervisor", "Chef", "Coordinator"];
    const randomEmails = [
      "john.doe@example.com",
      "jane.smith@example.com",
      "alice.brown@example.com",
      "bob.white@example.com",
    ];
    const randomPhones = [
      "1234567890",
      "9876543210",
      "5556667777",
      "1112223333",
    ];
    const randomMethods = ["Phone", "WhatsApp", "Email", "SMS"];
    const randomTimeZones = ["PST", "EST", "CST", "MST"];
  
    const randomRestaurant =
      restaurants.length > 0
        ? getRandomItem(restaurants)
        : { id: "", name: "No Restaurant Available" };
  
    setFormData({
      name: getRandomItem(randomNames),
      role: getRandomItem(randomRoles),
      email: getRandomItem(randomEmails),
      phone: getRandomItem(randomPhones),
      preferred_contact_method: getRandomItem(randomMethods),
      time_zone: getRandomItem(randomTimeZones),
      restaurant_id: randomRestaurant.id,
    });
  };
  
  if (isEdit && !formData.name) {
    return <Loader />;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? "Edit Contact" : "Add Contact"}
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
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Preferred Contact Method</InputLabel>
          <Select
            name="preferred_contact_method"
            value={formData.preferred_contact_method}
            onChange={handleChange}
            required
            sx={{ marginTop: 1 }}
          >
            <MenuItem value="Phone">Phone</MenuItem>
            <MenuItem value="Email">Email</MenuItem>
            <MenuItem value="SMS">SMS</MenuItem>
            <MenuItem value="Whatsapp">Whatsapp</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Time Zone"
          name="time_zone"
          value={formData.time_zone}
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
          Submit
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

export default ContactForm;
