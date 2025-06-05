import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useDebounce} from "@uidotdev/usehooks";
import Navbar from "../components/Navbar";
import {getAllTags, getFilteredRecipes} from "../../utils/network";
import {TagSelector} from "../components/TagSelector";
import AppliancesSelector from "../components/AppliancesSelector.jsx";

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
        }

        fetchRecipes();
    }, [debouncedSearchTerm, debouncedSelectedTags]);

    useEffect(() => {
        async function fetchTags() {
            const tags = await getAllTags();
            setAvailableTags(tags.map(({id, name}) => ({id: id.toString(), name})));
        }

        fetchTags();
    }, []);

    const displayedRecipes = isError ? cachedRecipes : recipes;

    return (
        <div>
            <Navbar>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <AppliancesSelector onAdd={(appliance) => setSelectedTags((old) => [...old, appliance])}/>
                    <TagSelector
                        selectedTags={selectedTags}
                        availableTags={availableTags}
                        onAdd={(tag) => setSelectedTags((old) => [...old, tag])}
                        onDelete={(index) => setSelectedTags((old) => old.filter((_, idx) => idx != index))}
                        noCreateNew
                    />
                </div>
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
                    displayedRecipes.map(({id, title, description, tags, img}) => (
                        <Link key={id} to={`/public/recipes/${id}`}>
                            <div
                                className="bg-gray-300 rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                                {img && img.trim() !== "" && (
                                    <img src={img} alt={title} className="w-full h-72 object-cover rounded-t-xl"/>
                                )}
                                <div className="flex flex-col px-4 pb-4 h-full">
                                    <h3 className="text-lg font-bold mt-2">{title}</h3>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
                                    <div className="flex flex-wrap mt-2 gap-1">
                                        {tags.map(({name, id}) => (
                                            <span
                                                key={id}
                                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                            >
                        {name}
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
