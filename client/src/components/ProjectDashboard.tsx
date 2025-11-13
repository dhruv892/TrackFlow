import React, { useState } from "react";
import Board from "./board/Board";
import List from "./list/List";
import { useProjectStoreState } from "../store/ui";

function ProjectDashboard() {
  const [view, setView] = useState("board"); // "board" or "list"

  const projectName = useProjectStoreState((state) => state.currentProjectName);

  return (
    <div className="pl-2 mt-2 overflow-hidden w-full flex flex-col">
      <header>
        <h1 className="text-2xl font-bold">
          {projectName || "Project Dashboard"}
        </h1>
        {/* <p className="text-sm text-gray-400">Description of the project</p> */}
      </header>

      <nav className="flex gap-3 mt-2">
        <button
          onClick={() => setView("list")}
          className={`ml-2 ${
            view === "list" ? "text-white" : "text-gray-500 hover:text-white"
          }`}
        >
          List
        </button>
        <button
          onClick={() => setView("board")}
          className={`ml-2 ${
            view === "board" ? "text-white" : "text-gray-500 hover:text-white"
          }`}
        >
          Board
        </button>
      </nav>

      <main className="flex-1 overflow-auto scrollbar-hide">
        {view === "board" && <Board />}
        {view === "list" && <List />}
      </main>
    </div>
  );
}

export default ProjectDashboard;
