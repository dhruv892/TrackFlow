import React from "react";

function Search() {
  return (
    <div className="p-2">
      <input
        type="text"
        placeholder="Search..."
        className="w-full rounded-md border border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-inherit p-2"
      />
    </div>
  );
}

export default Search;
