import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import './index.css'
import App from './App.jsx'
import AddRecipe from './pages/AddRecipe.jsx';
import Recipe from './pages/Recipe.jsx';
import EditRecipe from './pages/EditRecipe.jsx';
import IngredientCreator from './pages/IngredientCreator.jsx';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/recipes/add" element={<AddRecipe />} />
        <Route path="/recipes/:id" element={<Recipe />} />
        <Route path="/recipes/:id/edit" element={<EditRecipe />} />
        <Route path="/ingredient-creator" element={<IngredientCreator />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
