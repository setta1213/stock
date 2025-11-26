import { useState } from "react";
import axios from "axios";

const Login = ({ onLoginSuccess, apiBase }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // เคลียร์ error เก่า
    
    try {
      // ส่ง username/password ไปที่ api_login.php
      const res = await axios.post(
        `${apiBase}/api_login.php`, 
        { username, password },
        { withCredentials: true } // สำคัญมาก! เพื่อรับ Cookie Session
      );

      if (res.data.status === "success") {
        onLoginSuccess(); // แจ้ง App ว่า Login ผ่านแล้ว
      } else {
        setError(res.data.message || "Login Failed");
      }
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ Server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">เข้าสู่ระบบ</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input 
              type="text" 
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input 
              type="password" 
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;