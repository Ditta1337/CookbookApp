import React, {useState, useEffect} from "react";
import "./UnitSelector.css";

const UnitSelector = ({ingredientId, selectedUnitName, onChangeUnit}) => {
    const [allUnits, setAllUnits] = useState([]);

    useEffect(() => {
        if (!ingredientId) {
            setAllUnits([]);
            return;
        }

        const fetchMainUnit = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8000/api/units/name/${encodeURIComponent(
                        selectedUnitName
                    )}`
                );
                if (!res.ok) {
                    setAllUnits([]);
                    return;
                }
                const data = await res.json();
                setAllUnits((prevUnits) => {
                    const isUnique = !prevUnits.some((existingUnit) => existingUnit.id === data.id);
                    return isUnique ? [...prevUnits, data] : prevUnits;
                });
            } catch {
                setAllUnits([]);
            }
        };

        const fetchUnits = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8000/api/ingredients/${encodeURIComponent(
                        ingredientId
                    )}/units/`
                );
                if (!res.ok) {
                    setAllUnits([]);
                    return;
                }
                const data = await res.json();
                if (data.length !== 0) {
                    setAllUnits((prevUnits) => {
                        const uniqueData = data.filter(
                            (newUnit) => !prevUnits.some((existingUnit) => existingUnit.id === newUnit.id)
                        );
                        return [...prevUnits, ...uniqueData];
                    });
                }
            } catch {
                setAllUnits([]);
            }
        };

        fetchMainUnit();
        fetchUnits();
    }, [ingredientId]);

    const oldUnitObj = allUnits.find((u) => u.name === selectedUnitName) || null;
    const oldUnitId = oldUnitObj ? oldUnitObj.id : null;

    const handleSelect = (e) => {
        const newId = Number(e.target.value);
        if (isNaN(newId)) return;

        console.log(allUnits)

        const newObj = allUnits.find((u) => u.id === newId);
        const newName = newObj ? newObj.name : String(newId);

        if (oldUnitId === newId) return;

        onChangeUnit({
            oldUnitId: oldUnitId,
            newUnitId: newId,
            newUnitName: newName,
        });
    };

    return (
        <div className="unit-selector">
            <select
                className="select"
                value={oldUnitId !== null ? oldUnitId : ""}
                onChange={handleSelect}
            >
                {allUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                        {u.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default UnitSelector;
