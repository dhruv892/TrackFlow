import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { ROUTES } from "./routesConfig";
import DashBoard from "./pages/DashBoard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.dashboard} element={<DashBoard />} />

        {/* Add a catch-all for 404s */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );

  // return <Temp />;
}

export default App;
