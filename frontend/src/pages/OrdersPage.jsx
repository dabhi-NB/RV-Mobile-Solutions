// frontend/src/pages/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState("");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/orders/myorders", { headers: { Authorization: `Bearer ${token}` }});
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      setMsg("Unable to load orders");
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const cancelOrder = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(`/orders/${id}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` }});
      fetchOrders();
    } catch (err) {
      console.error(err);
      setMsg("Cancel failed");
    }
  };

  return (
    <div className="container mt-4 text-light">
      <h2>Your Orders</h2>
      {msg && <div className="alert bg-dark">{msg}</div>}
      {orders.length === 0 ? <p>No orders yet.</p> : (
        orders.map(o => (
          <div key={o._id} className="card bg-dark mb-3 p-3">
            <div className="d-flex justify-content-between">
              <div>
                <div className="fw-bold">Order #{o._id}</div>
                <div className="small ">{new Date(o.createdAt).toLocaleString()}</div>
                <div>Total: ₹{o.totalPrice}</div>
                <div>Status: {o.isDelivered ? "Delivered" : o.isPaid ? "Processing" : "Pending Payment"}</div>
              </div>
              <div className="text-end">
                <button className="btn btn-sm btn-danger" onClick={() => cancelOrder(o._id)}>Cancel</button>
              </div>
            </div>

            <div className="mt-2">
              {o.orderItems.map(it => (
                <div key={it._id || it.product} className="d-flex gap-2 align-items-center py-2 border-top">
                  <img src={it.image} alt="" style={{width:60, height:60, objectFit:"cover"}} />
                  <div>{it.name} <div className="small">Qty: {it.qty} | ₹{it.price}</div></div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
