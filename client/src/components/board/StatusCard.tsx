import React from "react";
import BugCard from "./BugCard";
import { Plus } from "lucide-react";

function StatusCard({ status }: { status: string }) {
  return (
    <div className="rounded-md items-center border-2 border-gray-700 p-4 min-w-[250px]">
      <div>
        <h2 className="text-xl font-semibold mb-4">{status}</h2>
        {/* List of bugs/tasks under this status */}
        <BugCard />
      </div>
      <div className="flex justify-center mt-4">
        <Plus className="w-10 h-10 text-gray-500 hover:text-white cursor-pointer" />
      </div>
    </div>
  );
}

export default StatusCard;
