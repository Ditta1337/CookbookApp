import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { TagSelector } from "../components/TagSelector";
import { getAllIngredients, getAllTags, sendNewIngredient, sendNewTag } from "../../utils/network";

const AddRecipe = () => {
  const recipeId = 0;
  const [stepId, setStepId] = React.useState(1);
  const [base64Photo, setBase64Photo] = useState("");
  const fileInputRef = useRef(null);
  const getDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [recipeData, setRecipeData] = React.useState({
    id: recipeId,
    name: "",
    description: "",
    date: getDate(),
  });
  const [recipeTags, setRecipeTags] = React.useState([]); // [{ id, name }]
  const [availableTags, setAvailableTags] = useState([]);

  const [recipeSteps, setRecipeSteps] = React.useState([
    {
      id: 0,
      description: "",
    },
  ]);
  const [recipeIngredients, setRecipeIngredients] = React.useState([]); // [{ id, name, quantity, unit }]
  const [availableIngredients, setAvailableIngredients] = useState([]);

  useEffect(() => {
    async function fetchTagsAndIngredients() {
      const tags = await getAllTags();
      const ingredients = await getAllIngredients();
      setAvailableTags(tags);
      setAvailableIngredients(ingredients);
    }

    fetchTagsAndIngredients();
  }, []);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setRecipeData({
      ...recipeData,
      [name]: value,
    });
  };
  const handleStepChange = (event, i) => {
    const { name, value } = event.target;
    const newSteps = [...recipeSteps];
    newSteps[i][name] = value;
    setRecipeSteps(newSteps);
  };
  const handleIngredientChange = (event, i) => {
    const { name, value } = event.target;
    const newIngredients = [...recipeIngredients];
    newIngredients[i][name] = value;
    setRecipeIngredients(newIngredients);
  };
  const handleAddStep = () => {
    setRecipeSteps([...recipeSteps, { id: stepId, description: "" }]);
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

  const handleDeleteSteps = (i) => {
    const deleteSteps = [...recipeSteps];
    deleteSteps.splice(i, 1);
    setRecipeSteps(deleteSteps);
  };
  const handleDeleteTag = (i) => {
    const deleteTags = [...recipeTags];
    deleteTags.splice(i, 1);
    setRecipeTags(deleteTags);
  };
  const handleDeleteIngredient = (i) => {
    const deleteIngredients = [...recipeIngredients];
    deleteIngredients.splice(i, 1);
    setRecipeIngredients(deleteIngredients);
  };
  const resetForm = () => {
    setRecipeData({
      id: recipeId,
      name: "",
      description: "",
      date: getDate(),
    });

    setRecipeTags([]);
    setRecipeSteps([{ id: 0, description: "" }]);
    setRecipeIngredients([]);
    setBase64Photo("");
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }

    setStepId(1);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const json = {
      title: recipeData.name,
      description: recipeData.description,
      date: recipeData.date,
      img: base64Photo || "omlet.jpg",
      tags: recipeTags.map((tag) => tag.name),
      steps: recipeSteps.map(({id, description }) => ({id, description})),
      ingredients: recipeIngredients.map(({ name, quantity, unit }) => ({
        name,
        quantity: Number(quantity),
        unit,
      })),
    };

    try {
      console.log("Wysyłane dane:", JSON.stringify(json, null, 2));
      const response = await fetch("http://localhost:8000/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json),
      });

      if (!response.ok) {
        throw new Error(`Błąd serwera: ${response.status}`);
      }

      console.log("Przepis zapisany!");
      resetForm();
    } catch (error) {
      console.error("Błąd przy zapisie przepisu:", error.message);
      alert("Coś poszło nie tak przy zapisie. Sprawdź backend.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center py-3 my-4">
        <h1 className="text-3xl font-bold">Dodaj przepis</h1>
      </div>
      <form className="w-11/12 max-w-7xl mx-auto" onSubmit={handleSubmit}>
        <fieldset className="flex flex-col md:flex-row gap-10 border py-6 px-4">
          <div className="flex-1 flex flex-col">
            <label className="text-2xl font-semibold">Nazwa przepisu:</label>
            <input
              className="border-2 border-gray-300 rounded-md py-2 px-1 my-4"
              id="name"
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
            <label className="text-2xl font-semibold mt-4">Składniki:</label>
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
                className="flex flex-wrap md:flex-nowrap items-center gap-2 border border-gray-300 rounded-md p-2 my-2"
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
              id="description"
              name="description"
              type="text"
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
                <div className="flex-1 flex flex-col gap-2">
                  <textarea
                    className="border border-gray-300 rounded-md py-2 px-2"
                    id="description"
                    name="description"
                    type="text"
                    value={step.description}
                    rows={5}
                    placeholder="Opis kroku"
                    onChange={(event) => handleStepChange(event, i)}
                    required
                  />
                </div>
                <button
                  className="delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded h-full"
                  type="button"
                  onClick={() => handleDeleteSteps(i)}
                  title="Usuń krok"
                >
                  &minus;
                </button>
              </div>
            ))}
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded"
                type="button"
                onClick={handleAddStep}
              >
                Dodaj krok
              </button>
            </div>
          </div>
        </fieldset>
        <button className="my-4" type="submit">
          Dodaj przepis
        </button>
      </form>
    </div>
  );
};

export default AddRecipe;
