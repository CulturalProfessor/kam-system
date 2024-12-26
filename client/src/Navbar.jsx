import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function Navbar() {
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
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
