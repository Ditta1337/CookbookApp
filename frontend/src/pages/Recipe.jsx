import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import TwoColumns from "../components/TwoColumns";
import Step from "../components/Step";
import Ingredient from "../components/Ingredient";
import "./Recipe.css";
import { useRecipeData } from "../../utils/useRecipeData";
import Tag from "../components/Tag";

const Recipe = () => {
  let { id } = useParams();

  const { title, description, tags, steps, ingredients } = useRecipeData(id);

  return (
    <div>
      <Navbar />
      <div className="recipe-header">
        <div className="tag-list">
          {tags.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </div>
        <div className="recipe-info">
          <h1>
            Przepis #{id}. {title}
          </h1>
          <p>{description}</p>
        </div>
        <div className="edit-button">
          <a href={`/recipes/${id}/edit`}>Edytuj przepis</a>
        </div>
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
