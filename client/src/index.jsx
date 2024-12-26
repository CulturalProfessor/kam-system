import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import RestaurantList from "./RestaurantList";
import RestaurantForm from "./utils/RestaurantForm";
import ContactList from "./ContactList";
import ContactForm from "./utils/ContactForm";
import Navbar from "./Navbar";
import InteractionList from "./InteractionList";
import InteractionForm from "./utils/InteractionForm";
import Register from "./Register";
import Login from "./Login";

function App() {
  return (
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
        <Route path="/contacts/new" element={<ContactForm isEdit={false} />} />
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
      </Routes>
    </Router>
  );
}

function ConditionalNavbar() {
  const location = useLocation();

  const hideNavbarRoutes = ["/", "/login"];
  if (hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  return <Navbar />;
}

export default App;
