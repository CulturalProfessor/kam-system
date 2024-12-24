import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RestaurantList from "./RestaurantList";
import RestaurantForm from "./utils/RestaurantForm";
import ContactList from "./ContactList";
import ContactForm from "./utils/ContactForm";
import Navbar from "./Navbar";
import InteractionList from "./InteractionList";
import InteractionForm from "./utils/InteractionForm";
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
        />{" "}
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

export default App;
