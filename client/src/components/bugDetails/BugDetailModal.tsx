import { useEffect, useState } from "react";
import type { Bug, Comment } from "../../types/types";
import { Calendar, User, X } from "lucide-react";
import CommentItem from "./CommentItem";
import AddCommentForm from "./AddCommentForm";
import {
  addCommentForBug,
  deleteComment,
  fetchCommentsForBug,
  updateComment,
} from "../../api/commentsApi";

interface BugDetailModalProps {
  bug: Bug;
  onClose: () => void;
  onUpdate: (id: number, field: keyof Bug, value: string) => void;
}

function BugDetailModal({ bug, onClose, onUpdate }: BugDetailModalProps) {
  // const [comment, setComment] = useState("");
  // const [comments, setComments] = useState<
  //   Array<{ id: number; text: string; author: string; date: string }>
  // >([
  //   {
  //     id: 1,
  //     text: "This needs to be fixed ASAP",
  //     author: "John Doe",
  //     date: "2024-01-15",
  //   },
  // ]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // const handleAddComment = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!comment.trim()) return;

  //   setComments([
  //     ...comments,
  //     {
  //       id: Date.now(),
  //       text: comment,
  //       author: "Current User",
  //       date: new Date().toISOString().split("T")[0],
  //     },
  //   ]);
  //   setComment("");
  // };

  // useEffect(() => {
  //   setLoading(true);
  //   fetchComments(bug.id).then(() => {
  //     setLoading(false);
  //   });
  // }, [bug.id]);

  useEffect(() => {
    let isMounted = true; // to avoid setting state on unmounted component
    setLoading(true);
    fetchCommentsForBug(bug.id).then((fetchedComments) => {
      console.log("Fetched comments:", fetchedComments);
      if (isMounted) {
        setComments(fetchedComments.comments);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [bug.id]);

  if (loading) {
    return <div>Loading comments...</div>;
  }

  const handleAddComment = async (content: string): Promise<void> => {
    const newComment = await addCommentForBug(
      // if (!bug) return;
      bug.id,
      content,
      /* currentUserId */ 1
    );

    if (!newComment.author) {
      newComment.author = {
        id: 1,
        name: "Bob Smith", // or however you identify the current user
        email: "bob@example.com",
      };
    }

    setComments((prev) => [...prev, newComment]);
  };

  const handleUpdateComment = async (
    id: number,
    content: string
  ): Promise<void> => {
    const updated = await updateComment(id, content);
    setComments((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const handleDeleteComment = async (id: number): Promise<void> => {
    await deleteComment(id);
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  // if (loading) return <div>Loading comments...</div>;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border-gray-700 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between p-6 border-b border-gray-700">
          <div className="flex gap-3">
            <div className="px-3 py-1 bg-blue-600 rounded text-sm font-medium">
              BUG-{bug.id}
            </div>
            <h2 className="text-xl font-semibold text-white">{bug.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2 text-left">
                Description
              </h3>
              <p className="text-white text-left">
                {bug.description || "No description provided."}
              </p>
            </div>

            {/* Comments Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-4">
                Comments ({comments.length})
              </h3>

              <div className="space-y-4 mb-4">
                {/* {comments.map((c) => (
                  <div key={c.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium">
                        {c.author.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">
                          {c.author}
                        </div>
                        <div className="text-xs text-gray-400">{c.date}</div>
                      </div>
                    </div>
                    <p className="text-gray-300">{c.text}</p>
                  </div>
                ))} */}
                {comments.map((c) => (
                  <CommentItem
                    key={c.id}
                    comment={c}
                    onUpdate={handleUpdateComment}
                    onDelete={handleDeleteComment}
                  />
                ))}
                <AddCommentForm onAdd={handleAddComment} />
                <button onClick={onClose}>Close</button>
              </div>

              {/* Add Comment Form
              <form onSubmit={handleAddComment} className="space-y-2">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Add Comment
                </button>
              </form> */}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-3">
            {/* Status */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-400 min-w-[80px]">
                Status
              </label>
              <select
                value={bug.status}
                onChange={(e) => onUpdate(bug.id, "status", e.target.value)}
                className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-400 min-w-[80px]">
                Priority
              </label>
              <select
                value={bug.priority}
                onChange={(e) => onUpdate(bug.id, "priority", e.target.value)}
                className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="top">Top</option>
              </select>
            </div>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-400 min-w-[80px] flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Author
                </label>
              </div>
              <div className="text-white flex-1">
                {bug.author.name || "Unassigned"}
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-400 min-w-[80px] flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Created
              </label>
              <div className="text-white flex-1">
                {bug.createdAt
                  ? new Date(bug.createdAt).toLocaleDateString()
                  : "—"}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-gray-400 min-w-[80px] flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Updated
              </label>
              <div className="text-white flex-1">
                {bug.updatedAt
                  ? new Date(bug.updatedAt).toLocaleDateString()
                  : "—"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BugDetailModal;
