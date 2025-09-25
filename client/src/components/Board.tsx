import React from "react";
import StatusCard from "./StatusCard";
import { Plus } from "lucide-react";

// import { BugStatus } from "../types/types";

// const status: BugStatus[] = ["To Do", "In Progress", "Completed"];

// const status: BugStatus[] = ["open", "working", "closed"];

function Board() {
  return (
    <div className="flex gap-4 overflow-x-auto py-2 items-center text-gray-300">
      <StatusCard status="To Do" />
      <StatusCard status="In Progress" />
      <StatusCard status="Completed" />
      <Plus className="w-10 h-10 text-gray-500 hover:text-white cursor-pointer" />
    </div>
  );
}

export default Board;
