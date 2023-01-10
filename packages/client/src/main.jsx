import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { NoiseProvider } from "./contexts/NoiseContext";
import router from "./router";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NoiseProvider>
      <RouterProvider router={router} />
    </NoiseProvider>
  </React.StrictMode>
);
