import { Calendar, Ellipsis } from "lucide-react";
import React from "react";
import type { Bug } from "../../types/types";

// type BugCardProps = { bug: Bug };
interface BugCardProps {
  bug: Bug;
  onEdit: (bug: Bug) => void;
  onDragStart: (e: React.DragEvent, bug: Bug) => void;
}

function BugCard({ bug, onEdit, onDragStart }: BugCardProps) {
  const priorityColors = {
    low: "bg-gray-600",
    medium: "bg-blue-600",
    high: "bg-orange-600",
    top: "bg-red-600",
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, bug)}
      className="rounded-md border-2 border-gray-700  bg-gray-900 p-3 mb-3 cursor-move hover:border-gray-600 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-white flex-1 text-left">
          {bug.title}
        </h4>
        <button
          onClick={() => onEdit(bug)}
          className="text-gray-500 hover:text-white transition-colors"
        >
          <Ellipsis className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>
            {bug.createdAt
              ? new Date(bug.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              : "—"}
          </span>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-xs ${
            priorityColors[bug.priority as keyof typeof priorityColors] ||
            "bg-gray-600"
          }`}
        >
          {bug.priority}
        </span>
      </div>
    </div>
  );
}

export default BugCard;
