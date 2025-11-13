import React, { useState } from "react";
// import { useAuthStore } from "../../store/auth";
import type { Project } from "../../types/types";
import { X } from "lucide-react";

interface AddProjectModalProps {
  onClose: () => void;
  onAdd: (project: Partial<Project>) => void;
}

function AddProjectModal({ onClose, onAdd }: AddProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // const currentUser = useAuthStore((state) => state.user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      name: title,
      description,
      // authorId: currentUser ? currentUser.id : undefined,
      // author: currentUser
      //   ? {
      //       id: currentUser.id,
      //       name: currentUser.name || "",
      //       email: currentUser.email,
      //     }
      //   : undefined,
    });

    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            Create New Project
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project name..."
              autoFocus
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter project description..."
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProjectModal;
