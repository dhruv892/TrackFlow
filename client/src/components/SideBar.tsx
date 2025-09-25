import React from "react";

function SideBar() {
  return (
    <div className="border-r-2 pr-2 border-gray-700">
      <p>List of Projects</p>
      <ProjectCard />
      <ProjectCard />
    </div>
  );
}

function ProjectCard() {
  return (
    <div className="border-2 rounded-md mb-2 p-2 border-gray-700">
      <h3 className="text-lg font-semibold">Project Name</h3>
    </div>
  );
}

export default SideBar;
