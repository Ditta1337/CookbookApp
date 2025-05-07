import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import TagCreator from '../components/tag_creator/TagCreator';

const AddRecipe = () => {
  const recipeId = 0;
  const [stepId, setStepId] = useState(1);
  const [ingredientId, setIngredientId] = useState(1);

  const getDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [tags, setTags] = useState([]);
  const [recipeData, setRecipeData] = useState({
    id: recipeId,
    name: '',
    description: '',
    date: getDate(),
  });

  const [recipeSteps, setRecipeSteps] = useState([
    { id: 0, title: '', description: '' },
  ]);

  const [recipeIngredients, setRecipeIngredients] = useState([
    { id: 0, name: '', quantity: 0, unit: '' },
  ]);

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
    setRecipeSteps([...recipeSteps, { id: stepId, title: '', description: '' }]);
    setStepId(stepId + 1);
  };

  const handleAddIngredient = () => {
    setRecipeIngredients([
      ...recipeIngredients,
      { id: ingredientId, name: '', quantity: 0, unit: '' },
    ]);
    setIngredientId(ingredientId + 1);
  };

  const handleDeleteSteps = (i) => {
    const deleteSteps = [...recipeSteps];
    deleteSteps.splice(i, 1);
    setRecipeSteps(deleteSteps);
  };

  const handleDeleteIngredients = (i) => {
    const deleteIngredients = [...recipeIngredients];
    deleteIngredients.splice(i, 1);
    setRecipeIngredients(deleteIngredients);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const json = {
      recipe: recipeData,
      tags,
      steps: recipeSteps,
      ingredients: recipeIngredients,
    };
    console.log(json);
    fetch('http://localhost:8080/recipes/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json),
    });
  };

  return (
      <div>
        <Navbar />
        <div>
          <form className="w-5/6 max-w-md mx-auto">
            <fieldset className="flex flex-col border py-1 px-4">
              <legend className="text-5xl font-semibold mb-2">Dodaj Przepis</legend>
              <label className="text-2xl font-semibold">Nazwa przepisu:</label>
              <input
                  className="border-2 border-gray-300 rounded-md py-2 px-1 my-4"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nazwa przepisu"
                  onChange={handleInput}
                  required
              />
              <label className="text-2xl font-semibold">Opis przepisu:</label>
              <textarea
                  className="border-2 border-gray-300 rounded-md py-2 px-1 my-4"
                  id="description"
                  name="description"
                  type="text"
                  placeholder="Opis przepisu"
                  onChange={handleInput}
                  rows={5}
                  required
              />
              <label className="text-2xl font-semibold">Tagi:</label>
              <TagCreator tags={tags} setTags={setTags} />
              <label className="text-2xl font-semibold">Składniki:</label>
              {recipeIngredients.map((ingredient, i) => (
                  <div
                      key={ingredient.id}
                      className="flex flex-col border-gray-300 border-2 rounded-md py-2 my-4"
                  >
                    <input
                        className="border-2 border-gray-300 rounded-md py-2 px-1 mt-2 mb-1 mx-2"
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Nazwa składnika"
                        onChange={(event) => handleIngredientChange(event, i)}
                        required
                    />
                    <input
                        className="border-2 border-gray-300 rounded-md py-2 px-1 mt-2 mb-1 mx-2"
                        id="quantity"
                        name="quantity"
                        type="text"
                        placeholder="Ilość"
                        onChange={(event) => handleIngredientChange(event, i)}
                        required
                    />
                    <input
                        className="border-2 border-gray-300 rounded-md py-2 px-1 mt-2 mb-1 mx-2"
                        id="unit"
                        name="unit"
                        type="text"
                        placeholder="Jednostka"
                        onChange={(event) => handleIngredientChange(event, i)}
                        required
                    />
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold my-2 py-2 px-4 rounded"
                        type="button"
                        onClick={() => handleDeleteIngredients(i)}
                    >
                      Usuń składnik
                    </button>
                  </div>
              ))}
              <div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded"
                    type="button"
                    onClick={handleAddIngredient}
                >
                  Dodaj składnik
                </button>
              </div>
              <label className="text-2xl font-semibold">Kroki:</label>
              {recipeSteps.map((step, i) => (
                  <div
                      key={step.id}
                      className="flex flex-col border-gray-300 border-2 rounded-md py-2 my-4"
                  >
                    <input
                        className="border-2 border-gray-300 rounded-md mx-2 py-2 px-1 mt-2 mb-2"
                        id="title"
                        name="title"
                        type="text"
                        placeholder="Tytuł kroku"
                        onChange={(event) => handleStepChange(event, i)}
                        required
                    />
                    <textarea
                        className="border-2 border-gray-300 rounded-md mx-2 py-2 px-1 mb-2"
                        id="description"
                        name="description"
                        type="text"
                        rows={5}
                        placeholder="Opis kroku"
                        onChange={(event) => handleStepChange(event, i)}
                        required
                    />
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold my-2 py-2 px-4 rounded"
                        type="button"
                        onClick={() => handleDeleteSteps(i)}
                    >
                      Usuń krok
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
            </fieldset>
            <button
                className="my-4"
                type="submit"
                onClick={handleSubmit}
            >
              Dodaj przepis
            </button>
          </form>
        </div>
      </div>
  );
};

export default AddRecipe;