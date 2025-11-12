// HomePage.jsx

import React, { useEffect, useState } from "react";
import api from "../api";
import ProductCard from "../components/ProductCard.jsx";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get("/products");
        const data = Array.isArray(res.data) ? res.data : [];
        setAllProducts(data);

        const cats = [
          ...new Set(
            data
              .map((p) => typeof p.category === "string" ? p.category.trim() : "Others")
              .filter((cat) => !!cat)
          ),
        ];
        setCategories(cats);

        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setRandomProducts(shuffled.slice(0, 8));
      } catch (err) {
        console.error("Home fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading)
    return <div className="text-center text-light mt-5">Loading products...</div>;

  const categoryImage = (cat) => {
    const p = allProducts.find(
      (x) => x.category &&
        x.category.trim().toLowerCase() === cat.trim().toLowerCase()
        && x.image
    );
    return p
      ? p.image
      : `https://via.placeholder.com/800x300?text=${encodeURIComponent(cat)}`;
  };

  const handleCategoryClick = (cat) => {
    if (!cat || typeof cat !== "string") return;
    navigate(`/category/${encodeURIComponent(cat.trim())}`);
  };

  return (
    <div className="container py-4 text-light">
      {/* Carousel */}
      <div id="mainCarousel" className="carousel slide mb-4 rounded" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="2"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://picsum.photos/1200/420?random=11"
              className="d-block w-100"
              alt="ad1"
              style={{ height: 420, objectFit: "cover" }}
            />
            <div className="carousel-caption d-none d-md-block">
              <h3>Latest Gadgets</h3>
              <p>Top deals on chargers, earphones & accessories.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="https://picsum.photos/1200/420?random=12"
              className="d-block w-100"
              alt="ad2"
              style={{ height: 420, objectFit: "cover" }}
            />
            <div className="carousel-caption d-none d-md-block">
              <h3>Power Banks & Chargers</h3>
              <p>Fast charging accessories — tested & trusted.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="https://picsum.photos/1200/420?random=13"
              className="d-block w-100"
              alt="ad3"
              style={{ height: 420, objectFit: "cover" }}
            />
            <div className="carousel-caption d-none d-md-block">
              <h3>Audio Collection</h3>
              <p>Earbuds, speakers, headphones — top brands.</p>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* Category Grid */}
      <h5 className="mb-3">Shop by Category</h5>
      <div className="row mb-5">
        {categories.map((cat) => (
          <div className="col-6 col-md-3 mb-3" key={cat}>
            <div
              className="card h-100 bg-dark text-light hover-shadow"
              style={{ cursor: "pointer" }}
              onClick={() => handleCategoryClick(cat)}
            >
              <img
                src={categoryImage(cat)}
                alt={cat}
                className="card-img-top"
                style={{ height: 120, objectFit: "cover" }}
              />
              <div className="card-body py-2 text-center">
                <strong>{cat}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Random Products */}
      <h5 className="mb-3">Recommended For You</h5>
      <div className="row g-4">
        {randomProducts.map((p) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={p._id || p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
