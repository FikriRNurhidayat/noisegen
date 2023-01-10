import "./Loading.css";

function Loading({ label = "Loading", value = 0, max = 100 }) {
  return (
    <div className="Loading">
      <label className="Loading--label">{label}...</label>
      <progress value={value} max={max} className="Loading--progress">
        {value} %
      </progress>
      <div className="Loading--percentage">
        {Math.floor((value / max) * 100)}%
      </div>
    </div>
  );
}

export default Loading;
