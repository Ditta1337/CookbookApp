const sendPostRequest = (endpoint, body) => {
  endpoint = endpoint[0] !== "/" ? endpoint : endpoint.substr(1);
  return fetch(`http://localhost:8000/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
};

export const getRecipeData = async (recipeId) => {
  const res = await fetch(`http://localhost:8000/recipes/${recipeId}`);
  return await res.json();
};

export const getFilteredRecipes = async (searchTerm, tagList) => {
  console.warn(
    `Searching recipe '${searchTerm}' with tags ${tagList}, but endpoint /recipes/all is called. Need to implement that.`
  );
  try {
    const response = await fetch("http://localhost:8000/recipes/all");
    const data = await response.json();
    return [data, false];
  } catch (error) {
    console.error("Błąd podczas pobierania przepisów:", error);
    return [[], true];
  }
};

export const getAllTags = async () => {
  const response = await fetch("http://localhost:8000/tags/get_all");
  const tags = await response.json();
  return tags;
};

const ingredientData = {
  ingredients: ["mąka", "mleko", "jajka"],
  units: ["g", "ml", "szklanka", "szt"],
  conversionRates: {
    mąka: [
      {
        from: "szklanka",
        to: "g",
        rate: 160,
      },
    ],
    mleko: [
      {
        from: "ml",
        to: "szklanka",
        rate: 0.04,
      },
      { from: "szklanka", to: "g", rate: 240 },
    ],
  },
};

export const mockIngredientData = async () => {
  // possibly multiple requests, for all units, for all ingredients, and for all conversion rates
  const ingredient = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(ingredientData);
    }, 1000);
  });

  return ingredient;
};

export const getAllIngredients = async () => {
  return await Promise.resolve([
    { name: "mąka", id: 1 },
    { name: "mleko", id: 2 },
    { name: "jajko", id: 3 },
    { name: "woda", id: 4 },
    { name: "cukier", id: 5 },
  ]);
};

export const sendNewIngredient = async (name) => {
  const response = await sendPostRequest("/ingredients/", { name });
  const newIngredient = await response.json();
  return { ...newIngredient, id: Math.floor(Math.random() * 10000) };
};

export const deleteIngredient = async () => {
  const success = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });

  return success;
};

export const sendNewUnit = async () => {
  const success = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });

  return success;
};

export const deleteUnit = async () => {
  const success = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });

  return success;
};

export const sendNewConversion = async () => {
  const success = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });

  return success;
};

export const deleteConversion = async () => {
  const success = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });

  return success;
};

export const sendNewTag = async (name) => {
  const response = await sendPostRequest("/tags/post", { name });
  return await response.json();
};
