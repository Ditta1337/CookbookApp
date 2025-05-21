import { useState, useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import Navbar from "../components/Navbar";
import { getAllTags, getFilteredRecipes } from "../../utils/network";
import { WithContext as ReactTags } from "react-tag-input";

const ViewRecipes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const debouncedSelectedTags = useDebounce(selectedTags, 1000);

  useEffect(() => {
    async function fetchRecipes() {
      const tags = await getAllTags();
      setAvailableTags(tags.map(({ id, name }) => ({ id: id.toString(), name })));
    }

    fetchRecipes();
  }, []);

  useEffect(() => {
    async function fetchRecipes() {
      const filteredRecipes = await getFilteredRecipes(debouncedSearchTerm, debouncedSelectedTags);
      setRecipes(filteredRecipes);
    }

    fetchRecipes();
  }, [debouncedSearchTerm, debouncedSelectedTags]);

  return (
    <div>
      <Navbar>
        <ReactTags
          tags={selectedTags}
          suggestions={availableTags}
          handleAddition={(tag) => setSelectedTags((old) => [...old, tag])}
          handleDelete={(index) => setSelectedTags((old) => old.filter((_, idx) => idx != index))}
          placeholder="Filtruj tagi..."
          separators={["Enter", "Tab"]}
          labelField="name"
          inputFieldPosition="bottom"
          allowDragDrop={false}
          classNames={{
            tagInputField: "py-2 px-2 my-4 mx-2 font-semibold border-gray-300 border-2 rounded-md",
            tag: "py-2 px-2 my-4 mx-2 font-semibold border-gray-300 border-2 rounded-md",
            remove: "p-[8px]! ml-2 bg-red-800!",
            suggestions: "py-2 px-2 font-semibold border-gray-300 border-1 rounded-md",
            activeSuggestion: "py-2 px-2 font-semibold border-blue-300 border-1 rounded-md"
          }}
        />
        <input
          className="py-2 px-2 my-4 mx-2 font-semibold border-gray-300 border-2 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Szukaj przepisu..."
        />
      </Navbar>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {recipes.map(({ title, id }) => (
          <a key={id} href={`/recipes/${id}`}>
            {title} {id}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ViewRecipes;
