import { useState } from "react";
import "./App.css";
import { addAnimal, getAnimals } from "../utils/network";
import LandingPage from "./pages/LandingPage";
import ViewRecipes from "./pages/ViewRecipes";

function App() {
  return (
    <>
      <ViewRecipes />

    </>
  );
}

export default App;