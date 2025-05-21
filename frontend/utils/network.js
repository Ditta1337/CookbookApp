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
  const recipes = await new Promise((resolve) => {
    setTimeout(() => {
      // simulate less recipes when more filters are applied
      const responseLength = Math.max(0, 15 - searchTerm.length - 3 * tagList.length);
      resolve([...Array(responseLength).keys()].map((id) => ({ ...recipeData, id })));
    }, 1000);
  });

  return recipes;
};

export const getAllTags = async () => {
  // this should work but some CORS error is thrown
  // const response = await fetch("http://localhost:8000/tags/get_all");
  // const tags = await response.json();
  // return tags;

  const tags = await new Promise((resolve) => {
    setTimeout(
      () =>
        resolve([
          {
            name: "string",
            id: 1,
          },
          {
            name: "ogorek",
            id: 2,
          },
          {
            name: "kapusta",
            id: 3,
          },
          {
            name: "burak",
            id: 4,
          },
          {
            name: "string2",
            id: 5,
          },
          {
            name: "string3",
            id: 6,
          },
        ]),
      1000
    );
  });

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
