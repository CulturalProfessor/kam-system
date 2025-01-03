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
  Box,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Loader from "./Loader";
import { fetchInteractions, deleteInteraction } from "../utils/apis";

function InteractionList() {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this interaction?")) {
      try {
        await deleteInteraction(id);
        setInteractions((prev) => prev.filter((i) => i.id !== id));
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  useEffect(() => {
    const loadInteractions = async () => {
      try {
        const data = await fetchInteractions();
        setInteractions(data);
      } catch (error) {
        console.error("Error fetching interactions:", error.message);
      } finally {
        setLoading(false);
      }
    };
    loadInteractions();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
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
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Interaction Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Outcome</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Duration Minutes</TableCell>
              <TableCell>Restaurant ID</TableCell>
              <TableCell>Contact ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interactions.map((i) => (
              <TableRow key={i.id} sx={{ "& > *": { whiteSpace: "nowrap" } }}>
                <TableCell>{i.id}</TableCell>
                <TableCell>{i.interaction_date.split("T")[0]}</TableCell>
                <TableCell>{i.type}</TableCell>
                <TableCell>{i.outcome}</TableCell>
                <TableCell>{i.details}</TableCell>
                <TableCell>{i.duration_minutes}</TableCell>
                <TableCell>{i.restaurant_id}</TableCell>
                <TableCell>{i.contact_id}</TableCell>
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
