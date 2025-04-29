import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import TwoColumns from "../components/TwoColumns";
import Step from "../components/Step";
import Ingredient from "../components/Ingredient";
import "./Recipe.css";
import { useRecipeData } from "../../utils/useRecipeData";

const Recipe = () => {
  let { id } = useParams();

  const { title, description, steps, ingredients } = useRecipeData(id);

  return (
    <div>
      <Navbar />
      <h1>
        Recipe #{id}. {title}
      </h1>
      <p>{description}</p>
      <div className="edit-button">
        <a href={`/recipes/${id}/edit`}>Edytuj przepis</a>
      </div>
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
