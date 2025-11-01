import { useState } from "react";
import type { Bug } from "../types/types";
import { Ellipsis } from "lucide-react";

export default function EditableCell({
  bug,
  field,
  onSave,
  onEllipsisClick,
}: {
  bug: Bug;
  field: "title" | "status" | "priority";
  onSave: (id: number, field: keyof Bug, value: string) => void;
  onEllipsisClick?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(bug[field]);

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== bug[field]) {
      onSave(bug.id, field, value);
    }
  };

  // Dropdown options
  const statusOptions = ["todo", "in_progress", "in_review", "done"];
  const priorityOptions = ["low", "medium", "high", "top"];

  // Title input
  if (field === "title") {
    return (
      <td
        className="flex justify-between px-4 py-2 border-b border-r border-gray-700 cursor-pointer"
        onClick={() => setIsEditing(true)}
      >
        {isEditing ? (
          <input
            type="text"
            value={value}
            autoFocus
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleBlur();
            }}
            className="w-full bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
          />
        ) : (
          <span>{value}</span>
        )}
        {!isEditing && (
          <Ellipsis
            className="opacity-0 group-hover:opacity-100 transition-opacity  w-4 h-4 inline-block ml-2 text-gray-500"
            onClick={(e) => {
              e.stopPropagation();
              onEllipsisClick?.();
            }}
          />
        )}
      </td>
    );
  }

  // Status or Priority dropdown
  if (field === "status" || field === "priority") {
    const options = field === "status" ? statusOptions : priorityOptions;
    return (
      <td
        className="px-4 py-2 border-b border-r border-gray-700 cursor-pointer"
        onClick={() => setIsEditing(true)}
      >
        {isEditing ? (
          <select
            value={value}
            autoFocus
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleBlur}
            className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <span>{value}</span>
        )}
      </td>
    );
  }

  return <td>{bug[field]}</td>;
}
