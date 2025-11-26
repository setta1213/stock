import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE = "https://api2.koishop.click/stock/stock-api";

function History() {
  // เริ่มต้นเป็น array ว่างเสมอ เพื่อป้องกัน .map error
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      // ✅ แก้ไข 1: ส่ง Session/Cookie ไปด้วย
      const res = await axios.get(`${API_BASE}/get_history.php`, { withCredentials: true });
      
      // ✅ แก้ไข 2: เช็คว่าเป็น Array จริงไหม
      if (Array.isArray(res.data)) {
        setTransactions(res.data);
      } else {
        console.warn("History API Error:", res.data);
        setTransactions([]); // เคลียร์เป็นว่าง
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      setTransactions([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">🕒 ประวัติการทำรายการ</h1>
          <Link to="/" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded shadow">
            ← กลับหน้าสต็อก
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 border-b font-semibold text-gray-600">วัน-เวลา</th>
                <th className="p-4 border-b font-semibold text-gray-600">ประเภท</th>
                <th className="p-4 border-b font-semibold text-gray-600">สินค้า</th>
                <th className="p-4 border-b font-semibold text-gray-600">ล็อตที่เกี่ยวข้อง</th>
                <th className="p-4 border-b font-semibold text-gray-600 text-right">จำนวน</th>
                <th className="p-4 border-b font-semibold text-gray-600">หมายเหตุ</th>
              </tr>
            </thead>
            <tbody>
              {/* ✅ แก้ไข 3: เช็ค Array ก่อนวนลูปเสมอ */}
              {Array.isArray(transactions) && transactions.length > 0 ? (
                transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 border-b last:border-0">
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(t.created_at).toLocaleString('th-TH')}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        t.type === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {t.type === 'IN' ? 'รับเข้า' : 'เบิกออก'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {t.image && <img src={t.image} className="w-10 h-10 rounded object-cover border" />}
                        <div>
                          <div className="font-bold text-gray-800">{t.product_name}</div>
                          <div className="text-xs text-gray-500">{t.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                       {t.expiry_date ? (
                         <div>
                           <span className="block text-xs text-gray-400">Exp: {t.expiry_date}</span>
                           {t.batch_code && <span className="block text-xs bg-gray-200 px-1 rounded w-fit">#{t.batch_code}</span>}
                         </div>
                       ) : "-"}
                    </td>
                    <td className={`p-4 text-right font-bold ${t.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'IN' ? '+' : '-'}{t.quantity}
                    </td>
                    <td className="p-4 text-sm text-gray-500">{t.note}</td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan="6" className="p-8 text-center text-gray-400">
                     ยังไม่มีรายการ หรือ ไม่สามารถดึงข้อมูลได้ (กรุณา Login ใหม่)
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default History;