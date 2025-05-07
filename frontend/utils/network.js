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

// mock na potrzeby developmentu
let recipeData = {
  title: "Nalesniki",
  description: "Przepyszne nalesniki z dzemem albo czymkolwiek innym co uwazasz za smaczne",
  steps: [
    {
      title: "Zmieszaj skladniki",
      description:
        "Do jednej miski wsyp make, wbij jajka, wlej mleko, dodaj cukru do smaku i szczypte soli. Nastepnie wymieszaj skladniki przy pomocy miksera albo recznie",
    },
    { title: "Usmaz ciasto", description: "Dokladniejszy opis tego co ma byc zrobione" },
    { title: "Wyloz na talerz", description: "Dokladniejszy opis tego co ma byc zrobione" },
    { title: "Posmaruj dzemem i zawin", description: "Dokladniejszy opis tego co ma byc zrobione" },
  ],
  ingredients: [
    {
      name: "Maka",
      quantity: 200,
      unit: "g",
    },
    {
      name: "Mleko",
      quantity: 300,
      unit: "ml",
    },
    {
      name: "Jajko",
      quantity: 2,
      unit: "szt",
    },
  ],
  tags: [
      "Naleśniki",
      "Pyszne",
      "Słodkie"
  ]
};

export const mockRecipeData = async (recipeId) => {
  const recipe = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: recipeId, ...recipeData });
    }, 1000);
  });

  return recipe;
};

export const modifyTags = async (recipeId, tags) => {
  // TODO: move server address to .env file
  const response = await fetch(`http://localhost:8000/api/recipes/${recipeId}/tags`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tags }),
  });

  if (!response.ok) {
    throw new Error("Failed to modify tags");
  }

  const updatedTags = await response.json();
  return updatedTags;
};

export const mockModifyTags = async (recipeId, tags) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      recipeData = {
        ...recipeData,
        tags,
      };
      resolve(tags);
    }, 500);
  });
};

