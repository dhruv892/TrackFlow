import React from "react";
import BugCard from "./BugCard";
import { Plus } from "lucide-react";
import type { Bug } from "../../types/types";

interface StatusColumnProps {
  status: { key: string; label: string; color: string };
  bugs: Bug[];
  onAddBug: (status: string) => void;
  onEditBug: (bug: Bug) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: string) => void;
  onDragStart: (e: React.DragEvent, bug: Bug) => void;
}

function StatusCard({
  status,
  bugs,
  onAddBug,
  onEditBug,
  onDragOver,
  onDrop,
  onDragStart,
}: StatusColumnProps) {
  return (
    <div
      className="border border-gray-700 bg-gray-800 p-4 w-72 flex-shrink-0 flex flex-col rounded-md"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status.key)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${status.color}`}></div>
          <h2 className="text-lg font-semibold text-white">{status.label}</h2>
          <span className="text-sm text-gray-400">({bugs.length})</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {bugs.map((bug) => (
          <BugCard
            key={bug.id}
            bug={bug}
            onEdit={onEditBug}
            onDragStart={onDragStart}
          />
        ))}
      </div>

      <button
        onClick={() => onAddBug(status.key)}
        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mt-2 p-2 rounded hover:bg-gray-700"
      >
        <Plus className="w-5 h-5" />
        <span className="text-sm">Add Bug</span>
      </button>
    </div>
  );
}

export default StatusCard;
