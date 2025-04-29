import React from "react";
import "./TwoColumns.css";

// leftSize is the size of left panel in percent, the rest of the space is taken by right column
const TwoColumns = ({ left, right, leftSize }) => {
  leftSize ??= 30;

  return (
    <div className="two-columns">
      <div style={{ width: `${leftSize}%` }} className="left-column">
        {left}
      </div>
      <div style={{ width: `${100 - leftSize}%` }} className="right-column">
        {right}
      </div>
    </div>
  );
};

export default TwoColumns;
