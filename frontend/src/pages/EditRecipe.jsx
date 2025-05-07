import React, {useState, useEffect} from "react";
import Navbar from "../components/Navbar";
import {useParams} from "react-router-dom";
import {useRecipeData} from "../../utils/useRecipeData";
import TagCreator from "../components/tag_creator/TagCreator.jsx";
import {mockModifyTags} from "../../utils/network.js";

const EditRecipe = () => {
    let {id} = useParams();

    const {title, description, steps, ingredients, tags} = useRecipeData(id);
    const [tagsState, setTagsState] = useState(null);

    useEffect(() => {
        if (tags) {
            setTagsState(tags);
        }
    }, [tags]);

    const handleSetTags = (newTags) => {
        setTagsState(newTags);
        mockModifyTags(1, newTags).then();
    };

    if (!tags) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar/>
            <div>
                <h1>Edit Recipe</h1>
                <div>
                    {tagsState != null && <TagCreator tags={tagsState} setTags={handleSetTags}/>}
                </div>
            </div>
        </div>
    );
};

export default EditRecipe;