import React from "react";
import Navbar from "../components/Navbar";

const ViewRecipes = () => {
  const recipeIds = ['Naleśniki', 'Jabłka prażone', 'Makaron z serem', 'Ziemniaki z koperkiem',
     'Pizza', 'Ziemniaki z sosem czosnkowym', 'Prażynki', 'Paluszki rybne']; 
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredRecipes, setFilteredRecipes] = React.useState(recipeIds);

  const handleSearch = (event) => {
    event.preventDefault();
    const term = event.target.value;
    setSearchTerm(term);
    setFilteredRecipes(
      recipeIds.filter((title) => title.toLowerCase().includes(term.toLowerCase()))
    );
  }

  return (
    <div>
      <Navbar />
      <input 
      className="py-2 px-2 my-4 mx-2 font-semibold border-gray-300 border-2 rounded-md" 
      value={searchTerm}
      onChange={handleSearch} 
      placeholder="Szukaj przepisu..." />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {filteredRecipes.map((title, i) => (
          <a key={i} href={`/recipes/${i}`}>{title}</a>
        ))}
      </div>
    </div>
  );
};

export default ViewRecipes;
