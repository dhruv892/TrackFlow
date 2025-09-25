import "./App.css";
import Nav from "./components/Nav";
import SideBar from "./components/SideBar";
import Projectdashboard from "./components/ProjectDashboard";

function App() {
  return (
    <div className="border-2 rounded-md p-2 border-gray-700">
      <Nav />

      <div className="flex pt-2">
        <SideBar />
        <Projectdashboard />
      </div>
    </div>
  );

  // return <Temp />;
}

export default App;
