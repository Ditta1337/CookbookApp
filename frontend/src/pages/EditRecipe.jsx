import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useRecipeData } from "../../utils/useRecipeData";

// probably the same as Recipe.tsx but things swapped to <input> and
// holding modified recipe data in useState
// which is sent to backend upon submitting the edits
const EditRecipe = () => {
  let { id } = useParams();

  const { title, description, steps, ingredients } = useRecipeData(id);

  return (
    <div>
      <Navbar />
      <div>
        <h1>Edit Recipe</h1>
      </div>
    </div>
  );
};

export default EditRecipe;
