import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import NoiseGallery from "./pages/NoiseGallery";
import NoiseBatik from "./pages/NoiseBatik";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/noises",
    element: <NoiseGallery />,
  },
  {
    path: "/noises/:id",
    element: <NoiseBatik />,
  },
]);

export default router;
