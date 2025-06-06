import React, {useState, useEffect, useRef} from "react";
import {getAllKitchenAppliances} from "../../utils/network";

export const AppliancesSelector = ({onAdd}) => {
    const [allAppliances, setAllAppliances] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        getAllKitchenAppliances()
            .then((tagsFromDb) => {
                if (isMounted) {
                    setAllAppliances(tagsFromDb);
                }
            })
            .catch((err) => {
                console.error("Error fetching appliance tags:", err);
            });
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    const handleSelectAppliance = (appliance) => {
        onAdd({id: String(appliance.id), name: appliance.name});
        setShowDropdown(false);
    };

    return (
        <div className="relative inline-block w-full">
            <button
                type="button"
                className="mb-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                onClick={() => setShowDropdown((prev) => !prev)}
            >
                Wybierz sprzęt kuchenny
            </button>

            {showDropdown && (
                <div
                    ref={dropdownRef}
                    className="absolute z-20 mt-1 w-64 max-h-60 overflow-auto border border-gray-300 rounded-md shadow-lg"
                    style={{backgroundColor: "rgba(77, 77, 77, 0.95)"}}
                >
                    {allAppliances.length === 0 ? (
                        <div className="p-2 text-gray-500">Brak urządzeń</div>
                    ) : (
                        <ul>
                            {allAppliances.map((appliance) => (
                                <li
                                    key={appliance.id}
                                    className="px-3 py-2 hover:bg-gray-500 cursor-pointer"
                                    onClick={() => handleSelectAppliance(appliance)}
                                >
                                    {appliance.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};


export default AppliancesSelector;