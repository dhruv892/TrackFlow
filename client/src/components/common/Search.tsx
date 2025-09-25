import React from "react";

function Search() {
  return (
    <div className="p-2">
      <input
        type="text"
        placeholder="Search..."
        className="w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-inherit"
      />
    </div>
  );
}

export default Search;
