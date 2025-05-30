import React, { useRef } from "react";
import "../index.css";
import "./Navbar.css";
import { sendRecipesFile, sendRecipeURL } from "../../utils/network";

const Navbar = ({ children }) => {
  const fileInput = useRef(null);

  const handleSendFile = async () => {
    if (!fileInput.current) return;
    if (fileInput.current.value.length === 0) alert("Nie wybrano pliku!");
    const response = await sendRecipesFile(fileInput.current.files[0]);
    // TODO: change response.ok to something that the server returns upon successful import
    if (response.ok) alert("Załadowano przepisy!");
    else alert("Błąd ładowania przepisów!");
  }

  const handleURLImport = async () => {
    const url = prompt("Podaj adres URL:");
    const newId = await sendRecipeURL(url);
    window.location.href = `/recipes/${newId}/edit`;
  }

  return (
    <nav>
      <div className="navbar-whole">
        <a className="navbar-button" href="/">
          Książka kucharska
        </a>
        {children}
        <div className="navbar-buttons">
          <div id="recipe-creation-methods">
            <a className="navbar-button" href="/recipes/add">
              Dodaj przepis
            </a>
            <div
              id="rolldown-menu"
              className={
                fileInput.current && fileInput.current.value.length > 0 ? "opened" : "closed"
              }
            >
              <div className="url-import" onClick={handleURLImport}>Importuj z URL</div>
              <div>
                <label onClick={() => fileInput.current.click()}>Importuj z pliku</label>
                <input type="file" ref={fileInput} style={{ opacity: 0 }} />
                {fileInput.current && (
                  <div onClick={() => fileInput.current.click()}>
                    {fileInput.current.value.length > 0 ? "Wybrano plik" : "Wybierz plik"}
                  </div>
                )}
                <div onClick={handleSendFile}>Wyślij</div>
              </div>
            </div>
          </div>
          <a className="navbar-button" href="/ingredient-creator/">
            Kreator składników
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
