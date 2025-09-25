import React, { useEffect, useState } from "react";
import type { Bug } from "../types/types";
import { api } from "../api/api";

function List() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = (await api.getBugs()) as Bug[];
        setBugs(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;

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
          {bugs.map((bug) => (
            <tr
              key={bug.id}
              className="hover:bg-gray-800 transition-colors duration-150"
            >
              <td className="px-4 py-2 border-b border-r border-gray-700 font-medium text-white">
                {bug.title}
              </td>
              <td className="px-4 py-2 border-b border-r border-gray-700 capitalize">
                {bug.status}
              </td>
              <td className="px-4 py-2 border-b border-r border-gray-700">
                {bug.priority}
              </td>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default List;
