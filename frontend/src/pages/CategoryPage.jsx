import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard.jsx";

export default function CategoryPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/products");
        const data = Array.isArray(res.data) ? res.data : [];

        // ✅ Decode and normalize category name
        const categoryName = decodeURIComponent(name || "").trim().toLowerCase();
        const filtered = data.filter(
          (p) => (p.category || "").trim().toLowerCase() === categoryName
        );
        setProducts(filtered);
      } catch (err) {
        console.error("Category fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [name]);

  if (loading)
    return <div className="text-center text-light mt-5">Loading products...</div>;

  return (
    <div className="container py-4 text-light">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline-light mb-3 rounded-pill px-3"
      >
        ← Back
      </button>

      <h3 className="mb-4 text-capitalize">{decodeURIComponent(name)}</h3>

      {products.length === 0 ? (
        <div className="text-center mt-5 ">No products found.</div>
      ) : (
        <div className="row g-4">
          {products.map((p) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={p._id || p.id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
