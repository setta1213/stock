import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History"; // แก้ path ให้ตรงกับโฟลเดอร์จริง
import Login from "./pages/Login";
import ProductHistory from "./pages/ProductHistory";

const API_BASE = "https://api2.koishop.click/stock/stock-api";

// สำคัญ: ส่ง Cookie ไปด้วยทุกครั้ง
axios.defaults.withCredentials = true;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ✅ เปลี่ยนไปเช็คที่ check_session.php แทน
        const res = await axios.get(`${API_BASE}/check_session.php`);

        // เช็คเงื่อนไขชัดเจน: ต้องได้ status = success เท่านั้น
        if (res.data.status === "success") {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        // กรณีเชื่อมต่อไม่ได้ หรือ Server ตอบ 401/500
        console.error("Auth Check Failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center">กำลังตรวจสอบสิทธิ์...</div>;

  return (
    <Routes>
      {!isAuthenticated ? (
        <Route path="*" element={<Login onLoginSuccess={() => setIsAuthenticated(true)} apiBase={API_BASE} />} />
      ) : (
        <>

          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/product/:id" element={<ProductHistory />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
}

export default App;