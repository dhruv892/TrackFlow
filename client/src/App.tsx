import "./App.css";
import Nav from "./components/Nav";
import Projectdashboard from "./components/ProjectDashboard";

function App() {
  return (
    <div className="min-h-screen flex flex-col border-2 rounded-md p-2 border-gray-700">
      <Nav />

      <div className="flex flex-1 overflow-hidden">
        {/* <SideBar /> */}
        <Projectdashboard />
      </div>
    </div>
  );

  // return <Temp />;
}

export default App;
