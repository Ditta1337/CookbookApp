import { useState, useEffect } from "react";
import { mockRecipeData } from "./network";

export const useRecipeData = (id) => {
  const [recipe, setRecipe] = useState({
    title: "Ładowanie",
    description: "Ładowanie",
    tags: [],
    steps: [],
    ingredients: [],
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
