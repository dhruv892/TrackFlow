import { User } from "lucide-react";

interface Assignee {
  name: string;
  email: string;
  id: number;
}

interface AssigneeStackProps {
  assignees: Assignee[];
  onClick: () => void; // open modal
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const AssigneeBadgeStack = ({ assignees, onClick }: AssigneeStackProps) => {
  if (!assignees || assignees.length === 0) {
    return (
      <button
        onClick={onClick}
        className="p-1 rounded hover:bg-gray-800 text-gray-500 hover:text-white transition-colors"
      >
        <User className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button onClick={onClick} className="flex items-center gap-1 group">
      {assignees.length > 0 && (
        <div
          key={assignees[0].id}
          className="w-6 h-6 rounded-full bg-gray-800 text-white text-[10px] flex items-center justify-center border border-gray-700 group-hover:border-gray-500 transition"
          title={`${assignees[0].name} (${assignees[0].email})`}
        >
          {getInitials(assignees[0].name)}
        </div>
      )}
      {assignees.length > 1 && (
        <span className="text-xs text-gray-500">+{assignees.length - 1}</span>
      )}
    </button>
  );
};

export default AssigneeBadgeStack;
