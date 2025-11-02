import React, { useState } from "react"; // import your Comment interface
import type { Comment } from "../types/types";

interface CommentItemProps {
  comment: Comment;
  onUpdate?: (id: number, newContent: string) => void;
  onDelete?: (id: number) => void;
}

export default function CommentItem({
  comment,
  onUpdate,
  onDelete,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState(comment.content);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(comment.id, draftContent);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-2">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium">
          {/* You can display authorId or lookup author name elsewhere */}
          {comment.author.name.toString().charAt(0)}
        </div>
        <div>
          <div className="text-sm font-medium text-white">
            {comment.author.name || "Unknown Author"}
          </div>
          <div className="text-xs text-gray-400">
            {comment.createdAt?.slice(0, 10) ?? "—"}
          </div>
        </div>
      </div>

      {isEditing ? (
        <textarea
          className="w-full p-2 bg-gray-700 text-white rounded"
          value={draftContent}
          onChange={(e) => setDraftContent(e.target.value)}
          rows={3}
        />
      ) : (
        <p className="text-gray-300 whitespace-pre-wrap text-left">
          {comment.content}
        </p>
      )}

      <div className="mt-2 flex space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="mr-2 px-3 py-1 bg-green-600 rounded text-sm"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-red-600 rounded text-sm"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="mr-2 px-3 py-1 bg-blue-600 rounded text-sm"
            >
              Edit
            </button>
            {onDelete && (
              <button
                onClick={() => onDelete(comment.id)}
                className="px-3 py-1 bg-red-600 rounded text-sm"
              >
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
