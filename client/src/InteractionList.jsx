import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Loader from "./utils/Loader";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function InteractionList() {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this interaction?")) {
      try {
        const response = await fetch(`${SERVER_URL}/api/interactions/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setInteractions((prev) => prev.filter((i) => i.id !== id));
        } else {
          console.error("Failed to delete interaction");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetch(`${SERVER_URL}/api/interactions`)
      .then((response) => response.json())
      .then((data) => {
        setInteractions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching interactions:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Interaction Management
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={RouterLink}
        to="/interactions/new"
        sx={{ mb: 2 }}
      >
        Add New Interaction
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Interaction Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Restaurant ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interactions.map((i) => (
              <TableRow key={i.id}>
                <TableCell>{i.id}</TableCell>
                <TableCell>{i.interaction_date.split("T")[0]}</TableCell>
                <TableCell>{i.type}</TableCell>
                <TableCell>{i.details}</TableCell>
                <TableCell>{i.restaurant_id}</TableCell>
                <TableCell>
                  <IconButton
                    component={RouterLink}
                    to={`/interactions/edit/${i.id}`}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(i.id)} color="error">
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

export default InteractionList;