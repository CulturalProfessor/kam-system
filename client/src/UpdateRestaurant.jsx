import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, TextField, Button, Typography } from "@mui/material";
import Loader from "./utils/Loader";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function UpdateRestaurant() {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${SERVER_URL}/api/restaurants/${id}`)
      .then((response) => response.json())
      .then((data) => setFormData(data))
      .catch((err) => setError(err.message));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${SERVER_URL}/api/restaurants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        navigate("/");
      } else {
        const errData = await response.json();
        setError(errData.error || "Error updating restaurant");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (!formData) {
    return <Loader />;
  }
  
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Update Restaurant
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
          Update
        </Button>
      </form>
    </Container>
  );
}

export default UpdateRestaurant;
