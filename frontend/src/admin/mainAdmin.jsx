import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppAdmin from "./AppAdmin";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

ReactDOM.createRoot(document.getElementById("admin-root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppAdmin />
    </BrowserRouter>
  </React.StrictMode>
);
