import { Link } from "react-router-dom";
import "./Noise.css";

function Noise({ src, href, onError = () => {} }) {
  return (
    <div className="Noise">
      <img src={src} alt="Noise" className="Noise--image" onError={onError} />
      <Link to={href} className="Noise--alt">
        Go to <br />
        Noise
      </Link>
    </div>
  );
}

export default Noise;
