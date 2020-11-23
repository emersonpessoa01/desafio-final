import React from "react";
import M from "materialize-css";
import PERIODS from "./helpers/period.js";

export default function App() {
  const [currentPeriod, setCurrentPeriod] = React.useState(PERIODS[0]);
  const [transaction, setTransaction] = React.useState([]);

  React.useEffect(() => {
    M.AutoInit();
  }, []);

  return (
    <div className="container">
      <h1 className="center">React Select</h1>

      <select>
        {PERIODS.map((period) => {
          return <option value={period}>key={period}></option>;
        })}
        <option>A</option>
        <option>B</option>
        <option>C</option>
        <option>D</option>
        <option>E</option>
      </select>
    </div>
  );
}
