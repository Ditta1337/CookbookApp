import { useState, useEffect } from "react";
import { getRecipeData } from "./network";

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
      const recipeData = await getRecipeData(id);
      setRecipe(recipeData);
    }

    fetchRecipe();
  }, []);

  return recipe;
};
