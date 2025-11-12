// ...existing code...
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function CartPage({ updateCartCount }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get("/cart");
      setCart(res.data || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setMsg("Failed to load cart. Try again later.");
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateQty = async (id, newQty) => {
    if (newQty < 1) return;
    try {
      await api.put(`/cart/${id}`, { qty: newQty });
      await fetchCart();
      if (updateCartCount) updateCartCount();
    } catch (err) {
      console.error("Error updating qty:", err);
      alert("Server error updating quantity.");
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm("Remove this item from cart?")) return;
    try {
      await api.delete(`/cart/${id}`);
      await fetchCart();
      if (updateCartCount) updateCartCount();
    } catch (err) {
      console.error("Error removing item:", err);
      alert("Server error removing item.");
    }
  };

  // Navigate to CheckoutPage when user clicks proceed
  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (!user)
    return (
      <div className="container py-5 text-center">
        <div className="card bg-dark text-light p-4 mx-auto" style={{ maxWidth: 640 }}>
          <h4 className="mb-2">Login to view your cart</h4>
          <p className="text-light-50 mb-3">Sign in to manage items and proceed to checkout.</p>
          <div>
            <button className="btn btn-outline-light me-2" onClick={() => navigate("/login")}>Login</button>
            <button className="btn btn-light text-dark" onClick={() => navigate("/register")}>Register</button>
          </div>
        </div>
      </div>
    );

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-60">
        <div className="spinner-border text-light" role="status" aria-hidden="true"></div>
        <span className="ms-3 text-light">Loading your cart...</span>
      </div>
    );

  const total = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-light rounded-pill" onClick={() => navigate(-1)}>← Continue shopping</button>
        <h3 className="text-light mb-0">Your Cart</h3>
      </div>

      {msg && <div className="alert alert-warning">{msg}</div>}

      {cart.length === 0 ? (
        <div className="text-center py-5">
          <div className="card bg-dark text-light border-0 py-5">
            <h4 className="mb-2">Your cart is empty</h4>
            <p className="text-light-50 mb-3">Add accessories to your cart and they'll appear here.</p>
            <button className="btn btn-primary" onClick={() => navigate("/shop")}>Shop Now</button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            {cart.map((item) => {
              const price = item.product?.price || 0;
              const qty = item.quantity || 0;
              const stock = typeof item.product?.stock === "number" ? item.product.stock : 999;
              const subtotal = price * qty;
              const outOfStock = stock === 0;
              const lowStock = stock > 0 && stock <= 5;
              const canIncrease = qty < stock;

              return (
                <div key={item._id} className="card mb-3 shadow-sm bg-dark text-light">
                  <div className="row g-0 align-items-center">
                    <div className="col-auto p-3">
                      <img
                        src={item.product?.image || "/placeholder.png"}
                        alt={item.product?.name || "product"}
                        onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                        style={{ width: 110, height: 110, objectFit: "cover", borderRadius: 8 }}
                      />
                    </div>

                    <div className="col">
                      <div className="card-body py-3">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h6 className="mb-1 text-light">{item.product?.name}</h6>
                          </div>

                          <div className="text-end">
                            <div className="fw-bold text-light">₹{price.toFixed(2)}</div>
                            <button
                              className="btn btn-sm btn-link text-danger p-0 mt-2"
                              onClick={() => removeItem(item._id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="d-flex flex-wrap align-items-center justify-content-between mt-3">
                          <div className="d-flex align-items-center">
                            <div className="input-group input-group-sm" style={{ width: 140 }}>
                              <button
                                className="btn btn-outline-light"
                                onClick={() => updateQty(item._id, Math.max(qty - 1, 1))}
                                aria-label="Decrease quantity"
                                disabled={qty <= 1}
                              >
                                −
                              </button>
                              <input
                                type="text"
                                readOnly
                                className="form-control text-center bg-dark text-light border-secondary"
                                value={qty}
                                aria-label="Quantity"
                              />
                              <button
                                className="btn btn-outline-light"
                                onClick={() => canIncrease && updateQty(item._id, qty + 1)}
                                aria-label="Increase quantity"
                                disabled={!canIncrease || outOfStock}
                              >
                                +
                              </button>
                            </div>

                            <div className="ms-3">
                              {outOfStock ? (
                                <span className="badge bg-danger">Out of stock</span>
                              ) : lowStock ? (
                                <span className="badge bg-warning text-dark">Only {stock} left</span>
                              ) : (
                                <span className="badge bg-success">In stock</span>
                              )}
                            </div>
                          </div>

                          <div className="text-end">
                            <div className="small text-light-50">Item total</div>
                            <div className="fw-bold text-light">₹{subtotal.toFixed(2)}</div>
                            <div className="small text-light-50 mt-1">({price.toFixed(2)} × {qty})</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="col-12 col-lg-4">
            <div className="card p-3 shadow-sm bg-dark text-light sticky-top" style={{ top: "1rem" }}>
              <h5 className="mb-3 text-light">Order Summary</h5>

              <div className="d-flex justify-content-between mb-2">
                <div className="text-light-50 small">Items ({cart.length})</div>
                <div className="fw-semibold text-light">₹{total.toFixed(2)}</div>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <div className="text-light-50 small">Shipping</div>
                <div className="text-light-50 small">Calculated at checkout</div>
              </div>

              <hr className="border-secondary" />

              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong className="text-light">Total</strong>
                <strong className="text-light">₹{total.toFixed(2)}</strong>
              </div>

              <div className="d-grid">
                <button
                  className="btn btn-success mb-2"
                  onClick={handleCheckout}
                  // disable checkout if any item out of stock
                  disabled={cart.some((i) => (typeof i.product?.stock === "number" ? i.product.stock === 0 : false))}
                >
                  Proceed to Checkout
                </button>
              </div>

              <div className="mt-3 small text-light-50">
                Secure checkout • Easy returns • 24/7 support
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ...existing code...