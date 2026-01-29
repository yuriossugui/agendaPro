import { Routes, Route, Link } from "react-router-dom";
import Login from "@/pages/Login";
import Service from "./pages/Service";

function ListaDeRotas() {
  return (
    <div>
      <ul>
        <li className="text-gray-300">
          <Link to="/login">Login</Link>
        </li>
        <li className="text-gray-300">
          <Link to="/service">Service</Link>
        </li>
      </ul>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-[#0b1220]">
      <Routes>
        <Route path="/" element={<ListaDeRotas />} />
        <Route path="/login" element={<Login />} />
        <Route path="/service" element={<Service />} />
      </Routes>     
    </div>
  )
}

export default App
