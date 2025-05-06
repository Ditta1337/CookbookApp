import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';

const AddRecipe = () => {
  // mock na potrzeby developmentu
/*const recipeData = {
  title: "Nalesniki",
  description: "Przepyszne nalesniki z dzemem albo czymkolwiek innym co uwazasz za smaczne",
  steps: [
    {
      title: "Zmieszaj skladniki",
      description:
        "Do jednej miski wsyp make, wbij jajka, wlej mleko, dodaj cukru do smaku i szczypte soli. Nastepnie wymieszaj skladniki przy pomocy miksera albo recznie",
    },
    { title: "Usmaz ciasto", description: "Dokladniejszy opis tego co ma byc zrobione" },
    { title: "Wyloz na talerz", description: "Dokladniejszy opis tego co ma byc zrobione" },
    { title: "Posmaruj dzemem i zawin", description: "Dokladniejszy opis tego co ma byc zrobione" },
  ],
  ingredients: [
    {
      name: "Maka",
      quantity: 200,
      unit: "g",
    },
    {
      name: "Mleko",
      quantity: 300,
      unit: "ml",
    },
    {
      name: "Jajko",
      quantity: 2,
      unit: "szt",
    },
  ],
};*/
  const [recipeData, setRecipeData] = React.useState({
    recipeTitle: '',
    recipeDescription: '',
  });
  const [recipeSteps, setRecipeSteps] = React.useState([{
    id: Date.now(),
    title: '',
    description: '',
  }]);
  const [recipeIngredients, setRecipeIngredients] = React.useState([{
    id: Date.now(),
    name: '',
    quantity: 0,
    unit: '',
  }]);
  console.log(recipeData);
  console.log(recipeSteps);
  console.log(recipeIngredients);
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
  const handleAddStep = () => {
    setRecipeSteps([...recipeSteps, { id: Date.now(), title: '', description: '' }]);
  }

  const handleAddIngredient = () => {
    setRecipeIngredients([...recipeIngredients, { id: Date.now(), name: '', quantity: 0, unit: '' }]);
  }


  return(
    <div>
    <Navbar/>
    <div>
        <form className='w-5/6 max-w-md mx-auto'>
          <fieldset className='flex flex-col border py-1 px-4'>
            <legend className='text-5xl font-semibold mb-2'>Dodaj Przepis</legend>
            <label className="text-2xl font-semibold">Nazwa przepisu:</label>
            <input className='border-2 border-gray-300 rounded-md py-2 my-4' 
            id="recipeTitle" 
            name="recipeTitle" 
            type='text' 
            placeholder='Nazwe przepisu'
            onChange={handleInput} 
            required />
            <label className="text-2xl font-semibold">Opis przepisu:</label>
            <input className='border-2 border-gray-300 rounded-md py-2 my-4' 
            id="recipeDescription" 
            name="recipeDescription" 
            type='text' 
            placeholder='Opis przepisu'
            onChange={handleInput} 
            required />
            <label className="text-2xl font-semibold">Składniki:</label>
            {recipeIngredients.map((ingredient, i) => (
                <div key={ingredient.id} className='flex flex-col border-gray-300 border-2 rounded-md py-2 my-4'>
                <input className='border-2 border-gray-300 rounded-md py-2 px-1 mt-2 mb-1 mx-2'
                id='name'
                name='name'
                type='text'
                placeholder='Nazwa składnika'
                onChange={event => handleIngredientChange(event,i)}></input>
                <input className='border-2 border-gray-300 rounded-md py-2 px-1 mt-2 mb-1 mx-2'
                id='quantity'
                name='quantity'
                type='text'
                placeholder='Ilość'
                onChange={event => handleIngredientChange(event,i)}></input>
                <input className='border-2 border-gray-300 rounded-md py-2 px-1 mt-2 mb-1 mx-2'
                id='unit'
                name='unit'
                type='text'
                placeholder='Jednostka'
                onChange={event => handleIngredientChange(event,i)}></input>
                </div>
              ))}
              <div>
              <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              type='button'
              onClick={handleAddIngredient}>Dodaj składnik</button>
            </div>
            <label className="text-2xl font-semibold">Kroki:</label>
            {recipeSteps.map((step, i) => (
                <div key={step.id} className='flex flex-col'>
                <input className='border-2 border-gray-300 rounded-md py-2 px-1 mt-2 mb-1'
                id='title'
                name='title'
                type='text'
                placeholder='Tytuł kroku'
                onChange={event => handleStepChange(event,i)}></input>
                <textarea className='border-2 border-gray-300 rounded-md py-2 px-1 mb-2'
                id='description'
                name='description'
                type='text'
                rows={5}
                placeholder='Opis kroku'
                onChange={event => handleStepChange(event,i)}></textarea>
                </div>
              ))}
              <div>
              <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              type='button'
              onClick={handleAddStep}>Dodaj krok</button>
            </div>
          </fieldset>
        </form>
      </div>
  </div>
  ) 
};

export default AddRecipe;