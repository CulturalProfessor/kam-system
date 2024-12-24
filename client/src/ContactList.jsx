import { useEffect, useState } from "react";
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
  Box,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import Loader from "./utils/Loader";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        const response = await fetch(`${SERVER_URL}/api/contacts/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setContacts((prev) => prev.filter((c) => c.id !== id));
        } else {
          console.error("Failed to delete contact");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetch(`${SERVER_URL}/api/contacts`)
      .then((response) => response.json())
      .then((data) => {
        setContacts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Contact Management
        </Typography>

        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/contacts/new"
          sx={{ mb: 2 }}
        >
          Add New Contact
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Restaurant ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.role}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.restaurant_id}</TableCell>
                <TableCell>
                  <IconButton
                    component={RouterLink}
                    to={`/contacts/edit/${c.id}`}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(c.id)} color="error">
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

export default ContactList;
