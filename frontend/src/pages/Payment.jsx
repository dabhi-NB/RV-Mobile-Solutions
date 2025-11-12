import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order || {
    id: `ORD-${Date.now()}`,
    amount: 0,
    items: [],
  };

  const [email, setEmail] = useState(order.email || "");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatus({ ok: false, message: "Email required" });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      // Step 1: Create order on backend
      const orderRes = await api.post("/payments/create-order", {
        amount: order.amount * 100, // Razorpay expects paise
        currency: "INR",
        receipt: order.id,
      });

      const razorpayOrderId = orderRes.data.id;

      // Step 2: Open Razorpay checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_XXXXXX", // Set in .env
        amount: order.amount * 100,
        currency: "INR",
        name: "Daksh Mobile Accessories",
        description: `Order ${order.id}`,
        order_id: razorpayOrderId,
        handler: async (response) => {
          // Step 3: Verify payment on backend
          try {
            const verifyRes = await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order.id,
              email,
              orderDetails: order,
            });

            if (verifyRes.data.success) {
              setLoading(false);
              setStatus({ ok: true, message: "Payment successful!" });

              // Navigate to order success after 1s
              setTimeout(() => {
                navigate("/order-success", { state: { orderId: order.id } });
              }, 1000);
            } else {
              setLoading(false);
              setStatus({ ok: false, message: "Payment verification failed" });
            }
          } catch (err) {
            console.error("Verification error:", err);
            setLoading(false);
            setStatus({ ok: false, message: "Payment verification failed" });
          }
        },
        prefill: {
          email,
          contact: order.address?.phone || "",
        },
        theme: { color: "#000" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);
    } catch (err) {
      console.error("Order creation failed:", err);
      setLoading(false);
      setStatus({ ok: false, message: "Failed to initiate payment" });
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card bg-dark text-light shadow-sm">
            <div className="card-body p-4">
              <h5 className="card-title mb-3">Online Payment</h5>

              <div className="mb-3 small text-light-50">
                Order: <strong className="text-light">{order.id}</strong> • Amount:{" "}
                <strong className="text-light">₹{order.amount}</strong>
              </div>

              <form onSubmit={handlePay} aria-label="Payment form">
                <div className="mb-3">
                  <label className="form-label small text-light">Email</label>
                  <input
                    type="email"
                    className="form-control form-control-sm bg-black text-light"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {status && (
                  <div className={`alert ${status.ok ? "alert-success" : "alert-danger"} py-2 small`}>
                    {status.message}
                  </div>
                )}

                <div className="d-flex justify-content-between align-items-center">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing...
                      </>
                    ) : (
                      `Pay ₹${order.amount} with Razorpay`
                    )}
                  </button>

                  <button type="button" className="btn btn-link text-light" onClick={() => navigate(-1)}>
                    Back
                  </button>
                </div>
              </form>

              <div className="mt-3 small text-light-50">
                Secured by Razorpay • Your payment is encrypted and safe
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}