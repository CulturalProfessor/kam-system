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
  Box,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Loader from "./utils/Loader";
import { fetchRestaurants, deleteRestaurant } from "./utils/apis";

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await deleteRestaurant(id);
        setRestaurants((prev) => prev.filter((r) => r.id !== id));
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const data = await fetchRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  const trimText = (text, length = 30) => {
    if (!text) return "N/A";
    return text.length > length ? `${text.slice(0, length)}...` : text;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Lead Management: Restaurants
        </Typography>

        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/restaurants/new"
        >
          Add New Restaurant
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Call Date</TableCell>
              <TableCell>Revenue (INR)</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {restaurants.map((r) => (
              <TableRow key={r.id} sx={{ "& > *": { whiteSpace: "nowrap" } }}>
                <TableCell>{r.id}</TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.address}</TableCell>
                <TableCell>{r.status}</TableCell>
                <TableCell>{r.last_call_date.split("T")[0] || "N/A"}</TableCell>
                <TableCell>{r.revenue}</TableCell>
                <TableCell>
                  <Tooltip title={r.notes || "No notes available"}>
                    <span>{trimText(r.notes)}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <IconButton
                    component={RouterLink}
                    to={`/restaurants/edit/${r.id}`}
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
