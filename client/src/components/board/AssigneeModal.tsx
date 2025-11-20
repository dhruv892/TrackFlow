import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useBugStore } from "../../store/bugs";

interface Assignee {
  id: number;
  name: string;
  email?: string;
}

interface AssigneeModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignees: Assignee[];
  bugId: number;
  onAddAssignee: (bugId: number, userIds: number[]) => Promise<void>;
  onRemoveAssignee: (bugId: number, userIds: number[]) => Promise<void>;
}

export const AssigneeModal = ({
  isOpen,
  onClose,
  assignees,
  bugId,
  onAddAssignee,
  onRemoveAssignee,
}: AssigneeModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedToAdd, setSelectedToAdd] = useState<number[]>([]);
  const [selectedUserObjects, setSelectedUserObjects] = useState<
    Record<number, Assignee>
  >({});
  const [selectedToRemove, setSelectedToRemove] = useState<number[]>([]);

  const searchedUsers = useBugStore((state) => state.searchedUsers);
  const isSearchingUsers = useBugStore((state) => state.isSearchingUsers);
  const clearSearchedUsers = useBugStore((state) => state.clearSearchedUsers);
  const searchUsersInProject = useBugStore(
    (state) => state.searchUsersInProject
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Perform search
  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchUsersInProject(bugId, debouncedQuery);
    } else {
      clearSearchedUsers();
    }
  }, [debouncedQuery, bugId, searchUsersInProject, clearSearchedUsers]);

  if (!isOpen) return null;

  const isAlreadyAssigned = (userId: number) =>
    assignees.some((a) => a.id === userId);

  const handleAddToggle = (userId: number, userObj?: Assignee) => {
    setSelectedToAdd((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );

    setSelectedUserObjects((prev) => {
      if (prev[userId]) {
        // Remove from cache if deselected
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [userId]: _, ...rest } = prev;
        return rest;
      } else if (userObj) {
        // Add to cache on select
        return { ...prev, [userId]: userObj };
      }
      return prev;
    });
  };

  const handleRemoveToggle = (userId: number) => {
    setSelectedToRemove((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async () => {
    if (selectedToAdd.length > 0) {
      await onAddAssignee(bugId, selectedToAdd);
      setSelectedToAdd([]);
    }
    if (selectedToRemove.length > 0) {
      await onRemoveAssignee(bugId, selectedToRemove);
      setSelectedToRemove([]);
    }
    // Clear search input and debounced query
    setSearchQuery("");
    setDebouncedQuery("");

    onClose();
  };

  const handleOnClose = () => {
    setSelectedToAdd([]);
    setSelectedToRemove([]);
    setSearchQuery("");
    setDebouncedQuery("");

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6 w-96 max-h-[50vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 className="text-lg font-semibold text-white">Assign Users</h3>
          <button
            onClick={handleOnClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-4 flex-shrink-0 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-600" />
          <input
            type="text"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Scrollable content container */}
        <div className="flex-1 overflow-y-auto">
          {/* Current Assignees */}
          {assignees.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase">
                Current Assignees
              </h4>
              <div className="space-y-1">
                {assignees.map((assignee) => (
                  <div
                    key={assignee.id}
                    className="flex items-center justify-between bg-gray-800 hover:bg-gray-600 border-2 border-gray-700 p-2 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-white">{assignee.name}</p>
                      <p className="text-xs text-gray-400">{assignee.email}</p>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedToRemove.includes(assignee.id)}
                        onChange={() => handleRemoveToggle(assignee.id)}
                        className="mr-2 cursor-pointer"
                      />
                      <span className="text-xs text-red-400">Remove</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* selected to add */}
          {selectedToAdd.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase">
                Selected to Add
              </h4>
              <div className="space-y-1">
                {selectedToAdd.map((id) => {
                  const user = selectedUserObjects[id];
                  if (!user) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between bg-gray-700 p-2 rounded"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <button
                        onClick={() => handleAddToggle(id)}
                        className="p-1 rounded hover:bg-red-900 text-gray-400 hover:text-red-400 transition"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search Results */}
          {isSearchingUsers && (
            <p className="text-center text-gray-400 py-4">Searching...</p>
          )}

          {!isSearchingUsers && searchQuery && searchedUsers.length === 0 && (
            <p className="text-center text-gray-400 py-4">No users found</p>
          )}

          {searchedUsers.length > 0 && (
            <div className="space-y-1">
              {searchedUsers
                .filter(
                  (user) =>
                    !isAlreadyAssigned(user.id) &&
                    !selectedToAdd.includes(user.id)
                )
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between bg-gray-800 border-2 border-gray-700 hover:bg-gray-600 p-2 rounded-lg transition"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <label
                      htmlFor={`add-user-${user.id}`}
                      className="flex items-center"
                    >
                      <input
                        id={`add-user-${user.id}`}
                        type="checkbox"
                        checked={selectedToAdd.includes(user.id)}
                        onChange={() => handleAddToggle(user.id, user)}
                        className="mr-2 cursor-pointer"
                      />
                      <span className="text-xs text-green-400">Add</span>
                    </label>
                  </div>
                ))}
            </div>
          )}

          {!searchQuery && searchedUsers.length === 0 && !isSearchingUsers && (
            <p className="text-center text-gray-500 py-4 text-sm">
              Search for users by email
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-4 flex-shrink-0 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={
              selectedToAdd.length === 0 && selectedToRemove.length === 0
            }
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};
