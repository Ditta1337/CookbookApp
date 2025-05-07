import { useState, useEffect } from "react";
import { mockRecipeData } from "./network";

export const useRecipeData = (id) => {
  const [recipe, setRecipe] = useState({
    title: "Loading",
    description: "Loading",
    steps: [],
    ingredients: [],
    tags: null,
  });

  useEffect(() => {
    async function fetchRecipe() {
      const recipeData = await mockRecipeData(id);
      setRecipe(recipeData);
    }

    fetchRecipe();
  }, []);

  return recipe;
};
