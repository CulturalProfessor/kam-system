import { Routes, Route } from "react-router-dom";
import RestaurantList from "./RestaurantList";
import NewRestaurant from "./NewRestaurant";
import './index.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<RestaurantList />} />
      <Route path="/new" element={<NewRestaurant />} />
    </Routes>
  );
}

export default App;
