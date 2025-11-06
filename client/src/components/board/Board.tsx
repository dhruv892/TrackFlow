import { useEffect, useState } from "react";
import { useBugStore } from "../../store/bugs";
// import { useUIStore } from "../../store/ui";
import type { Bug } from "../../types/types";
import StatusCard from "./StatusColumn";
import { Loader2 } from "lucide-react";
import AddBugModal from "./AddBugModal";
import BugDetailModal from "../bugDetails/BugDetailModal";

const STATUSES = [
  { key: "todo", label: "To Do", color: "bg-gray-500" },
  { key: "in_progress", label: "In Progress", color: "bg-blue-500" },
  { key: "in_review", label: "In Review", color: "bg-yellow-500" },
  { key: "done", label: "Done", color: "bg-green-500" },
];

function Board() {
  const { allBugs, isBugsLoading, getAllBugs, addBug, updateBug } =
    useBugStore();
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalStatus, setAddModalStatus] = useState("todo");
  const [draggedBug, setDraggedBug] = useState<Bug | null>(null);

  useEffect(() => {
    getAllBugs();
  }, [getAllBugs]);

  const getBugsByStatus = (status: string) => {
    return allBugs.filter((bug) => bug.status === status);
  };

  const handleAddBug = (status: string) => {
    setAddModalStatus(status);
    setShowAddModal(true);
  };

  const handleCreateBug = async (bug: Partial<Bug>) => {
    await addBug(bug);
  };

  const handleDragStart = (e: React.DragEvent, bug: Bug) => {
    setDraggedBug(bug);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedBug && draggedBug.status !== newStatus) {
      await updateBug(draggedBug.id, { status: newStatus });
    }
    setDraggedBug(null);
  };

  const handleUpdateBug = async (
    id: number,
    field: keyof Bug,
    value: string
  ) => {
    await updateBug(id, { [field]: value });
  };

  if (isBugsLoading && allBugs.length === 0) {
    return (
      <div className="p-4 flex items-center gap-2 text-gray-300">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading bugs...</span>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col overflow-x-auto">
      <div className="flex h-full gap-4 p-4 overflow-x-auto overflow-y-hidden scrollbar-hide">
        {STATUSES.map((status) => (
          <StatusCard
            key={status.key}
            status={status}
            bugs={getBugsByStatus(status.key)}
            onAddBug={handleAddBug}
            onEditBug={setSelectedBug}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
          />
        ))}
      </div>

      {showAddModal && (
        <AddBugModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleCreateBug}
          initialStatus={addModalStatus}
        />
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

export default Board;
