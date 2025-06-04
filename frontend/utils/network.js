const sendPostRequest = (endpoint, body) => {
  endpoint = endpoint[0] !== "/" ? endpoint : endpoint.substr(1);
  return fetch(`http://localhost:8000/api/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
};

const sendDeleteRequest = (endpoint) => {
  endpoint = endpoint[0] !== "/" ? endpoint : endpoint.substr(1);
  return fetch(`http://localhost:8000/${endpoint}`, {
    method: "DELETE",
  });
};

export const getRecipeData = async (recipeId) => {
  const res = await fetch(`http://localhost:8000/api/recipes/${recipeId}`);
  return await res.json();
};

export const getFilteredRecipes = async (searchTerm, tagList) => {
  console.warn(
    `Searching recipe '${searchTerm}' with tags ${tagList}, but endpoint /recipes/all is called. Need to implement that.`
  );
  try {
    const argumentsList = [...tagList.map((tag) => tag.name)].filter(
      (arg) => arg && arg.trim() !== ""
    );
    let response;
    // Jeśli lista argumentów jest pusta, użyj GET /recipes/all
    if (argumentsList.length === 0 && searchTerm.trim() === "") {
      console.log("Brak kryteriów — pobieranie wszystkich przepisów.");
      response = await fetch("http://localhost:8000/api/recipes/all");
    }
    else{
      console.log("Szukane argumenty:", argumentsList);
        response = await fetch(`http://localhost:8000/api/recipes/search/100?name=${searchTerm}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(argumentsList),
    });
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Błąd odpowiedzi:", errorData);
      return [[], true];
    }
    const data = await response.json();
    return [data, false];
  } catch (error) {
    console.error("Błąd podczas pobierania przepisów:", error);
    return [[], true];
  }
};

export const getAllRecipes = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/recipes/all");
    const data = await response.json();
    return [data, false];
  } catch (error) {
    console.error("Błąd podczas pobierania przepisów:", error);
    return [[], true];
  }
};

export const getAllTags = async () => {
  const response = await fetch("http://localhost:8000/api/tags/get_all");
  const tags = await response.json();
  return tags;
};

export const getAllKitchenAppliances = async () => {
  const response = await fetch("http://localhost:8000/api/tags/get_all");
  if (!response.ok) throw new Error("Failed to fetch appliances");
  const tags = await response.json();
  return tags; // expects an array of { id, name } objects
};

export const getAllIngredientData = async () => {
  const ingredientsResponse = await fetch("http://localhost:8000/ingredients/");
  const unitsResponse = await fetch("http://localhost:8000/units/");
  const conversionsResponse = await fetch("http://localhost:8000/ingredient_unit_conversions/");

  const ingredients = await ingredientsResponse.json();
  const units = await unitsResponse.json();
  const conversionRates = await conversionsResponse.json();

  return {
    ingredients: ingredients,
    units: units,
    conversionRates: conversionRates.map(
      ({ ingredient_id, from_unit_id, to_unit_id, multiplier }) => ({
        ingredient: ingredient_id,
        from: from_unit_id,
        to: to_unit_id,
        rate: multiplier,
      })
    ),
  };
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

export const deleteIngredient = async (id) => {
  // not implement on backend
  const success = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });

  return success;
};

export const sendNewUnit = async (name) => {
  const response = await sendPostRequest("/units/", { name, id: -1 });
  return await response.json();
};

export const deleteUnit = async (id) => {
  const response = await sendDeleteRequest(`/units/${id}`);
  return await response.json();
};

export const sendNewConversion = async (payload) => {
  const response = await sendPostRequest("/ingredient_unit_conversions/", payload);
  const newConversion = await response.json();
  return {
    ingredient: newConversion.ingredient_id,
    from: newConversion.from_unit_id,
    to: newConversion.to_unit_id,
    rate: newConversion.multiplier,
  };
};

export const deleteConversion = async ({ ingredient, from, to }) => {
  const response = await sendDeleteRequest(
    `/ingredient_unit_conversions/${ingredient}/${from}/${to}`
  );
  return await response.json();
};

export const sendNewTag = async (name) => {
  const response = await sendPostRequest("/api/tags/post", { name });
  return await response.json();
};

export const sendRecipeURL = async (url) => {
  const response = await sendPostRequest(`/api/recipes/from_website?website_url=${url}`);
  const { id } = await response.json();
  return id;
};

export const sendRecipesFile = async (file) => {
  let formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:8000/recipes/load_file", {
    method: "POST",
    body: formData,
  });

  return await response.json();
};
