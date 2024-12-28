import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

function Navbar() {
  const navigate = useNavigate();
  const { logout } = useUser();
  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          KAM Lead Management
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/restaurants">
            Restaurants
          </Button>
          <Button color="inherit" component={RouterLink} to="/contacts">
            Contacts
          </Button>
          <Button color="inherit" component={RouterLink} to="/interactions">
            Interactions
          </Button>
          <Button color="inherit" component={RouterLink} to="/users">
            Users
          </Button>
          <Button color="inherit" component={RouterLink} to="/metrics">
            Metrics
          </Button>
          <Button
            color="inherit"
            onClick={handleSignOut}
            sx={{
              ml: 2,
              background: "#f44336",
              fontWeight: "bold",
              ":hover": {
                background: "red",
              },
            }}
          >
            Sign Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
