import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar";
import TwoColumns from "../components/TwoColumns";
import Step from "../components/Step";
import Ingredient from "../components/Ingredient";
import Tag from "../components/Tag";
import UnitSelector from "../components/unit_selector/UnitSelector.jsx";

import "./Recipe.css";

const Recipe = () => {
    const {id} = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRecipeData = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/recipes/${id}`);
            if (!res.ok) {
                throw new Error(`Błąd serwera: ${res.status}`);
            }
            const data = await res.json();
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

    const handleDelete = async () => {
        if (!window.confirm("Czy na pewno chcesz usunąć ten przepis?")) return;
        try {
            const res = await fetch(
                `http://localhost:8000/api/recipes/delete/${id}`,
                {method: "DELETE"}
            );
            if (!res.ok) {
                throw new Error("Nie udało się usunąć przepisu.");
            }
            navigate("/");
        } catch (err) {
            alert(`Błąd: ${err.message}`);
        }
    };

    const handleUnitChange = async (index, {oldUnitId, newUnitId, newUnitName}) => {
        const ing = ingredients[index];
        if (!ing) return;

        const ingredientId = ing.id;
        if (oldUnitId == null) {
            alert(
                `Nie mogliśmy zlokalizować starej jednostki "${ing.unit}". Spróbuj jeszcze raz.`
            );
            return;
        }

        try {
            const res = await fetch(
                `http://localhost:8000/api/ingredient_unit_conversions/${ingredientId}/${oldUnitId}/${newUnitId}`
            );
            if (!res.ok) {
                throw new Error(
                    `Przelicznik nie jest dostępny (ing=${ingredientId}, from=${oldUnitId}, to=${newUnitId}).`
                );
            }
            const conv = await res.json();
            const multiplier = conv.multiplier;

            const oldQty = ing.quantity;
            const newQty = oldQty * multiplier;

            setIngredients((prev) =>
                prev.map((item, i) => {
                    if (i !== index) return item;
                    return {
                        ...item,
                        quantity: newQty,
                        unit: newUnitName,
                    };
                })
            );
        } catch (err) {
            alert(`Nie udało się przeliczyć jednostki: ${err.message}`);
        }
    };

    if (loading) return <div>Ładowanie przepisu...</div>;
    if (error) return <div>Błąd: {error}</div>;
    if (!recipe) return <div>Nie znaleziono przepisu.</div>;

    const {title, description, tags, steps, img} = recipe;

    return (
        <div>
            <Navbar/>
            <div className="recipe-header">
                <div className="tag-list">
                    {tags.map((t) => (
                        <Tag key={t.id} text={t.name}/>
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
                    <div>
                        <img
                            src={img}
                            alt={title}
                            className="w-full h-auto object-cover mb-4 rounded-xl"
                        />
                        <ul>
                            {ingredients.map((ingredient, idx) => (
                                <li key={ingredient.id} className="ingredient-item">
                                    <Ingredient
                                        name={ingredient.name}
                                        quantity={ingredient.quantity}
                                        unitName={ingredient.unit}
                                    />
                                    <UnitSelector
                                        ingredientId={ingredient.id}
                                        selectedUnitName={ingredient.unit}
                                        onChangeUnit={(changeObj) =>
                                            handleUnitChange(idx, changeObj)
                                        }
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                }
                right={steps.map((step, i) => (
                    <Step key={step.id} index={i + 1} description={step.description}/>
                ))}
                leftSize={30}
            />
        </div>
    );
};

export default Recipe;
