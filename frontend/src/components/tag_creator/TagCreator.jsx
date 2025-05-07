import React, { useState } from "react";
import "./TagCreator.css";

const TagCreator = ({ tags, setTags }) => {
    const [tagString, setTagString] = useState(tags.join(", "));
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        const updatedTags = tagString.split(",").map(tag => tag.trim()).filter(tag => tag !== "");
        setTags(updatedTags);
        setIsEditing(false);
    };

    return (
        <div className="tag-creator">
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        value={tagString}
                        onChange={(e) => setTagString(e.target.value)}
                        className="tag-input"
                    />
                    <button onClick={handleSave} className="save">Save</button>
                </div>
            ) : (
                <div>
                    <span className="tag-display">{tags.join(", ")}</span>
                    <button onClick={() => setIsEditing(true)} className="edit">Edit</button>
                </div>
            )}
        </div>
    );
};

export default TagCreator;