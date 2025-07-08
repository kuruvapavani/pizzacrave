// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyCart from './pages/MyCart';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './pages/AdminDashboard';
function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/my-cart' element={<MyCart />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path='/my-orders/:id' element={<OrderDetails />} />
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
        </Routes>
    </Router>
  );
}

export default App;
