import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { ROUTES } from "./routesConfig";
import DashBoard from "./pages/DashBoard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path={ROUTES.dashboard} element={<DashBoard />} /> */}
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.register} element={<Register />} />

        {/* All protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashBoard />} />
          {/* Add more protected routes here */}
        </Route>

        {/* Add a catch-all for 404s */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );

  // return <Temp />;
}

export default App;
