import { Calendar, Ellipsis } from "lucide-react";
import React from "react";

function BugCard() {
  return (
    <div className="bg-gray-800 rounded-md p-3 mb-3">
      <div className="flex justify-between items-center">
        <h4> Bug Name </h4>
        <Ellipsis />
      </div>

      <div className="flex items-center gap-2">
        <Calendar />
        <p> Due Date </p>
      </div>
    </div>
  );
}

export default BugCard;
