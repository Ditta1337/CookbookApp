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
  //tagi pewnie będą w bazie danych, ale na razie nie ma żadnego selecta tylko input
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
  const fetchRecipeId = async() => {
  };

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
  const handleSubmit = (event) => {
    event.preventDefault();
    const json = {
      recipe: recipeData,
      tags: recipeTags,
      steps: recipeSteps,
      ingredients: recipeIngredients,
    };
    fetch('http://localhost:8000/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json),
    })
    console.log(json);
  }

  return(
    <div>
    <Navbar/>
    <div>
        <form className='w-5/6 max-w-md mx-auto'>
          <fieldset className='flex flex-col border py-1 px-4'>
            <legend className='text-5xl font-semibold mb-2'>Dodaj Przepis</legend>
            <label className="text-2xl font-semibold">Nazwa przepisu:</label>
            <input className='border-2 border-gray-300 rounded-md py-2 px-1 my-4' 
            id="name" 
            name="name" 
            type='text' 
            placeholder='Nazwa przepisu'
            onChange={handleInput} 
            required />
            <label className="text-2xl font-semibold">Opis przepisu:</label>
            <textarea className='border-2 border-gray-300 rounded-md py-2 px-1 my-4' 
            id="description" 
            name="description" 
            type='text' 
            placeholder='Opis przepisu'
            onChange={handleInput} 
            rows={5}
            required />
            <label className="text-2xl font-semibold">Tagi:</label>
            {recipeTags.map((tag, i) => (
                <div key={tag.id} className='flex flex-col border-gray-300 border-2 rounded-md py-2 my-4'>
                <input className='border-2 border-gray-300 rounded-md py-2 px-1 mt-2 mb-1 mx-2'
                id='name'
                name='name'
                type='text'
                placeholder='Nazwa tagu'
                onChange={event => handleTagChange(event,i)}
                required></input>
                <button className='bg-red-500 hover:bg-red-700 text-white font-bold my-2 py-2 px-4 rounded'
                type='button'
                onClick={() => handleDeleteTags(i)}>Usuń tag</button>
                </div>
              ))}
              <div>
              <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded'
              type='button'
              onClick={handleAddTag}>Dodaj tag</button>
            </div>
            <label className="text-2xl font-semibold">Składniki:</label>
            {recipeIngredients.map((ingredient, i) => (
                <div key={ingredient.id} className='flex flex-col border-gray-300 border-2 rounded-md py-2 my-4'>
                <input className='border-2 border-gray-300 rounded-md py-2 px-1 mt-2 mb-1 mx-2'
                id='name'
                name='name'
                type='text'
                placeholder='Nazwa składnika'
                onChange={event => handleIngredientChange(event,i)}
                required></input>
                <input className='border-2 border-gray-300 rounded-md py-2 px-1 mt-2 mb-1 mx-2'
                id='quantity'
                name='quantity'
                type='text'
                placeholder='Ilość'
                onChange={event => handleIngredientChange(event,i)}
                required></input>
                <input className='border-2 border-gray-300 rounded-md py-2 px-1 mt-2 mb-1 mx-2'
                id='unit'
                name='unit'
                type='text'
                placeholder='Jednostka'
                onChange={event => handleIngredientChange(event,i)}
                required></input>
                <button className='bg-red-500 hover:bg-red-700 text-white font-bold my-2 py-2 px-4 rounded'
                type='button'
                onClick={() => handleDeleteIngredients(i)}>Usuń składnik</button>
                </div>
              ))}
              <div>
              <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded'
              type='button'
              onClick={handleAddIngredient}>Dodaj składnik</button>
            </div>

            <label className="text-2xl font-semibold">Kroki:</label>
            {recipeSteps.map((step, i) => (
                <div key={step.id} className='flex flex-col border-gray-300 border-2 rounded-md py-2 my-4'>
                <input className='border-2 border-gray-300 rounded-md mx-2 py-2 px-1 mt-2 mb-2'
                id='title'
                name='title'
                type='text'
                placeholder='Tytuł kroku'
                onChange={event => handleStepChange(event,i)}
                required></input>
                <textarea className='border-2 border-gray-300 rounded-md  mx-2 py-2 px-1 mb-2'
                id='description'
                name='description'
                type='text'
                rows={5}
                placeholder='Opis kroku'
                onChange={event => handleStepChange(event,i)}
                required></textarea>
                <button className='bg-red-500 hover:bg-red-700 text-white font-bold my-2 py-2 px-4 rounded'
                type='button'
                onClick={() => handleDeleteSteps(i)}>Usuń krok</button>
                </div>
              ))}
              <div>
              <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded'
              type='button'
              onClick={handleAddStep}>Dodaj krok</button>
            </div>
          </fieldset>
          <button className='my-4'
          type='submit'
          onSubmit={handleSubmit}
          >Dodaj przepis</button>
        </form>
      </div>
  </div>
  ) 
};

export default AddRecipe;