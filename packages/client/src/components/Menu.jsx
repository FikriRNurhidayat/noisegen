import "./Menu.css";

function Menu({ title = "Noisegen", onSubmit = () => {} }) {
  return (
    <form className="Menu" onSubmit={onSubmit}>
      <div className="Menu--header">
        <h1 className="Menu--title">{title}</h1>
        <div className="Menu--subtitle">
          Noisegen will try to generate noises based on your request. Please
          input the amount of noise that you want to be generated. Maximum
          number is 500. Your memory will blow if you exceed that number.
        </div>
      </div>

      <div className="Menu--body">
        <div className="Menu--input">
          <label htmlFor="total">How many?</label>
          <input
            name="total"
            type="number"
            placeholder="69"
            min="0"
            max="1000"
            required
          />
        </div>

        <div className="Menu--submit">
          <input type="submit" value="Generate" />
        </div>
      </div>
    </form>
  );
}

export default Menu;
