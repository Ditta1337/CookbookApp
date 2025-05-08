import { useState, useEffect } from "react";
import { mockIngredientData } from "./network";

export const useIngredientsData = () => {
  const [ingredientsData, setIngredientsData] = useState({
    ingredients: ["Ładowanie"],
    units: ["Ładowanie"],
    conversionRates: { Ładowanie: [{ from: "Ładowanie", to: "Ładowanie", rate: "Ładowanie" }] },
  });

  useEffect(() => {
    async function fetchIngredientsData() {
      const ingredientData = await mockIngredientData();
      setIngredientsData(ingredientData);
    }

    fetchIngredientsData();
  }, []);

  return {
    ...ingredientsData,
    addIngredient: (newIngredient) =>
      setIngredientsData((data) => ({
        ...data,
        ingredients: [...data.ingredients, newIngredient],
      })),
    removeIngredient: (ingredient) =>
      setIngredientsData((data) => ({
        ...data,
        ingredients: data.ingredients.filter((ingr) => ingr != ingredient),
      })),
    addUnit: (newUnit) =>
      setIngredientsData((data) => ({
        ...data,
        units: [...data.units, newUnit],
      })),
    removeUnit: (unit) =>
      setIngredientsData((data) => ({
        ...data,
        units: data.units.filter((u) => u != unit),
      })),
    addConversionRate: (newConversionRate) => {
      const { ingredient, from, to, rate } = newConversionRate;
      setIngredientsData((data) => ({
        ...data,
        conversionRates: {
          ...data.conversionRates,
          [ingredient]: [...data.conversionRates[ingredient], { from, to, rate }],
        },
      }));
    },
    removeConversionRate: (conversionRate) => {
      const { ingredient, from, to, rate } = conversionRate;
      setIngredientsData((data) => ({
        ...data,
        conversionRates: {
          ...data.conversionRates,
          [ingredient]: data.conversionRates[ingredient].filter(
            (cr) => cr.from != from && cr.to != to && cr.rate != rate
          ),
        },
      }));
    },
  };
};
