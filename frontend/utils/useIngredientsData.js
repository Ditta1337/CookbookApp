import { useState, useEffect } from "react";
import { getAllIngredientData } from "./network";

export const useIngredientsData = () => {
  const [ingredientsData, setIngredientsData] = useState({
    ingredients: [{ id: 0, name: "Ładowanie" }],
    units: [{ id: 0, name: "Ładowanie" }],
    conversionRates: [{ ingredient: 0, from: 0, to: 0, rate: 0 }],
  });

  useEffect(() => {
    async function fetchIngredientsData() {
      const ingredientData = await getAllIngredientData();
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
    removeIngredient: (iid) =>
      setIngredientsData((data) => ({
        ...data,
        ingredients: data.ingredients.filter(({ id }) => id != iid),
      })),
    addUnit: (newUnit) =>
      setIngredientsData((data) => ({
        ...data,
        units: [...data.units, newUnit],
      })),
    removeUnit: (uid) =>
      setIngredientsData((data) => ({
        ...data,
        units: data.units.filter(({ id }) => id != uid),
      })),
    addConversionRate: (newConversionRate) =>
      setIngredientsData((data) => ({
        ...data,
        conversionRates: [...data.conversionRates, newConversionRate],
      })),
    removeConversionRate: (conversionRate) => {
      const { ingredient, from, to, rate } = conversionRate;
      setIngredientsData((data) => ({
        ...data,
        conversionRates: data.conversionRates.filter(
          (cr) => cr.ingredient != ingredient && cr.from != from && cr.to != to && cr.rate != rate
        ),
      }));
    },
  };
};
