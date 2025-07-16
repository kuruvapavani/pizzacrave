// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyCart from "./pages/MyCart";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import AdminDashboard from "./pages/AdminDashboard";
import UserProfile from "./pages/UserProfile";
import ManagePizzas from "./pages/ManagePizzas";
import ManageOrders from "./pages/ManageOrders";
import Checkout from "./pages/Checkout";
import VerifyEmail from "./pages/VerifyEmail";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-cart" element={<MyCart />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/my-orders/:id" element={<OrderDetails />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/my-profile" element={<UserProfile />} />
        <Route path="/admin/pizzas" element={<ManagePizzas />} />
        <Route path="/admin/orders" element={<ManageOrders />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </Router>
  );
}

export default App;
