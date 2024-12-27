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
import { fetchRestaurantById, saveRestaurant } from "../utils/apis";
import { useUser } from "../utils/context";

RestaurantForm.propTypes = {
  isEdit: PropTypes.bool,
};

function RestaurantForm({ isEdit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    status: "New",
    call_frequency: "Weekly",
    last_call_date: "",
    revenue: 0,
    notes: "",
  });
  const [error, setError] = useState(null);
  const {user}=useUser();
  console.log(user);
  useEffect(() => {
    if (isEdit) {
      fetchRestaurantById(id)
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
    try {
      await saveRestaurant(formData, isEdit, id);
      navigate("/restaurants");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAutofill = () => {
    setFormData({
      name: "Sample Restaurant",
      address: "123 Test Street, Test City",
      status: "Contacted",
      call_frequency: "Weekly",
      last_call_date: new Date().toISOString().split("T")[0],
      revenue: 50000,
      notes: "This is a sample note for testing autofill functionality.",
    });
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
        <TextField
          fullWidth
          label="Revenue"
          name="revenue"
          type="number"
          value={formData.revenue}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Notes"
          name="notes"
          value={formData.notes}
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
          sx={{ mt: 2, mr: 2 }}
        >
          {isEdit ? "Update" : "Submit"}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mt: 2 }}
          onClick={handleAutofill}
        >
          Autofill
        </Button>
      </form>
    </Container>
  );
}

export default RestaurantForm;
