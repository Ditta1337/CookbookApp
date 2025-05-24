// mock na potrzeby developmentu
const recipeData = {
  id: 0,
  title: "Nalesniki",
  description: "Przepyszne nalesniki z dzemem albo czymkolwiek innym co uwazasz za smaczne",
  tags: [
    "na słodko",
    "wegetariańskie",
    "kolejny tag",
    "test",
    "dużo tagów",
    "kolorowo",
    "naleśniczki",
  ],
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
};

export const mockRecipeData = async (recipeId) => {
  const recipe = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: recipeId, ...recipeData });
    }, 1000);
  });

  return recipe;
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

export const sendNewIngredient = async () => {
  const success = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });

  return success;
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
