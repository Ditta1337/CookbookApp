import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { addAnimal, getAnimals } from "../utils/network";

function App() {
    const [newAnimalName, setNewAnimalName] = useState("");
    const [newAnimalSize, setNewAnimalSize] = useState("");

    const handleDisplayAnimals = async () => {
        const animals = await getAnimals();
        alert(animals.map(([name, size]) => `name: ${name}, size: ${size}`).join("\n"));
    };

    const handleAddAnimal = async () => {
        const response = await addAnimal(newAnimalName, newAnimalSize);
        alert(JSON.stringify(response));
    };

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={handleDisplayAnimals}>Get animals list</button>
                <br />
                <input
                    type="text"
                    placeholder="name..."
                    value={newAnimalName}
                    onInput={(e) => setNewAnimalName(e.currentTarget.value)}
                />
                <input
                    type="text"
                    placeholder="size..."
                    value={newAnimalSize}
                    onInput={(e) => setNewAnimalSize(e.currentTarget.value)}
                />
                <br />
                <button onClick={handleAddAnimal}>Add new animal</button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
        </>
    );
}

export default App;
