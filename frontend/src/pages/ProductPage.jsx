import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function ProductPage({ updateCartCount }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  const addToCart = async () => {
    if (loading) return; // avoid double-click spam
    setLoading(true);

    try {
      const res = await api.post("/cart", { productId: product._id, qty });
      setMsg(`🛒 Added ${qty} item(s)! Total now in cart.`);
     if (updateCartCount) updateCartCount();
// ✅ refresh navbar cart count
    } catch (err) {
      console.log(err);
      if (err.response && err.response.status === 401) {
        const confirmAction = window.confirm(
          "You need to log in to add items to cart.\n\nGo to cart page?"
        );
        if (confirmAction) navigate("/cart");
      } else {
        setMsg("❌ Server error adding to cart");
      }
    }

    setLoading(false);
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container text-light mt-4">
      {/* ✅ Back Button */}
      <button className="btn btn-outline-light mb-3" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="row">
        <div className="col-md-6">
          <img src={product.image} className="img-fluid rounded" alt={product.name} />
        </div>

        <div className="col-md-6">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <h4>₹{product.price}</h4>

          {/* ✅ Quantity Counter */}
          <div className="d-flex align-items-center mt-3">
            <button
              className="btn btn-outline-light me-2"
              onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
            >
              -
            </button>
            <span className="fs-5">{qty}</span>
            <button
              className="btn btn-outline-light ms-2"
              onClick={() => setQty(qty + 1)}
            >
              +
            </button>
          </div>

          <button
            className="btn btn-success mt-3 px-4"
            onClick={addToCart}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add to Cart"}
          </button>

          

          {msg && <p className="mt-3">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
