import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import RestaurantList from "./components/RestaurantList";
import RestaurantForm from "./components/RestaurantForm";
import ContactList from "./components/ContactList";
import ContactForm from "./components/ContactForm";
import Navbar from "./components/Navbar";
import InteractionList from "./components/InteractionList";
import InteractionForm from "./components/InteractionForm";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserProvider from "./hooks/userProvider";
import { ThemeContextProvider } from "./hooks/themeProvider";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";
import Metrics from "./components/Metric";
import { CssBaseline } from "@mui/material";

function App() {
  return (
    <ThemeContextProvider>
      <CssBaseline />
      <UserProvider>
        <Router>
          <ConditionalNavbar />
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/restaurants" element={<RestaurantList />} />
            <Route
              path="/restaurants/new"
              element={<RestaurantForm isEdit={false} />}
            />
            <Route
              path="/restaurants/edit/:id"
              element={<RestaurantForm isEdit={true} />}
            />
            <Route path="/contacts" element={<ContactList />} />
            <Route
              path="/contacts/new"
              element={<ContactForm isEdit={false} />}
            />
            <Route
              path="/contacts/edit/:id"
              element={<ContactForm isEdit={true} />}
            />
            <Route path="/interactions" element={<InteractionList />} />
            <Route
              path="/interactions/new"
              element={<InteractionForm isEdit={false} />}
            />
            <Route
              path="/interactions/edit/:id"
              element={<InteractionForm isEdit={true} />}
            />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/new" element={<UserForm isEdit={false} />} />
            <Route
              path="/users/edit/:id"
              element={<UserForm isEdit={true} />}
            />
            <Route path="/metrics" element={<Metrics />} />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeContextProvider>
  );
}

function ConditionalNavbar() {
  const location = useLocation();
  const hideNavbarRoutes = ["/", "/login"];
  return hideNavbarRoutes.includes(location.pathname) ? null : <Navbar />;
}

export default App;
