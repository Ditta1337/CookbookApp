import { useState } from "react";
import "./App.css";
import { addAnimal, getAnimals } from "../utils/network";
import LandingPage from "./pages/LandingPage";

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
        <LandingPage/>
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
            </div>
        </>
    );
}

export default App;
