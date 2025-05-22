import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const ViewRecipes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipeData, setRecipeData] = useState([]);
  const [isError, setIsError] = useState(false);

  const fetchRecipeData = async () => {
    try {
      const response = await fetch("http://localhost:8000/recipes/all");
      const data = await response.json();
      setRecipeData(data);
    } catch (error) {
      console.error("Błąd podczas pobierania przepisów:", error);
      setIsError(true);
    }
  };

  useEffect(() => {
    fetchRecipeData();
  }, []);

  const filteredRecipes = recipeData.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isError) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <img src={unplugged} alt="Błąd" className="w-24 h-24" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex justify-center mt-4">
        <input
          type="text"
          placeholder="Szukaj przepisu..."
          className="py-2 px-4 border border-gray-300 rounded-md w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-6 mt-6">
        {filteredRecipes.length === 0 ? (
          <div className="col-span-full text-center text-xl font-medium">
            Brak dostępnych przepisów
          </div>
        ) : (
          filteredRecipes.map((recipe, index) => (
            <Link key={index} to={`/recipes/${recipe.id}`}>
              <div className="bg-gray-300 rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                <img
                  src={recipe.img}
                  alt={recipe.title}
                  className="w-full h-40 object-cover p-2 rounded-xl"
                />
                <div className="flex flex-col px-4 pb-4 h-full">
                  <h3 className="text-lg font-bold mt-2">{recipe.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {recipe.description}
                  </p>
                  <div className="flex flex-wrap mt-2 gap-1">
                    {recipe.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewRecipes;
