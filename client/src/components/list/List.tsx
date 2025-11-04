import React, { useEffect, useMemo, useState } from "react";
import type { Bug } from "../../types/types";
import { Loader2, Plus } from "lucide-react";
import { useBugStore } from "../../store/bugs";
import BugDetailModal from "../bugDetails/BugDetailModal";
import { useUIStore, type GroupByOption } from "../../store/ui";
import EditableCell from "./EditableCell";

function List() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const { getAllBugs, isBugsLoading, allBugs, addBug, updateBug, deleteBug } =
    useBugStore();

  // const { groupBy, setGroupBy } = useUIStore();
  const { groupBy, setGroupBy, getGroupedBugs } = useUIStore();
  const groupedBugs = useMemo(
    () => getGroupedBugs(),
    [getGroupedBugs, groupBy, allBugs]
  );

  useEffect(() => {
    getAllBugs();
  }, [getAllBugs]);

  const handleAddBug = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addBug({
      title,
      status: "todo",
      priority: "medium",
      userId: 1,
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
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-200">Bugs</h2>
        <select
          value={groupBy}
          onChange={(e) => {
            setGroupBy(e.target.value as GroupByOption);
          }}
          className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded px-3 py-2 focus:outline-none"
        >
          <option value="none">Group by: None</option>
          <option value="status">Group by: Status</option>
          <option value="priority">Group by: Priority</option>
          <option value="assignee">Group by: Assignee</option>
        </select>
      </div>
      <table className="min-w-full border border-gray-700 text-left text-sm">
        <thead className="bg-gray-900 text-gray-300 sticky top-0">
          <tr>
            <th className="px-4 py-2 border-b border-r border-gray-700">
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
            <th className="px-4 py-2 border-b border-gray-700 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedBugs).map(([group, bugs]) => (
            <React.Fragment key={group}>
              {groupBy !== "none" && (
                <tr className="bg-gray-800 text-gray-300">
                  <td colSpan={7} className="px-4 py-2 font-semibold">
                    {group} ({bugs.length})
                  </td>
                </tr>
              )}

              {bugs.map((bug) => (
                <tr
                  key={bug.id}
                  className="group hover:bg-gray-800 transition-colors duration-150"
                >
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
                      ? new Date(bug.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-2 border-b border-r border-gray-700">
                    {bug.updatedAt
                      ? new Date(bug.updatedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 text-center">
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
            </React.Fragment>
          ))}
          {!showForm ? (
            <tr
              onClick={() => setShowForm(true)}
              className="hover:bg-gray-800 cursor-pointer transition duration-150"
            >
              <td
                colSpan={7}
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
              <td colSpan={7} className="p-3 bg-gray-900">
                <form
                  onSubmit={handleAddBug}
                  className="flex gap-2 items-center"
                >
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={() => setShowForm(false)}
                    placeholder="Enter bug title..."
                    autoFocus
                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none"
                  />
                </form>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {!isBugsLoading && allBugs.length === 0 && (
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

export default List;
