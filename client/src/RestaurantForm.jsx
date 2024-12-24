import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, TextField, Button, Typography } from "@mui/material";
import Loader from "./utils/Loader";
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
        <TextField
          fullWidth
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Call Frequency"
          name="call_frequency"
          value={formData.call_frequency}
          onChange={handleChange}
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
