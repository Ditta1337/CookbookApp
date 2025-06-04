import React, { useState, useRef } from "react";
import "../index.css";
import "./Navbar.css";
import { getAllRecipes, sendRecipesFile, sendRecipeURL } from "../../utils/network";
import { GDRIVE_CLIENT_ID, SCOPES } from "../consts.js";

/* global gapi */

const Navbar = ({ children }) => {
  const [thisShouldntBeDone, setThisShouldntBeDone] = useState(false);

  const fileInput = useRef(null);

  const handleSendFile = async () => {
    if (!fileInput.current) return;
    if (fileInput.current.value.length === 0) alert("Nie wybrano pliku!");
    const response = await sendRecipesFile(fileInput.current.files[0]);
    alert(response.message);
  };

  const handleURLImport = async () => {
    const url = prompt("Podaj adres URL:");
    const newId = await sendRecipeURL(url);
    window.location.href = `/recipes/${newId}/edit`;
  };

  const handleExportToFile = async () => {
    const [recipes, error] = await getAllRecipes();
    if (error) return;

    const jsonFile = createJsonFile(recipes, "exported_recipes.json");
    downloadFile(jsonFile);
  };

  const loadGapi = () =>
    new Promise((resolve) => {
      if (window.gapi) return resolve();
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.onload = resolve;
      document.body.appendChild(script);
    });

  const handleExportToGoogleDrive = async () => {
    await loadGapi();

    await new Promise((resolve) => gapi.load("client", resolve));
    await gapi.client.init({
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
    });

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GDRIVE_CLIENT_ID,
      scope: SCOPES,
      callback: async (tokenResponse) => {
        const accessToken = tokenResponse.access_token;

        const [recipes, error] = await getAllRecipes();
        if (error) return;

        const jsonFile = createJsonFile(recipes, "exported_recipes.json");

        const metadata = {
          name: jsonFile.name,
          mimeType: "application/json",
        };

        const form = new FormData();
        form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
        form.append("file", jsonFile);

        await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
          method: "POST",
          headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
          body: form,
        });

        alert("File uploaded to Google Drive!");
      },
    });

    tokenClient.requestAccessToken();
  };

  const createJsonFile = (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2);
    return new File([jsonString], filename, { type: "application/json" });
  };

  const downloadFile = (file, fileNameOverride = null) => {
    const downloadName = file instanceof File ? file.name : fileNameOverride || "download.bin";

    const url = URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = url;
    link.download = downloadName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

    return (
        <nav>
            <div className="navbar-whole">
                <a className="navbar-button" href="/">
                    Książka kucharska
                </a>
                {children}
                <div className="navbar-buttons">
                    <div id="recipe-creation-methods">
                        <a className="navbar-button" href="/public/recipes/add">
                            Dodaj przepis
                        </a>
                        <div
                            id="rolldown-menu"
                            className={
                                fileInput.current && fileInput.current.value.length > 0 ? "opened" : "closed"
                            }
                        >
                            <div className="menu-item" onClick={handleURLImport}>Importuj z URL</div>
                            <div>
                                <label onClick={() => fileInput.current.click()}>Importuj z pliku</label>
                                <input type="file" ref={fileInput} style={{opacity: 0}}/>
                                {fileInput.current && (
                                    <div onClick={() => fileInput.current.click()}>
                                        {fileInput.current.value.length > 0 ? "Wybrano plik" : "Wybierz plik"}
                                    </div>
                                )}
                                <div onClick={handleSendFile}>Wyślij</div>
                            </div>
                        </div>
                    </div>
                    <a className="navbar-button" href="/public/ingredient-creator/">
                        Kreator składników
                    </a>
                    <div id="export-recipes-methods">
                        <a className="navbar-button">
                            Eksportuj przepisy
                        </a>
                        <div
                            id="rolldown-menu"
                            className={
                                fileInput.current && fileInput.current.value.length > 0 ? "opened" : "closed"
                            }
                        >
                            <div className="menu-item" onClick={handleExportToFile}>Eksport do pliku</div>
                            <div className="menu-item" onClick={handleExportToGoogleDrive}>Eksport do Google Drive</div>
                        </div>
                    </div>
                </div>
      </div>
    </nav>
  );
};

export default Navbar;
