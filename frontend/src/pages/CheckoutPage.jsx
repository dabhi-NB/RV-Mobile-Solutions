// ...existing code...
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState({
    fullname: "",
    phone: "",
    addressLine: "",
    city: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" or "online"
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u) {
      navigate("/login");
      return;
    }
    setUser(u);
    // prefill contact if available
    setAddress((s) => ({
      ...s,
      fullname: u.name || s.fullname,
      phone: u.phone || s.phone,
    }));

    const loadCart = async () => {
      try {
        const res = await api.get("/cart");
        setCart(res.data || []);
      } catch (err) {
        console.error("Failed to load cart:", err);
        setMsg("Failed to load cart. Please try again.");
      }
    };

    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const subtotal = cart.reduce(
    (acc, it) => acc + (it.product?.price || 0) * (it.quantity || 0),
    0
  );

  // simple shipping & tax rules (adjust per your business logic)
  const shipping = subtotal === 0 ? 0 : subtotal < 500 ? 50 : 0;
  const taxRate = 0.18; // 18%
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const discount = 0;
  const total = Math.round((subtotal + shipping + tax - discount) * 100) / 100;

  const handleChange = (e) =>
    setAddress((s) => ({ ...s, [e.target.name]: e.target.value }));

  const validateAddress = () => {
    if (!address.fullname.trim()) return "Full name required";
    if (!address.phone.trim()) return "Phone required";
    if (!address.addressLine.trim()) return "Address required";
    if (!address.city.trim()) return "City required";
    if (!address.postalCode.trim()) return "Postal code required";
    return null;
  };

  const placeOrder = async (e) => {
    e?.preventDefault();
    setMsg("");
    if (!cart || cart.length === 0) {
      setMsg("Your cart is empty.");
      return;
    }

    const err = validateAddress();
    if (err) {
      setMsg(err);
      return;
    }

    const orderPayload = {
      userId: user.id || user._id || user.email,
      address,
      paymentMethod,
      items: cart.map((it) => ({
        productId: it.product?._id,
        name: it.product?.name,
        price: it.product?.price || 0,
        quantity: it.quantity || 0,
      })),
      subtotal: Math.round(subtotal * 100) / 100,
      shipping,
      tax,
      discount,
      total,
    };

    try {
      setLoading(true);

      if (paymentMethod === "online") {
        // navigate to payment page with order summary
        navigate("/payment", {
          state: {
            order: {
              id: `ORD-${Date.now()}`,
              amount: Math.round(total),
              ...orderPayload,
            },
          },
        });
        return;
      }

      // Cash on delivery: create order on server
      const res = await api.post("/orders", orderPayload);
      const orderId = res.data?.id || res.data?._id || null;

      // Clear cart on server (optional)
      try {
        await api.post("/cart/clear");
      } catch (e) {
        // ignore clear errors
      }

      setLoading(false);
      navigate("/order-success", { state: { orderId } });
    } catch (error) {
      console.error("Place order failed:", error);
      setMsg("Failed to place order. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card bg-dark text-light p-3 shadow-sm">
            <h5 className="mb-3 text-light">Delivery Address</h5>

            {msg && (
              <div className="alert alert-warning">
                <span className="text-dark">{msg}</span>
              </div>
            )}

            <form onSubmit={placeOrder} className="row g-2">
              <div className="col-12">
                <label className="form-label small text-light">Full name</label>
                <input
                  name="fullname"
                  value={address.fullname}
                  onChange={handleChange}
                  className="form-control form-control-sm bg-black text-light"
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small text-light">Phone</label>
                <input
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  className="form-control form-control-sm bg-black text-light"
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label small text-light">Postal code</label>
                <input
                  name="postalCode"
                  value={address.postalCode}
                  onChange={handleChange}
                  className="form-control form-control-sm bg-black text-light"
                />
              </div>

              <div className="col-12">
                <label className="form-label small text-light">Address</label>
                <input
                  name="addressLine"
                  value={address.addressLine}
                  onChange={handleChange}
                  className="form-control form-control-sm bg-black text-light"
                />
              </div>

              <div className="col-12">
                <label className="form-label small text-light">City</label>
                <input
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  className="form-control form-control-sm bg-black text-light"
                />
              </div>

              <div className="col-12 mt-3">
                <h6 className="mb-2 text-light">Payment method</h6>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="pm"
                    id="pm-cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <label className="form-check-label text-light" htmlFor="pm-cod">
                    Cash on delivery
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="pm"
                    id="pm-online"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                  />
                  <label className="form-check-label text-light" htmlFor="pm-online">
                    Pay online
                  </label>
                </div>
              </div>

              <div className="col-12 mt-3 d-flex gap-2">
                <button type="submit" className="btn btn-success" disabled={loading}>
                  {loading ? "Processing..." : paymentMethod === "online" ? "Proceed to Payment" : "Place Order (COD)"}
                </button>
                <button type="button" className="btn btn-outline-light" onClick={() => navigate("/cart")}>
                  Back to cart
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card bg-dark text-light p-3 shadow-sm sticky-top" style={{ top: "1rem" }}>
            <h5 className="mb-2 text-light">Order Info</h5>

            <div className="small mb-3">
              <div className="d-flex justify-content-between">
                <span>Order ID</span>
                <span className="text-light">CART-{Date.now()}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Customer</span>
                <span className="text-light">{user?.email || user?.name || "-"}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Items</span>
                <span className="text-light">{cart.length}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Estimated delivery</span>
                <span className="text-light">3-7 business days</span>
              </div>
            </div>

            <hr className="border-secondary" />

            <h6 className="mb-2 text-light">Items</h6>
            <div className="mb-3" style={{ maxHeight: 220, overflowY: "auto" }}>
              {cart.map((it) => (
                <div key={it._id} className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <div className="fw-medium text-light">{it.product?.name}</div>
                    <div className="small text-light">Qty: {it.quantity}</div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold text-light">₹{((it.product?.price || 0) * it.quantity).toFixed(2)}</div>
                    <div className="small text-light">({(it.product?.price || 0).toFixed(2)} × {it.quantity})</div>
                  </div>
                </div>
              ))}
            </div>

            <hr className="border-secondary" />

            <div className="d-flex justify-content-between mb-1">
              <div className="text-light">Subtotal</div>
              <div className="text-light">₹{subtotal.toFixed(2)}</div>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <div className="text-light">Shipping</div>
              <div className="text-light">₹{shipping.toFixed(2)}</div>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <div className="text-light">Tax ({Math.round(taxRate * 100)}%)</div>
              <div className="text-light">₹{tax.toFixed(2)}</div>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <div className="text-light">Discount</div>
              <div className="text-light">- ₹{discount.toFixed(2)}</div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="fw-semibold text-light">Total</div>
              <div className="fw-bold text-light">₹{total.toFixed(2)}</div>
            </div>

            <div className="small text-light">Shipping and taxes calculated at checkout. You can change address or payment above.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
// ...existing code...