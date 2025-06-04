import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "@uidotdev/usehooks";
import Navbar from "../components/Navbar";
import { getAllTags, getFilteredRecipes } from "../../utils/network";
import { TagSelector } from "../components/TagSelector";

const ViewRecipes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [cachedRecipes, setCachedRecipes] = useState([]);
  const [isError, setIsError] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const debouncedSelectedTags = useDebounce(selectedTags, 1000);

  useEffect(() => {
    async function fetchRecipes() {
      const [filteredRecipes, error] = await getFilteredRecipes(
        debouncedSearchTerm,
        debouncedSelectedTags
      );
      if (error) {
        setIsError(true);
        return;
      }
      setIsError(false);
      setRecipes(filteredRecipes);
      setCachedRecipes(filteredRecipes);
      console.log(filteredRecipes);
    }

    fetchRecipes();
  }, [debouncedSearchTerm, debouncedSelectedTags]);

  useEffect(() => {
    async function fetchTags() {
      const tags = await getAllTags();
      setAvailableTags(tags.map(({ id, name }) => ({ id: id.toString(), name })));
    }

    fetchTags();
  }, []);

  const displayedRecipes = isError ? cachedRecipes : recipes;


  return (
    <div>
      <Navbar>
        <TagSelector
          selectedTags={selectedTags}
          availableTags={availableTags}
          onAdd={(tag) => setSelectedTags((old) => [...old, tag])}
          onDelete={(index) => setSelectedTags((old) => old.filter((_, idx) => idx != index))}
          noCreateNew
        />
        <input
          className="py-2 px-2 my-4 mx-2 font-semibold border-gray-300 border-2 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Szukaj przepisu..."
        />
      </Navbar>
      {isError && (
        <div className="text-center text-red-600 font-semibold my-4">
          Błąd podczas pobierania przepisów. Wyświetlono ostatnie poprawne wyniki.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 p-6 mt-6">
        {displayedRecipes.length === 0 ? (
          <div className="col-span-full text-center text-xl font-medium">
            Brak dostępnych przepisów
          </div>
        ) : (
          displayedRecipes.map((recipe, index) => (
            <Link key={index} to={`/public/recipes/${recipe.id}`}>
              <div className="bg-gray-300 rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                {recipe.img && recipe.img.trim() !== "" && (
                  <img
                    src={recipe.img}
                    alt={recipe.title}
                    className="w-full h-40 object-cover p-2 rounded-xl"
                  />
                )}
                <div className="flex flex-col px-4 pb-4 h-full">
                  <h3 className="text-lg font-bold mt-2">{recipe.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{recipe.description}</p>
                  <div className="flex flex-wrap mt-2 gap-1">
                    {recipe.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {tag.name}
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
