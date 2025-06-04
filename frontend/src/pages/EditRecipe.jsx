import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { TagSelector } from "../components/TagSelector";
import { getAllIngredients, getAllTags, sendNewIngredient, sendNewTag } from "../../utils/network";

const EditRecipe = () => {
  const { id: recipeId } = useParams();
  const [base64Photo, setBase64Photo] = useState("");
  const fileInputRef = useRef(null);

  const [stepId, setStepId] = useState(1);

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

  const [recipeTags, setRecipeTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [recipeSteps, setRecipeSteps] = useState([{ id: 0, description: "" }]);
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [availableIngredients, setAvailableIngredients] = useState([]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/recipes/${recipeId}`);
        const data = await res.json();

        setRecipeData({
          id: data.id,
          name: data.title,
          description: data.description,
          date: getDate(),
        });

        // TODO: rework .map((tag, i) => ...) to use the real id, not the index
        setRecipeTags(data.tags.map((tag, i) => ({ id: i, name: tag })));
        setRecipeSteps(data.steps.map((step, i) => ({ id: i, description: step.description })));
        setRecipeIngredients(data.ingredients.map((ing, i) => ({ id: i, ...ing })));
        setBase64Photo(data.img);

        setStepId(data.steps.length);
      } catch (error) {
        console.error("Błąd podczas pobierania przepisu:", error);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  useEffect(() => {
    async function fetchTagsAndIngredients() {
      const tags = await getAllTags();
      const ingredients = await getAllIngredients();
      setAvailableTags(tags);
      setAvailableIngredients(ingredients);
    }

    fetchTagsAndIngredients();
  }, []);

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

  const handleAddStep = () => {
    setRecipeSteps([...recipeSteps, { id: stepId, title: "", description: "" }]);
    setStepId(stepId + 1);
  };

  const handleAddTag = async (newId, name) => {
    let id = Number(newId);
    if (isNaN(id)) {
      const newTag = await sendNewTag(name);
      setAvailableTags((allTags) => [...allTags, newTag]);
      id = newTag.id;
    }
    setRecipeTags([...recipeTags, { id, name }]);
  };

  const handleAddIngredient = async (newId, name) => {
    let id = Number(newId);
    if (isNaN(id)) {
      const newIngredient = await sendNewIngredient(name);
      setAvailableIngredients((allIngredients) => [...allIngredients, newIngredient]);
      id = newIngredient.id;
    }
    setRecipeIngredients([...recipeIngredients, { id, name, quantity: 0, unit: "" }]);
  };

  const handleDeleteSteps = (i) => {
    const updated = [...recipeSteps];
    updated.splice(i, 1);
    setRecipeSteps(updated);
  };

  const handleDeleteIngredient = (i) => {
    const updated = [...recipeIngredients];
    updated.splice(i, 1);
    setRecipeIngredients(updated);
  };

  const handleDeleteTag = (i) => {
    const updated = [...recipeTags];
    updated.splice(i, 1);
    setRecipeTags(updated);
  };
  const handlePhotoChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onloadend = () => {
    setBase64Photo(reader.result); // zapisujemy base64 string
  };

  reader.onerror = () => {
    console.error("Błąd podczas odczytu pliku");
  };
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    const json = {
      title: recipeData.name,
      description: recipeData.description,
      date: recipeData.date,
      img: base64Photo || "omlet.jpg",
      tags: recipeTags.map((tag) => tag.name),
      steps: recipeSteps.map(({ id, description }) => ({ id, description })),
      ingredients: recipeIngredients.map(({ name, quantity, unit }) => ({
        name,
        quantity: Number(quantity),
        unit,
      })),
    };

    try {
      const response = await fetch(`http://localhost:8000/api/recipes/update/${recipeId}`, {
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
            <label className="text-2xl font-semibold mt-4">Zdjęcie przepisu:</label>
            <input
              className="border-2 border-gray-300 rounded-md py-2 px-1 my-2"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              ref={fileInputRef}
            />
            <label className="text-2xl font-semibold">Składniki:</label>
            <TagSelector
              selectedTags={recipeIngredients.map(({ id, name }) => ({
                id: id.toString(),
                name,
              }))}
              availableTags={availableIngredients.map(({ id, name }) => ({
                id: id.toString(),
                name,
              }))}
              onAdd={({ id, name }) => handleAddIngredient(id, name)}
              onDelete={(i) => handleDeleteIngredient(i)}
            />
            {recipeIngredients.map((ingredient, i) => (
              <div
                key={ingredient.id}
                className="flex flex-wrap md:flex-nowrap gap-2 border border-gray-300 rounded-md p-2 my-2"
              >
                <input
                  className="flex-1 border border-gray-300 rounded-md py-2 px-2"
                  name="name"
                  type="text"
                  value={ingredient.name}
                  placeholder="Nazwa składnika"
                  disabled
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
                  onClick={() => handleDeleteIngredient(i)}
                  className="delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  title="Usuń składnik"
                >
                  &minus;
                </button>
              </div>
            ))}
            <label className="text-2xl font-semibold">Tagi:</label>
            <TagSelector
              selectedTags={recipeTags.map(({ id, name }) => ({
                id: id.toString(),
                name,
              }))}
              availableTags={availableTags.map(({ id, name }) => ({
                id: id.toString(),
                name,
              }))}
              onAdd={({ id, name }) => handleAddTag(id, name)}
              onDelete={(i) => handleDeleteTag(i)}
            />
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
              <div
                key={step.id}
                className="flex flex-row gap-2 rounded-md px-4 py-1 my-1 items-stretch"
              >
                {" "}
                <div className="flex-1 flex flex-col gap-2">
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
                  title="Usuń krok"
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

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-800 text-white font-bold py-3 px-6 rounded"
        >
          Zapisz zmiany
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;
