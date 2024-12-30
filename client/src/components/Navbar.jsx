import { AppBar, Toolbar, Typography, Button, Box, IconButton } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useThemeContext } from "../hooks/useTheme";
import { Brightness4, Brightness7 } from "@mui/icons-material";

function Navbar() {
  const navigate = useNavigate();
  const { logout } = useUser();
  const { mode, toggleTheme } = useThemeContext();

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
          <IconButton
            sx={{ ml: 1 }}
            onClick={toggleTheme}
            color="inherit"
          >
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
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
