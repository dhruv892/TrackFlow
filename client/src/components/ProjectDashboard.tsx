import React, { useState } from "react";
import Board from "./Board";

function ProjectDashboard() {
  const [summaryToggle, setSummaryToggle] = useState(false);
  const [listToggle, setListToggle] = useState(false);
  const [boardToggle, setBoardToggle] = useState(true);

  return (
    <div className="pl-2">
      <div>
        <h1 className="text-2xl font-bold">Project Name</h1>
        {/* <p className="text-sm text-gray-400">Description of the project</p> */}
      </div>
      <div className="flex">
        {summaryToggle ? (
          <h4 className="text-white">Summary</h4>
        ) : (
          <h4 className="text-gray-500">Summary</h4>
        )}
        {listToggle ? (
          <h4 className="text-white ml-2">List</h4>
        ) : (
          <h4 className="text-gray-500 ml-2">List</h4>
        )}
        {boardToggle ? (
          <h4 className="text-white ml-2">Board</h4>
        ) : (
          <h4 className="text-gray-500 ml-2">Board</h4>
        )}
      </div>
      {boardToggle && (
        <div>
          <Board />
        </div>
      )}
    </div>
  );
}

export default ProjectDashboard;
