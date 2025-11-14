import React, { useState } from "react";
import Board from "./board/Board";
import List from "./list/List";
import { useProjectStoreState } from "../store/ui";
import { UserPlus } from "lucide-react";
import AddUserToProjectModal from "./AddUserToProjectModal";
import { useProjectStore } from "../store/project";

function ProjectDashboard() {
  const [view, setView] = useState("board"); // "board" or "list"

  const projectName = useProjectStoreState((state) => state.currentProjectName);

  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // const [showAllProjectMembers, setShowAllProjectMembers] = useState(false);

  const addUsertoProject = useProjectStore((state) => state.addUserToProject);

  const handleAddUser = async (email: string) => {
    const projectId = useProjectStoreState.getState().currentProjectId;
    if (!projectId) {
      return false; // MUST return boolean
    }

    const ok = await addUsertoProject(projectId, email);
    return ok === true;
  };

  // const handleShowAllProjectMembers = () => {

  // }

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

        <div className="flex ml-auto">
          <UserPlus
            className="w-5 h-5 ml-auto text-gray-500 hover:text-white cursor-pointer mr-2"
            onClick={() => setShowAddUserModal(true)}
          />
          {/* <ChevronDown className="w-5 h-5 ml-auto text-gray-500 hover:text-white cursor-pointer mr-2" /> */}
        </div>
      </nav>

      <main className="flex-1 overflow-auto scrollbar-hide">
        {view === "board" && <Board />}
        {view === "list" && <List />}
      </main>

      {showAddUserModal && (
        <AddUserToProjectModal
          onClose={() => setShowAddUserModal(false)}
          onAdd={handleAddUser}
        />
      )}
    </div>
  );
}

export default ProjectDashboard;
