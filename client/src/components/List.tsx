import React, { useEffect, useState } from "react";
import type { Bug } from "../types/types";
// import { api } from "../api/api";
import { Ellipsis, Loader2, Plus } from "lucide-react";
import { useBugStore } from "../store/bugs";
import BugDetailModal from "./BugDetailModal";

function List() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const { getAllBugs, isBugsLoading, allBugs, addBug, updateBug, deleteBug } =
    useBugStore();

  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);

  useEffect(() => {
    getAllBugs();
  }, [getAllBugs]);

  // submit new bug
  const handleAddBug = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addBug({
      title,
      status: "todo",
      priority: "medium",
      userId: "1",
    });

    setTitle("");
    setShowForm(false);
  };

  const handleUpdateBug = async (
    id: number,
    field: keyof Bug,
    value: string
  ) => {
    await updateBug(id, { [field]: value });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this bug?")) {
      await deleteBug(id);
    }
  };

  // if (isBugsLoading) return <div className="p-4">Loading...</div>;
  // Show loading only on initial load
  if (isBugsLoading && allBugs.length === 0) {
    return (
      <div className="p-4 flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading bugs...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-gray-700 text-left text-sm">
        <thead className="bg-gray-900 text-gray-300">
          <tr>
            <th className="px-4 py-2  border-b border-r  border-gray-700">
              Title
            </th>
            <th className="px-4 py-2 border-b border-r border-gray-700">
              Status
            </th>
            <th className="px-4 py-2 border-b border-r border-gray-700">
              Priority
            </th>
            <th className="px-4 py-2 border-b border-r border-gray-700">
              Author
            </th>
            <th className="px-4 py-2 border-b border-r border-gray-700">
              Created
            </th>
            <th className="px-4 py-2 border-b border-r border-gray-700">
              Updated
            </th>
          </tr>
        </thead>
        <tbody>
          {allBugs.map((bug: Bug) => (
            <tr
              key={bug.id}
              className="group hover:bg-gray-800 transition-colors duration-150"
            >
              {/* <td className="px-4 py-2 border-b border-r border-gray-700 font-medium text-white">
                {bug.title}
              </td>

              <td className="px-4 py-2 border-b border-r border-gray-700 capitalize">
                {bug.status}
              </td>
              <td className="px-4 py-2 border-b border-r border-gray-700">
                {bug.priority}
              </td> */}

              <EditableCell
                bug={bug}
                field="title"
                onSave={handleUpdateBug}
                onEllipsisClick={() => setSelectedBug(bug)}
              />
              <EditableCell
                bug={bug}
                field="status"
                onSave={handleUpdateBug}
                onEllipsisClick={() => setSelectedBug(bug)}
              />
              <EditableCell
                bug={bug}
                field="priority"
                onSave={handleUpdateBug}
                onEllipsisClick={() => setSelectedBug(bug)}
              />

              <td className="px-4 py-2 border-b border-r border-gray-700">
                {bug.userId ?? "—"}
              </td>
              <td className="px-4 py-2 border-b border-r border-gray-700">
                {bug.createdAt
                  ? new Date(bug.createdAt).toLocaleDateString()
                  : "—"}
              </td>
              <td className="px-4 py-2 border-b border-gray-700">
                {bug.updatedAt
                  ? new Date(bug.updatedAt).toLocaleDateString()
                  : "—"}
              </td>
              <td className="px-4 py-2 border-b border-gray-700">
                <button
                  onClick={() => handleDelete(bug.id)}
                  className="text-red-400 hover:text-red-300 transition-colors px-2 py-1 text-xs"
                  disabled={bug.id < 0}
                >
                  {bug.id < 0 ? "..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
          {!showForm ? (
            <tr
              onClick={() => setShowForm(true)}
              className="hover:bg-gray-800 cursor-pointer transition duration-150"
            >
              <td
                colSpan={6}
                className="px-4 py-2 border-b border-gray-700 text-gray-400 hover:text-white"
              >
                <div className="flex gap-2 w-full">
                  <Plus className="w-5 h-5" />
                  <span>Create Bug</span>
                </div>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan={6} className="p-3 bg-gray-900">
                <form onSubmit={handleAddBug}>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => setShowForm(false)}
                    placeholder="Enter bug title and press Enter..."
                    autoFocus
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none"
                  />
                </form>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {allBugs.length === 0 && !isBugsLoading && (
        <div className="text-center py-8 text-gray-400">
          No bugs found. Click "Create Bug" to add one.
        </div>
      )}

      {selectedBug && (
        <BugDetailModal
          bug={selectedBug}
          onClose={() => setSelectedBug(null)}
          onUpdate={handleUpdateBug}
        />
      )}
    </div>
  );
}

function EditableCell({
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

export default List;
