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
import { fetchContacts, deleteContact } from "./utils/apis";

function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await deleteContact(id);
        setContacts((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const data = await fetchContacts();
        setContacts(data);
      } catch (error) {
        console.error("Error fetching contacts:", error.message);
      } finally {
        setLoading(false);
      }
    };
    loadContacts();
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
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
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Preferred Contact Method</TableCell>
              <TableCell>Time Zone</TableCell>
              <TableCell>Restaurant ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((c) => (
              <TableRow key={c.id} sx={{ "& > *": { whiteSpace: "nowrap" } }}>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.role}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.preferred_contact_method}</TableCell>
                <TableCell>{c.time_zone}</TableCell>
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
