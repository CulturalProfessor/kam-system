import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RestaurantList from "./RestaurantList";
import RestaurantForm from "./RestaurantForm";
import ContactList from "./ContactList";
import ContactForm from "./ContactForm";
import Navbar from "./Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<RestaurantList />} />
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
      </Routes>
    </Router>
  );
}

export default App;
