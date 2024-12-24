import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Loader from "./utils/Loader";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        const response = await fetch(`${SERVER_URL}/api/restaurants/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setRestaurants((prev) => prev.filter((r) => r.id !== id));
        } else {
          console.error("Failed to delete restaurant");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetch(`${SERVER_URL}/api/restaurants`)
      .then((response) => response.json())
      .then((data) => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching restaurants:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Lead Management: Restaurants
      </Typography>

      <Button
        variant="contained"
        color="primary"
        component={RouterLink}
        to="/new"
        sx={{ mb: 2 }}
      >
        Add New Restaurant
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurants.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.address}</TableCell>
                <TableCell>{r.status}</TableCell>
                <TableCell>
                  <IconButton
                    component={RouterLink}
                    to={`/update/${r.id}`}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(r.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default RestaurantList;
