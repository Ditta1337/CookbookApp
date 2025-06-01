import React, { useState, useEffect, useRef } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import { getAllKitchenAppliances } from "../../utils/network";

export const TagSelector = ({
                                selectedTags,
                                availableTags,
                                onAdd,
                                onDelete,
                                noCreateNew,
                            }) => {
    const [allAppliances, setAllAppliances] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        let isMounted = true;
        getAllKitchenAppliances()
            .then((tagsFromDb) => {
                if (isMounted) {
                    // spodziewamy się formatu: [ { id, name }, … ]
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
        onAdd({ id: String(appliance.id), name: appliance.name });
        setShowDropdown(false);
    };

    return (
        <div className="relative inline-block w-full">
            <ReactTags
                tags={selectedTags}
                suggestions={availableTags}
                handleAddition={onAdd}
                handleDelete={onDelete}
                placeholder="Wyszukaj tag..."
                separators={noCreateNew ? [] : ["Enter", "Tab"]}
                labelField="name"
                inputFieldPosition="bottom"
                allowDragDrop={false}
                classNames={{
                    tagInputField:
                        "py-2 px-2 my-4 mx-2 font-semibold border-gray-300 border-2 rounded-md",
                    tag: "py-2 px-2 my-1 mx-1 font-semibold border-gray-300 border-2 rounded-md",
                    remove: "p-[8px]! ml-2 bg-red-800!",
                    selected: "flex justify-center flex-wrap",
                    suggestions:
                        "py-2 px-2 font-semibold border-gray-300 border-1 rounded-md",
                    activeSuggestion:
                        "py-2 px-2 font-semibold border-blue-300 border-1 rounded-md",
                }}
            />
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
                    style={{ backgroundColor: "rgba(77, 77, 77, 0.95)" }}
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
