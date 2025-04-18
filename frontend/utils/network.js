export const getAnimals = async () => {
    // TODO: move server address to .env file
    const response = await fetch("http://localhost:8000/api/animals/");
    const animals = await response.json();
    return animals;
};

export const addAnimal = async (name, size) => {
    // TODO: move server address to .env file
    const response = await fetch(`http://localhost:8000/api/animals/${name}?size=${size}`, {
        method: "POST",
    });
    const status = await response.json();
    return status;
};
