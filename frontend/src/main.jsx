import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import './index.css'
import App from './App.jsx'
import ViewRecipes from './pages/ViewRecipes.jsx';
import AddRecipe from './pages/AddRecipe.jsx';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/recipes/show" element={<ViewRecipes />} />
        <Route path="/recipes/add" element={<AddRecipe />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);