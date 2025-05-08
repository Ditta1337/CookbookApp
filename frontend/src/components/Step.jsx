import React from "react";

const Step = ({ index, title, description }) => {
  return (
    <div>
      <h2>
        Krok {index}. {title}
      </h2>
      <p>{description}</p>
    </div>
  );
};

export default Step;
