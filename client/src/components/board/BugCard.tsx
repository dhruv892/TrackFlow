import { Calendar, Ellipsis } from "lucide-react";
import React, { useState } from "react";
import type { Bug } from "../../types/types";
import AssigneeBadgeStack from "./AssigneeBadgeStack";
import { useBugStore } from "../../store/bugs";
import { AssigneeModal } from "./AssigneeModal";

const priorityColors = {
  low: "bg-gray-900",
  medium: "bg-blue-900",
  high: "bg-orange-900",
  top: "bg-red-900",
} as const;

const formatDate = (date?: string) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

interface BugCardProps {
  bug: Bug;
  onEdit: (bug: Bug) => void;
  onDragStart: (e: React.DragEvent, bug: Bug) => void;
}

function BugCard({ bug, onEdit, onDragStart }: BugCardProps) {
  const [openBug, setOpenBug] = useState<Bug | null>(null);

  const assignUsersToBug = useBugStore((state) => state.assignUsersToBug);
  const removeAssignedUsers = useBugStore((state) => state.removeAssignedUsers);
  // const searchUsersInProject = useBugStore(
  //   (state) => state.searchUsersInProject
  // );

  const handleAddAssignee = async (bugId: number, userIds: number[]) => {
    await assignUsersToBug(bugId, userIds);
  };

  const handleRemoveAssignee = async (bugId: number, userIds: number[]) => {
    await removeAssignedUsers(bugId, userIds);
  };

  return (
    <div
      tabIndex={0}
      draggable
      onDragStart={(e) => onDragStart(e, bug)}
      className="rounded-md border-2 border-gray-700 bg-gray-900 p-3 mb-3 cursor-move hover:border-gray-600 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-white flex-1 text-left truncate">
          {bug.title}
        </h4>
        <button
          onClick={() => onEdit(bug)}
          className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-white transition-colors"
        >
          <Ellipsis className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(bug.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded text-xs ${
              priorityColors[bug.priority as keyof typeof priorityColors]
            }`}
          >
            {bug.priority.toUpperCase()}
          </span>

          <AssigneeBadgeStack
            assignees={bug.assignedTo || []}
            onClick={() => setOpenBug(bug)}
          />

          <AssigneeModal
            isOpen={openBug?.id === bug.id}
            onClose={() => setOpenBug(null)}
            assignees={bug.assignedTo || []}
            bugId={bug.id}
            onAddAssignee={handleAddAssignee}
            onRemoveAssignee={handleRemoveAssignee}
          />
        </div>
      </div>
    </div>
  );
}

export default BugCard;
