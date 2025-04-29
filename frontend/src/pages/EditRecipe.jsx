import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { mockRecipeData } from "../../utils/network";

// probably the same as Recipe.tsx but things swapped to <input> and
// holding modified recipe data in useState
// which is sent to backend upon submitting the edits
const EditRecipe = () => {
  let { id } = useParams();

  const [recipe, setRecipe] = useState({
    title: "Loading",
    description: "Loading",
    steps: [],
    ingredients: [],
  });
  
  const { title, description, steps, ingredients } = recipe;

  useEffect(() => {
    async function fetchRecipe() {
      const recipeData = await mockRecipeData(id);
      setRecipe(recipeData);
    }

    fetchRecipe();
  }, []);

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
