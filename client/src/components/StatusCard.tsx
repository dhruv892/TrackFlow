import React from "react";
import BugCard from "./BugCard";

function StatusCard({ status }: { status: string }) {
  return (
    <div className="bg-gray-900 rounded-md p-4 min-w-[250px]">
      <h2 className="text-xl font-semibold mb-4">{status}</h2>
      {/* List of bugs/tasks under this status */}
      <BugCard />
    </div>
  );
}

export default StatusCard;
