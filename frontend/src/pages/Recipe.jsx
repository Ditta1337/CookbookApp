import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TwoColumns from "../components/TwoColumns";
import Step from "../components/Step";
import Ingredient from "../components/Ingredient";
import Tag from "../components/Tag";
import UnitSelector from "../components/unit_selector/UnitSelector.jsx";
import { units } from "../components/unit_selector/units_mock.js";
import "./Recipe.css";

const Recipe = () => {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); 

const handleDelete = async () => {
  if (!window.confirm("Czy na pewno chcesz usunąć ten przepis?")) return;

  try {
    const response = await fetch(`http://localhost:8000/recipes/delete/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Nie udało się usunąć przepisu.");
    }

    navigate("/"); // przekierowanie po usunięciu
  } catch (err) {
    alert(`Błąd: ${err.message}`);
  }
};

  const fetchRecipeData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/recipes/${id}`);
      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }

      const data = await response.json();
      setRecipe(data);
      setIngredients(data.ingredients || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipeData();
  }, [id]);

  const handleUnitChange = (index, newUnit) => {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, unit: newUnit } : ing))
    );
  };

  if (loading) {
    return <div>Ładowanie przepisu...</div>;
  }

  if (error) {
    return <div>Błąd: {error}</div>;
  }

  if (!recipe) {
    return <div>Nie znaleziono przepisu.</div>;
  }

  const { title, description, tags, steps } = recipe;

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
          <a href={`/public/recipes/${id}/edit`}>Edytuj przepis</a>
        </div>
        <button className="delete-button" onClick={handleDelete}>
          &minus;
        </button>
      </div>
      <TwoColumns
        left={
          <ul>
            {ingredients.map((ingredient, idx) => (
              <li key={idx} className="ingredient-item">
                <Ingredient {...ingredient} />
                <UnitSelector
                  units={units}
                  selectedUnit={ingredient.unit}
                  setUnit={handleUnitChange}
                  index={idx}
                />
              </li>
            ))}
          </ul>
        }
        right={steps.map((step, idx) => (
          <Step key={idx} index={idx + 1} description={step.description} {...step} />
        ))}
        leftSize={30}
      />
    </div>
  );
};

export default Recipe;
