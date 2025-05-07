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
    addIngredient(newIngredient);
    alert(response);
    setNewIngredient("");
    setRequestPending(false);
  };

  const handleDeleteIngredient = async (ingredient) => {
    setRequestPending(true);
    const response = await deleteIngredient(ingredient);
    removeIngredient(ingredient);
    alert(response);
    setRequestPending(false);
  };

  const handleAddUnit = async () => {
    setRequestPending(true);
    const response = await sendNewUnit(newUnit);
    addUnit(newUnit);
    alert(response);
    setNewUnit("");
    setRequestPending(false);
  };

  const handleDeleteUnit = async (unit) => {
    setRequestPending(true);
    const response = await deleteUnit(unit);
    removeUnit(unit);
    alert(response);
    setRequestPending(false);
  };

  const handleAddConversion = async () => {
    const newConversion = {
      ingredient: newConversionIngredient,
      from: newConversionFrom,
      to: newConversionTo,
      rate: newConversionRate,
    };

    setRequestPending(true);
    const response = await sendNewConversion(newConversion);
    addConversionRate(newConversion);
    alert(response);
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
    alert(response);
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
              {ingredients.map((ingr) => (
                <div key={ingr}>
                  <h2>{ingr}</h2>
                  <button onClick={() => handleDeleteIngredient(ingr)}>X</button>
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
              {units.map((unit) => (
                <div key={unit}>
                  <h2>{unit}</h2>
                  <button onClick={() => handleDeleteUnit(unit)}>X</button>
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
              {Object.keys(conversionRates).map((key) => (
                <details key={key}>
                  <summary>{key}</summary>
                  {conversionRates[key].map(({ from, to, rate }) => (
                    <div key={`${from}${to}${rate}`}>
                      <button
                        className="text-[12px]!"
                        onClick={() =>
                          handleDeleteConversionRate({
                            ingredient: key,
                            from,
                            to,
                            rate,
                          })
                        }
                      >
                        X
                      </button>
                      <p className="flex align-center inline-block h-full">
                        1 {from} = {rate} {to}
                      </p>
                    </div>
                  ))}
                </details>
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
                  {ingredients.map((ingr) => (
                    <option key={ingr}>{ingr}</option>
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
                  {units.map((unit) => (
                    <option key={unit}>{unit}</option>
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
                    .filter((unit) => unit != newConversionFrom)
                    .map((unit) => (
                      <option key={unit}>{unit}</option>
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
            <p style={{ display }}>
              Obecna konfiguracja:{" "}
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, e.target.value))}
              />{" "}
              {newConversionFrom} {newConversionIngredient} = {quantity * newConversionRate}{" "}
              {newConversionTo} {newConversionIngredient}
              <br />
              <button
                disabled={requestPending}
                onClick={handleAddConversion}
                className={requestPending ? "cursor-not-allowed! opacity-50" : ""}
              >
                Dodaj przelicznik
              </button>
            </p>
          </div>
        }
        leftSize={50}
      />
    </div>
  );
};

export default IngredientCreator;
