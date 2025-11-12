// frontend/src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  if (!product) return null;
  return (
    <div className="card h-100 shadow-sm bg-dark text-light border-0">
      <img
        src={product.image}
        alt={product.name}
        className="card-img-top"
        style={{ height: 200, objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <h6 className="card-title">{product.name}</h6>
        <div className="mb-2  small">{product.category}</div>
        <div className="mb-2 fw-bold">₹{product.price}</div>
        <div className="mt-auto">
          <Link to={`/product/${product._id}`} className="btn btn-sm btn-outline-light w-100">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
