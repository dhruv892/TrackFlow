import React from "react";
import Nav from "../components/Nav";
import Projectdashboard from "../components/ProjectDashboard";

function DashBoard() {
  return (
    <div className="min-h-screen flex flex-col border-2 rounded-md p-2 border-gray-700">
      <Nav />

      <div className="flex flex-1 overflow-hidden">
        {/* <SideBar /> */}
        <Projectdashboard />
      </div>
    </div>
  );
}

export default DashBoard;
