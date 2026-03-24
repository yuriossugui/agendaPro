import { Routes, Route, Navigate} from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Service from "./pages/Service";
import ProtectedRoute from "./components/ProtectedRoute";
import Settings from "./pages/Settings";

function App() {
  return (
    <div className="min-h-screen bg-[#0b1220]">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/service" element={
          <ProtectedRoute>
            <Service />
          </ProtectedRoute>
          } />
          <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
          } />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>     
    </div>
  )
}

export default App
