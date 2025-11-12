import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data);

        // Clear cart after successful order
        try {
          await api.post("/cart/clear");
        } catch (e) {
          console.warn("Cart clear failed:", e);
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-60">
        <div className="spinner-border text-light"></div>
      </div>
    );

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-7">
          <div className="card bg-dark text-light shadow-sm">
            <div className="card-body p-4 text-center">
              <div className="mb-3">
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-success"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>

              <h4 className="mb-2">Order Placed Successfully! 🎉</h4>
              <p className="text-light-50 mb-3">Your order has been confirmed and will be processed soon.</p>

              {order && (
                <div className="text-start">
                  <div className="card bg-black p-3 mb-3">
                    <h6 className="text-light mb-2">Order Details</h6>

                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-light-50">Order ID</span>
                      <span className="text-light fw-bold">{order._id || orderId}</span>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-light-50">Date</span>
                      <span className="text-light">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-light-50">Status</span>
                      <span className="badge bg-info">{order.status || "Pending"}</span>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-light-50">Payment</span>
                      <span className="badge bg-success">{order.paymentMethod === "online" ? "Online" : "COD"}</span>
                    </div>
                  </div>

                  <h6 className="text-light mb-2">Items</h6>
                  <div className="mb-3">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="d-flex justify-content-between small mb-2">
                        <div>
                          <div className="text-light">{item.name}</div>
                          <div className="text-light-50">Qty: {item.quantity}</div>
                        </div>
                        <div className="text-light fw-bold">₹{(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="card bg-black p-3">
                    <h6 className="text-light mb-2">Delivery Address</h6>
                    <div className="small text-light">
                      <div>{order.address?.fullname}</div>
                      <div>{order.address?.addressLine}</div>
                      <div>
                        {order.address?.city} - {order.address?.postalCode}
                      </div>
                      <div>Ph: {order.address?.phone}</div>
                    </div>
                  </div>

                  <div className="mt-3 border-top pt-3">
                    <div className="d-flex justify-content-between fw-bold text-light mb-3">
                      <span>Total Amount</span>
                      <span>₹{order.total?.toFixed(2) || "0.00"}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="d-grid gap-2 mt-4">
                <button className="btn btn-success" onClick={() => navigate("/orders")}>
                  View All Orders
                </button>
                <button className="btn btn-outline-light" onClick={() => navigate("/shop")}>
                  Continue Shopping
                </button>
              </div>

              <div className="mt-3 small text-light-50">
                You will receive an email confirmation shortly. Your order will be shipped within 1-2 business days.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}