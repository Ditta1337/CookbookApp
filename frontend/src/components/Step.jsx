import React from "react";

const Step = ({ index, description }) => {
  return (
    <div>
      <h2>
        Krok {index}.
      </h2>
      <p>{description}</p>
    </div>
  );
};

export default Step;
