import React, { useState } from "react";
import Navbar from "../components/Navbar";
import TwoColumns from "../components/TwoColumns";
import { useIngredientsData } from "../../utils/useIngredientsData";
import "./IngredientCreator.css";
import {
  sendNewIngredient,
  deleteIngredient,
  sendNewUnit,
  deleteUnit,
  sendNewConversion,
  deleteConversion,
} from "../../utils/network";

const IngredientCreator = () => {
  const {
    ingredients,
    addIngredient,
    removeIngredient,
    units,
    addUnit,
    removeUnit,
    conversionRates,
    removeConversionRate,
    addConversionRate,
  } = useIngredientsData();

  const [newIngredient, setNewIngredient] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [newConversionIngredient, setNewConversionIngredient] = useState("wybierz...");
  const [newConversionFrom, setNewConversionFrom] = useState("wybierz...");
  const [newConversionTo, setNewConversionTo] = useState("wybierz...");
  const [newConversionRate, setNewConversionRate] = useState(0);
  const [quantity, setQuantity] = useState(100);
  const [requestPending, setRequestPending] = useState(false);

  const handleAddIngredient = async () => {
    setRequestPending(true);
    const response = await sendNewIngredient(newIngredient);
    addIngredient(response);
    alert(response.name);
    setNewIngredient("");
    setRequestPending(false);
  };

  const handleDeleteIngredient = async (id) => {
    setRequestPending(true);
    const response = await deleteIngredient(id);
    removeIngredient(id);
    alert(response);
    setRequestPending(false);
  };

  const handleAddUnit = async () => {
    setRequestPending(true);
    const response = await sendNewUnit(newUnit);
    addUnit(response);
    alert(response.name);
    setNewUnit("");
    setRequestPending(false);
  };

  const handleDeleteUnit = async (id) => {
    setRequestPending(true);
    const response = await deleteUnit(id);
    removeUnit(id);
    alert(response.message);
    setRequestPending(false);
  };

  const handleAddConversion = async () => {
    const newConversion = {
      ingredient_id: Number(newConversionIngredient),
      from_unit_id: Number(newConversionFrom),
      to_unit_id: Number(newConversionTo),
      multiplier: newConversionRate,
    };

    setRequestPending(true);
    const response = await sendNewConversion(newConversion);
    addConversionRate(response);
    alert("sukces");
    setNewConversionIngredient("wybierz...");
    setNewConversionFrom("wybierz...");
    setNewConversionTo("wybierz...");
    setNewConversionRate(0);
    setRequestPending(false);
  };

  const handleDeleteConversionRate = async (conversion) => {
    setRequestPending(true);
    const response = await deleteConversion(conversion);
    removeConversionRate(conversion);
    alert(response.message);
    setRequestPending(false);
  };

  const display =
    newConversionIngredient != "wybierz..." &&
    newConversionFrom != "wybierz..." &&
    newConversionTo != "wybierz..." &&
    newConversionRate != 0
      ? "block"
      : "none";

  return (
    <div>
      <Navbar />
      <TwoColumns
        left={
          <>
            <div className="creator-list ingredient-list">
              {ingredients.map(({ id, name }) => (
                <div key={id}>
                  <h2>{name}</h2>
                  <button onClick={() => handleDeleteIngredient(id)}>X</button>
                </div>
              ))}
              <div>
                <input
                  type="text"
                  value={newIngredient}
                  onKeyDown={({ code }) =>
                    code === "Enter" && !requestPending ? handleAddIngredient() : null
                  }
                  onInput={(e) => setNewIngredient(e.target.value)}
                />
                <button
                  disabled={requestPending}
                  onClick={handleAddIngredient}
                  className={requestPending ? "cursor-not-allowed! opacity-50" : ""}
                >
                  Dodaj składnik
                </button>
              </div>
            </div>
            <div className="creator-list unit-list">
              {units.map(({ id, name }) => (
                <div key={id}>
                  <h2>{name}</h2>
                  <button onClick={() => handleDeleteUnit(id)}>X</button>
                </div>
              ))}
              <div>
                <input
                  type="text"
                  value={newUnit}
                  onKeyDown={({ code }) =>
                    code === "Enter" && !requestPending ? handleAddUnit() : null
                  }
                  onInput={(e) => setNewUnit(e.target.value)}
                />
                <button
                  disabled={requestPending}
                  onClick={handleAddUnit}
                  className={requestPending ? "cursor-not-allowed! opacity-50" : ""}
                >
                  Dodaj jednostkę
                </button>
              </div>
            </div>
          </>
        }
        right={
          <div className="conversion-panel">
            <div className="conversion-display">
              {conversionRates.map(({ ingredient, from, to, rate }) => (
                <div key={`${ingredient}${from}${to}${rate}`}>
                  <button
                    className="text-[12px]!"
                    onClick={() =>
                      handleDeleteConversionRate({
                        ingredient,
                        from,
                        to,
                        rate,
                      })
                    }
                  >
                    X
                  </button>
                  <p className="flex align-center inline-block h-full">
                    {ingredients.find(({ id }) => id == ingredient).name} 1{" "}
                    {units.find(({ id }) => id == from).name} = {rate}{" "}
                    {units.find(({ id }) => id == to).name}
                  </p>
                </div>
              ))}
            </div>
            <div className="conversion-creator">
              <div>
                Dla składnika
                <select
                  value={newConversionIngredient}
                  onChange={(e) => setNewConversionIngredient(e.target.value)}
                >
                  <option>wybierz...</option>
                  {ingredients.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                przelicz z
                <select
                  value={newConversionFrom}
                  onChange={(e) => setNewConversionFrom(e.target.value)}
                >
                  <option>wybierz...</option>
                  {units.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                przelicz na
                <select
                  value={newConversionTo}
                  onChange={(e) => setNewConversionTo(e.target.value)}
                >
                  <option>wybierz...</option>
                  {units
                    .filter(({ name }) => name != newConversionFrom)
                    .map(({ id, name }) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                w stosunku{" "}
                <input
                  type="number"
                  value={newConversionRate}
                  onChange={(e) => setNewConversionRate(Math.max(0, e.target.value))}
                />
              </div>
            </div>
            {display === "block" && (
              <p style={{ display }}>
                Obecna konfiguracja:{" "}
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0, e.target.value))}
                />{" "}
                {units.find(({ id }) => id == newConversionFrom).name}{" "}
                {ingredients.find(({ id }) => id == newConversionIngredient).name} ={" "}
                {quantity * newConversionRate} {units.find(({ id }) => id == newConversionTo).name}{" "}
                {ingredients.find(({ id }) => id == newConversionIngredient).name}
                <br />
                <button
                  disabled={requestPending}
                  onClick={handleAddConversion}
                  className={requestPending ? "cursor-not-allowed! opacity-50" : ""}
                >
                  Dodaj przelicznik
                </button>
              </p>
            )}
          </div>
        }
        leftSize={50}
      />
    </div>
  );
};

export default IngredientCreator;
