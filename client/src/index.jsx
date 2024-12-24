import { Routes, Route } from "react-router-dom";
import RestaurantList from "./RestaurantList";
import AddRestaurant from "./AddRestaurant";
import UpdateRestaurant from "./UpdateRestaurant";
// import "./index.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<RestaurantList />} />
      <Route path="/new" element={<AddRestaurant />} />
      <Route path="/update/:id" element={<UpdateRestaurant />} />
    </Routes>
  );
}

export default App;
