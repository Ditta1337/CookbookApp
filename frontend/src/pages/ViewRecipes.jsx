import React from "react";
import Navbar from "../components/Navbar";

const ViewRecipes = () => {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {[1, 2, 3, 4, 5, 6, 7].map((recipeId) => (
          <a href={`/recipes/${recipeId}`}>Przepis o id {recipeId}</a>
        ))}
      </div>
    </div>
  );
};

export default ViewRecipes;
