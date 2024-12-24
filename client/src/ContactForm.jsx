import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, TextField, Button, Typography } from "@mui/material";
import PropTypes from "prop-types";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

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
    restaurant_id: "",
  });

  useEffect(() => {
    if (isEdit) {
      fetch(`${SERVER_URL}/api/contacts/${id}`)
        .then((response) => response.json())
        .then((data) => setFormData(data))
        .catch((error) => console.error("Error fetching contact:", error));
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEdit
      ? `${SERVER_URL}/api/contacts/${id}`
      : `${SERVER_URL}/api/contacts`;
    const method = isEdit ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        navigate("/contacts");
      } else {
        console.error("Failed to save contact");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
        <TextField
          fullWidth
          label="Restaurant ID"
          name="restaurant_id"
          value={formData.restaurant_id}
          onChange={handleChange}
          required
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
}

export default ContactForm;
