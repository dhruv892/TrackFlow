import React from "react";
import StatusCard from "./StatusCard";
import { Plus } from "lucide-react";

function Board() {
  return (
    <div className="flex gap-4 overflow-x-auto py-2 content-center items-center">
      <StatusCard status="To Do" />
      <StatusCard status="In Progress" />
      <StatusCard status="Completed" />
      <Plus className="w-10 h-10 text-gray-500 hover:text-white cursor-pointer" />
    </div>
  );
}

export default Board;
