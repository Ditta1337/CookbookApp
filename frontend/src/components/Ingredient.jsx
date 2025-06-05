import React from "react";

const Ingredient = ({ name, quantity, unit }) => {
  return (
    <p>{name} - {quantity} {unit}</p>
  );
};

export default Ingredient;
