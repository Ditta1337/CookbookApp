import React from "react";
import "./UnitSelector.css";

const UnitSelector = ({ units, selectedUnit, setUnit, index }) => {
    const handleChange = (event) => {
        const newUnit = event.target.value;
        setUnit(index, newUnit);
    };

    return (
        <div className="unit-selector">
            <select
                className="select"
                value={selectedUnit}
                onChange={handleChange}
            >
                {Object.entries(units).map(([type, unitList]) => (
                    <optgroup key={type} label={type}>
                        {unitList.map((unit) => (
                            <option key={unit} value={unit}>
                                {unit}
                            </option>
                        ))}
                    </optgroup>
                ))}
            </select>
        </div>
    );
};

export default UnitSelector;