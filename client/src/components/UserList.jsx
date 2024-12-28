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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Loader from "./Loader";
import { fetchUsersFromCurrentRole, deleteUser } from "../utils/apis";
import { useUser } from "../hooks/useUser";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        setUsers((prev) => prev.filter((user) => user.id !== id));
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      if (!user) return;

      try {
        const data = await fetchUsersFromCurrentRole(user);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Management
        </Typography>

        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/users/new"
          sx={{ mb: 2 }}
        >
          Add New User
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                sx={{ "& > *": { whiteSpace: "nowrap" } }}
              >
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.created_at.split("T")[0] || "N/A"}</TableCell>
                <TableCell>
                  <IconButton
                    component={RouterLink}
                    to={`/users/edit/${user.id}`}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(user.id)}
                    color="error"
                  >
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

export default UserList;
