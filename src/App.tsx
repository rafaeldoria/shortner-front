import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AddUrl from "./pages/AddUrl";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/home/add" element={<AddUrl />} />
      <Route path="/home/password" element={<ChangePassword />} />
    </Routes>
  );
}

export default App;
