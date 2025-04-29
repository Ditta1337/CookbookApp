import React from "react";

const Ingredient = ({ name, quantity, unit }) => {
  return (
    <li>{name} - {quantity} {unit}</li>
  );
};

export default Ingredient;
