import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import TwoColumns from "../components/TwoColumns";
import Step from "../components/Step";
import Ingredient from "../components/Ingredient";
import "./Recipe.css";
import { useRecipeData } from "../../utils/useRecipeData";
import UnitSelector from "../components/unit_selector/UnitSelector.jsx";
import { units } from "../components/unit_selector/units_mock.js";

const Recipe = () => {
    const { id } = useParams();
    const { title, description, steps, ingredients: initialIngredients } = useRecipeData(id);

    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        if (initialIngredients) {
            setIngredients(initialIngredients);
        }
    }, [initialIngredients]);

    const handleUnitChange = (index, newUnit) => {
        setIngredients((prev) =>
            prev.map((ing, i) =>
                i === index ? { ...ing, unit: newUnit } : ing
            )
        );
    };

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
                right={
                    steps.map((step, idx) => (
                        <Step key={idx} index={idx + 1} {...step} />
                    ))
                }
                leftSize={30}
            />
        </div>
    );
};

export default Recipe;
