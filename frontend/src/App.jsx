import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import OrganizerDashboard from "./pages/OrganizerPages/OrganizerDashboard";
import UserDashboard from "./pages/UserPages/UserDashboard";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/organizer-dashboard"
          element={<OrganizerDashboard />}
        />
        <Route
          path="/user-dashboard"
          element={<UserDashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;