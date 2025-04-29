import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import './index.css'
import App from './App.jsx'
import ViewRecipes from './pages/ViewRecipes.jsx';
import AddRecipe from './pages/AddRecipe.jsx';
import Recipe from './pages/Recipe.jsx';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/recipes/" element={<ViewRecipes />} />
        <Route path="/recipes/add" element={<AddRecipe />} />
        <Route path="/recipes/:id" element={<Recipe />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
