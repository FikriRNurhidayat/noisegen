import BlankLayout from "../layouts/BlankLayout";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./NoiseBatik.css";

export default function NoiseBatik() {
  const { id } = useParams();
  const navigate = useNavigate();
  const blobURL = `blob:${window.location.origin}/` + id;

  const onError = () => navigate("/");

  const style = {
    backgroundImage: `url(${blobURL})`,
  };

  return (
    <BlankLayout style={style} className="NoiseBatik">
      <div className="NoiseBatik--header">
        <h1 className="NoiseBatik--title">{id}</h1>
        <div className="NoiseBatik--subtitle">
          Generated noise, and displayed as tile. Just like Batik.
        </div>
        <nav className="NoiseBatik--navigation">
          <Link to="/noises">Go to Noise Gallery</Link>
        </nav>
      </div>
      <img
        src={blobURL}
        alt="Noise"
        onError={onError}
        className="NoiseBatik--image"
      />
    </BlankLayout>
  );
}
