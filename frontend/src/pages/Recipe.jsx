import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import TwoColumns from "../components/TwoColumns";
import Step from "../components/Step";
import Ingredient from "../components/Ingredient";
import { mockRecipeData } from "../../utils/network";

const Recipe = () => {
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
      <h1>
        Recipe #{id}. {title}
      </h1>
      <p>{description}</p>
      <TwoColumns
        left={
          <ul>
            {ingredients.map((ingredient, idx) => (
              <Ingredient key={idx} {...ingredient} />
            ))}
          </ul>
        }
        right={steps.map((step, idx) => (
          <Step key={idx} index={idx + 1} {...step} />
        ))}
        leftSize={30}
      />
    </div>
  );
};

export default Recipe;
