import { Routes, Route } from "react-router-dom"; // Import มาใช้ที่นี่แทน
import Dashboard from "./pages/Dashboard";
import History from "./History"; // หรือ ./pages/History แล้วแต่ว่าไฟล์อยู่ไหน

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/history" element={<History />} />
    </Routes>
  );
}

export default App;