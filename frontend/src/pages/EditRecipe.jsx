import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const EditRecipe = () => {
  const { id: recipeId } = useParams();

  const [stepId, setStepId] = useState(1);
  const [ingredientId, setIngredientId] = useState(1);
  const [tagId, setTagId] = useState(1);

  const getDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [recipeData, setRecipeData] = useState({
    id: recipeId,
    name: "",
    description: "",
    date: getDate(),
  });

  const [recipeTags, setRecipeTags] = useState([{ id: 0, name: "" }]);
  const [recipeSteps, setRecipeSteps] = useState([{ id: 0, title: "", description: "" }]);
  const [recipeIngredients, setRecipeIngredients] = useState([
    { id: 0, name: "", quantity: 0, unit: "" },
  ]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`http://localhost:8000/recipes/${recipeId}`);
        const data = await res.json();

        setRecipeData({
          id: data.id,
          name: data.title,
          description: data.description,
          date: getDate(),
        });

        setRecipeTags(data.tags.map((tag, i) => ({ id: i, name: tag })));
        setRecipeSteps(data.steps.map((step, i) => ({ id: i, ...step })));
        setRecipeIngredients(data.ingredients.map((ing, i) => ({ id: i, ...ing })));

        setTagId(data.tags.length);
        setStepId(data.steps.length);
        setIngredientId(data.ingredients.length);
      } catch (error) {
        console.error("Błąd podczas pobierania przepisu:", error);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setRecipeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (e, i) => {
    const { name, value } = e.target;
    const updated = [...recipeSteps];
    updated[i][name] = value;
    setRecipeSteps(updated);
  };

  const handleIngredientChange = (e, i) => {
    const { name, value } = e.target;
    const updated = [...recipeIngredients];
    updated[i][name] = value;
    setRecipeIngredients(updated);
  };

  const handleTagChange = (e, i) => {
    const { name, value } = e.target;
    const updated = [...recipeTags];
    updated[i][name] = value;
    setRecipeTags(updated);
  };

  const handleAddStep = () => {
    setRecipeSteps([...recipeSteps, { id: stepId, title: "", description: "" }]);
    setStepId(stepId + 1);
  };

  const handleAddIngredient = () => {
    setRecipeIngredients([
      ...recipeIngredients,
      { id: ingredientId, name: "", quantity: 0, unit: "" },
    ]);
    setIngredientId(ingredientId + 1);
  };

  const handleAddTag = () => {
    setRecipeTags([...recipeTags, { id: tagId, name: "" }]);
    setTagId(tagId + 1);
  };

  const handleDeleteSteps = (i) => {
    const updated = [...recipeSteps];
    updated.splice(i, 1);
    setRecipeSteps(updated);
  };

  const handleDeleteIngredients = (i) => {
    const updated = [...recipeIngredients];
    updated.splice(i, 1);
    setRecipeIngredients(updated);
  };

  const handleDeleteTags = (i) => {
    const updated = [...recipeTags];
    updated.splice(i, 1);
    setRecipeTags(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const json = {
      title: recipeData.name,
      description: recipeData.description,
      date: recipeData.date,
      img: "placeholder.jpg",
      tags: recipeTags.map((tag) => tag.name),
      steps: recipeSteps.map(({ title, description }) => ({ title, description })),
      ingredients: recipeIngredients.map(({ name, quantity, unit }) => ({
        name,
        quantity: Number(quantity),
        unit,
      })),
    };

    try {
      const response = await fetch(`http://localhost:8000/recipes/${recipeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      console.log("Przepis zaktualizowany!");
    } catch (err) {
      console.error("Błąd aktualizacji przepisu:", err.message);
      alert("Aktualizacja nie powiodła się.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center py-3 my-4">
        <h1 className="text-3xl font-bold">Edytuj przepis</h1>
      </div>
      <form className="w-11/12 max-w-7xl mx-auto" onSubmit={handleSubmit}>
        <fieldset className="flex flex-col md:flex-row gap-10 border py-6 px-4">
          <div className="flex-1 flex flex-col">
            <label className="text-2xl font-semibold">Nazwa przepisu:</label>
            <input
              className="border-2 border-gray-300 rounded-md py-2 px-1 my-4"
              name="name"
              type="text"
              value={recipeData.name}
              placeholder="Nazwa przepisu"
              onChange={handleInput}
              required
            />
            <label className="text-2xl font-semibold">Składniki:</label>
            {recipeIngredients.map((ingredient, i) => (
              <div key={ingredient.id} className="flex flex-wrap md:flex-nowrap gap-2 border border-gray-300 rounded-md p-2 my-2">
                <input
                  className="flex-1 border border-gray-300 rounded-md py-2 px-2"
                  name="name"
                  type="text"
                  value={ingredient.name}
                  placeholder="Nazwa składnika"
                  onChange={(e) => handleIngredientChange(e, i)}
                  required
                />
                <input
                  className="w-24 border border-gray-300 rounded-md py-2 px-2"
                  name="quantity"
                  type="text"
                  value={ingredient.quantity}
                  placeholder="Ilość"
                  onChange={(e) => handleIngredientChange(e, i)}
                  required
                />
                <input
                  className="w-28 border border-gray-300 rounded-md py-2 px-2"
                  name="unit"
                  type="text"
                  value={ingredient.unit}
                  placeholder="Jednostka"
                  onChange={(e) => handleIngredientChange(e, i)}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleDeleteIngredients(i)}
                  className="delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  &minus;
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddIngredient}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-2"
            >
              Dodaj składnik
            </button>

            <label className="text-2xl font-semibold">Tagi:</label>
            {recipeTags.map((tag, i) => (
              <div key={tag.id} className="flex items-center gap-2 border border-gray-300 rounded-md p-2 my-2">
                <input
                  className="flex-1 border border-gray-300 rounded-md py-2 px-2"
                  name="name"
                  type="text"
                  value={tag.name}
                  placeholder="Nazwa tagu"
                  onChange={(e) => handleTagChange(e, i)}
                  required
                />
                <button
                  type="button"
                  onClick={() => handleDeleteTags(i)}
                  className="delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  &minus;
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddTag}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-2"
            >
              Dodaj tag
            </button>
          </div>
          <div className="flex-1 flex flex-col">
            <label className="text-2xl font-semibold">Opis przepisu:</label>
            <textarea
              className="border-2 border-gray-300 rounded-md py-2 px-1 my-4"
              name="description"
              value={recipeData.description}
              placeholder="Opis przepisu"
              onChange={handleInput}
              rows={5}
              required
            />
          <label className="text-2xl font-semibold">Kroki przygotowania:</label>
          {recipeSteps.map((step, i) => (
          <div key={step.id} className="flex flex-row gap-2 border border-gray-300 rounded-md p-4 my-2 items-stretch">              <div className="flex-1 flex flex-col gap-2">
              <input
                className="border border-gray-300 rounded-md py-2 px-2"
                name="title"
                type="text"
                value={step.title}
                placeholder="Tytuł kroku"
                onChange={(e) => handleStepChange(e, i)}
                required
              />
              <textarea
                className="border border-gray-300 rounded-md py-2 px-2"
                name="description"
                value={step.description}
                placeholder="Opis kroku"
                rows={4}
                onChange={(e) => handleStepChange(e, i)}
                required
              />
              </div>
              <button
                type="button"
                onClick={() => handleDeleteSteps(i)}
                className="delete-button bg-red-500 hover:bg-red-700 text-white font-bold px-4 rounded h-full"
              >
                &minus;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddStep}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Dodaj krok
          </button>
          </div>
        </fieldset>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-800 text-white font-bold py-3 px-6 rounded"
          >
            Zapisz zmiany
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipe;
