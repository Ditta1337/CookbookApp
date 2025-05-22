import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';

const AddRecipe = () => {
  const recipeId = 0;
  const [stepId,setStepId] = React.useState(1);
  const [ingredientId,setIngredientId] = React.useState(1);
  const [tagId,setTagId] = React.useState(1);
  const getDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  const [recipeData, setRecipeData] = React.useState({
    id: recipeId,
    name: '',
    description: '',
    date: getDate(),
  });
  const [recipeTags, setRecipeTags] = React.useState([{
    id: 0,
    name: '',
  }]);

  const [recipeSteps, setRecipeSteps] = React.useState([{
    id: 0,
    title: '',
    description: '',
  }]);
  const [recipeIngredients, setRecipeIngredients] = React.useState([{
    id: 0,
    name: '',
    quantity: 0,
    unit: '',
  }]);

  const handleInput = event => {
    const { name, value } = event.target;
    setRecipeData({
      ...recipeData,
      [name]: value,
    });
  }
  const handleStepChange = (event,i) => {
    const { name, value } = event.target;
    let newSteps = [...recipeSteps];
    newSteps[i][name] = value;
    setRecipeSteps(newSteps);
  }
  const handleIngredientChange = (event,i) => {
    const { name, value } = event.target;
    let newIngredients = [...recipeIngredients];
    newIngredients[i][name] = value;
    setRecipeIngredients(newIngredients);
  }
  const handleTagChange = (event,i) => {
    const { name, value } = event.target;
    let newTags = [...recipeTags];
    newTags[i][name] = value;
    setRecipeTags(newTags);
  }
  const handleAddStep = () => {
    setRecipeSteps([...recipeSteps, { id: stepId, title: '', description: '' }]);
    setStepId(stepId + 1);
  }
  const handleAddTag = () => {
    setRecipeTags([...recipeTags, { id: tagId, name: '' }]);
    setTagId(tagId + 1);
  }

  const handleAddIngredient = () => {
    setRecipeIngredients([...recipeIngredients, { id: ingredientId, name: '', quantity: 0, unit: '' }]);
    setIngredientId(ingredientId + 1);
  }
  const handleDeleteSteps = (i) => {
    let deleteSteps = [...recipeSteps];
    deleteSteps.splice(i, 1);
    setRecipeSteps(deleteSteps);
  }
  const handleDeleteTags = (i) => {
    let deleteTags = [...recipeTags];
    deleteTags.splice(i, 1);
    setRecipeTags(deleteTags);
  }
  const handleDeleteIngredients = (i) => {
    let deleteIngredients = [...recipeIngredients];
    deleteIngredients.splice(i, 1);
    setRecipeIngredients(deleteIngredients);
  }
  const resetForm = () => {
  setRecipeData({
    id: recipeId,
    name: '',
    description: '',
    date: getDate(),
  });

  setRecipeTags([{ id: 0, name: '' }]);
  setRecipeSteps([{ id: 0, title: '', description: '' }]);
  setRecipeIngredients([{ id: 0, name: '', quantity: 0, unit: '' }]);

  setStepId(1);
  setIngredientId(1);
  setTagId(1);
};
const handleSubmit = async (event) => {
  event.preventDefault();

  const json = {
    title: recipeData.name,
    description: recipeData.description,
    date: recipeData.date,
    img: 'omlet.jpg',
    tags: recipeTags.map(tag => tag.name),
    steps: recipeSteps.map(({ title, description }) => ({ title, description })),
    ingredients: recipeIngredients.map(({ name, quantity, unit }) => ({
      name,
      quantity: Number(quantity),
      unit
    })),
  };

  try {
    const response = await fetch('http://localhost:8000/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(json),
    });

    if (!response.ok) {
      throw new Error(`Błąd serwera: ${response.status}`);
    }

    console.log('Przepis zapisany!');
    resetForm(); 
  } catch (error) {
    console.error('Błąd przy zapisie przepisu:', error.message);
    alert('Coś poszło nie tak przy zapisie. Sprawdź backend.');
  }
};

  return(
    <div>
    <Navbar/>
    <div>
      <div className="flex justify-center items-center py-3 my-4">
        <h1 className="text-3xl font-bold">Dodaj przepis</h1>
      </div>
        <form className="w-11/12 max-w-7xl mx-auto" onSubmit={handleSubmit}>
          <fieldset className="flex flex-col md:flex-row gap-10 border py-6 px-4">
            <div className="flex-1 flex flex-col">
            <label className="text-2xl font-semibold">Nazwa przepisu:</label>
            <input className='border-2 border-gray-300 rounded-md py-2 px-1 my-4' 
            id="name" 
            name="name" 
            type='text' 
            value={recipeData.name}
            placeholder='Nazwa przepisu'
            onChange={handleInput} 
            required />
            <label className="text-2xl font-semibold mt-4">Składniki:</label>
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
                  title="Usuń składnik"
                >
                  &minus;
                </button>
              </div>
            ))}
            <div>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-2"
              >
                Dodaj składnik
              </button>
            </div>
                        <label className="text-2xl font-semibold">Tagi:</label>
            {recipeTags.map((tag, i) => (
            <div
              key={tag.id}
              className="flex items-center gap-2 border border-gray-300 rounded-md p-2 my-2"
            >
              <input
                className="flex-1 border border-gray-300 rounded-md py-2 px-2"
                id="name"
                name="name"
                type="text"
                value={tag.name}
                placeholder="Nazwa tagu"
                onChange={(event) => handleTagChange(event, i)}
                required
              />
              <button
                className="delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={() => handleDeleteTags(i)}
                title="Usuń tag"
              >
                &minus;
              </button>
            </div>
          ))}
              <div>
              <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded'
              type='button'
              onClick={handleAddTag}>Dodaj tag</button>
            </div>


            </div>
            <div className="flex-1 flex flex-col">
            <label className="text-2xl font-semibold">Opis przepisu:</label>
            <textarea className='border-2 border-gray-300 rounded-md py-2 px-1 my-4' 
            id="description" 
            name="description" 
            type='text' 
            value={recipeData.description}
            placeholder='Opis przepisu'
            onChange={handleInput} 
            rows={5}
            required />
                          <label className="text-2xl font-semibold">Kroki przygotowania:</label>
            {recipeSteps.map((step, i) => (
            <div
              key={step.id}
              className="flex flex-row gap-2 border border-gray-300 rounded-md p-2 my-2 items-start"
            >
              <div className="flex-1 flex flex-col gap-2">
                <input
                  className="border border-gray-300 rounded-md py-2 px-2"
                  id="title"
                  name="title"
                  type="text"
                  value={step.title}
                  placeholder="Tytuł kroku"
                  onChange={(event) => handleStepChange(event, i)}
                  required
                />
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
                className="delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded h-fit"
                type="button"
                onClick={() => handleDeleteSteps(i)}
                title="Usuń krok"
              >
                &minus;
              </button>
            </div>

              ))}
              <div>
              <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded'
              type='button'
              onClick={handleAddStep}>Dodaj krok</button>
            </div>
            
            </div>
          </fieldset>
          <button className='my-4'
          type='submit'
          >Dodaj przepis</button>
          
        </form>
      </div>
  </div>
  ) 
};

export default AddRecipe;