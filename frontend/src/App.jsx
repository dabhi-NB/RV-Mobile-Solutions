// ...existing code...
import React,{useState} from "react";
import { Routes, Route } from "react-router-dom";
import api from "./api"; 
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./components/PrivateRoute";

import CategoryPage from "./pages/CategoryPage"
import ProductPage from "./pages/ProductPage"
import CheckoutPage from "./pages/CheckoutPage";
import Payment from "./pages/Payment";
import OrderSuccessPage from "./pages/OrderSuccessPage";

function App() {

    const [cartCount, setCartCount] = useState(0);

  const updateCartCount = async () => {
    try {
      const res = await api.get("/cart");
    setCartCount(res.data.length);
    } catch (err) {
      setCartCount(0);
    }
  };

  return (
    <>
     <Navbar cartCount={cartCount} updateCartCount={updateCartCount} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/category/:name" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductPage updateCartCount={updateCartCount}/>} />

        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage updateCartCount={updateCartCount}/>
            </PrivateRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <PrivateRoute>
              <Payment />
            </PrivateRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
  path="/order-success"
  element={
    <PrivateRoute>
      <OrderSuccessPage />
    </PrivateRoute>
  }
/>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
// ...existing code...