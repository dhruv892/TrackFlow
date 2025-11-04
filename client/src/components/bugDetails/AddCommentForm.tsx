import React, { useState } from "react";

interface AddCommentFormProps {
  onAdd: (content: string) => void;
}

export default function AddCommentForm({ onAdd }: AddCommentFormProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAdd(content);
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        className="w-full p-2 border rounded-lg bg-gray-800 text-white focus:outline-none "
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add Comment
      </button>
    </form>
  );
}
