import React, { useState } from "react";
import Board from "./board/Board";
import List from "./list/List";

function ProjectDashboard() {
  const [view, setView] = useState("board"); // "board" or "list"

  return (
    <div className="pl-2">
      <header>
        <h1 className="text-2xl font-bold">Project Name</h1>
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

      <main className="mt-3">
        {view === "board" && (
          <div>
            <Board />
          </div>
        )}
        {view === "list" && (
          <div>
            <List />
          </div>
        )}
      </main>
    </div>
  );
}

export default ProjectDashboard;
