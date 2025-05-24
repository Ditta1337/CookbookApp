import { WithContext as ReactTags } from "react-tag-input";

export const TagSelector = ({ selectedTags, availableTags, onAdd, onDelete, noCreateNew }) => {
  return (
    <ReactTags
      tags={selectedTags}
      suggestions={availableTags}
      handleAddition={onAdd}
      handleDelete={onDelete}
      placeholder="Wyszukaj..."
      separators={noCreateNew ? [] : ["Enter", "Tab"]}
      labelField="name"
      inputFieldPosition="bottom"
      allowDragDrop={false}
      classNames={{
        tagInputField: "py-2 px-2 my-4 mx-2 font-semibold border-gray-300 border-2 rounded-md",
        tag: "py-2 px-2 my-4 mx-2 font-semibold border-gray-300 border-2 rounded-md",
        remove: "p-[8px]! ml-2 bg-red-800!",
        suggestions: "py-2 px-2 font-semibold border-gray-300 border-1 rounded-md",
        activeSuggestion: "py-2 px-2 font-semibold border-blue-300 border-1 rounded-md",
      }}
    />
  );
};
