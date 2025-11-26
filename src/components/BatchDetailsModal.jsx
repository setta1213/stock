import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. ต้อง import ตัวนี้

const BatchDetailsModal = ({ isOpen, onClose, product, apiBase }) => {
  const [batches, setBatches] = useState([]);
  
  // 2. ต้องประกาศตัวแปร navigate ตรงนี้ (บรรทัดสำคัญที่ขาดไป)
  const navigate = useNavigate(); 

  useEffect(() => {
    if (isOpen && product) {
      fetchBatches();
    }
  }, [isOpen, product]);

  const fetchBatches = async () => {
    try {
      const res = await axios.get(`${apiBase}/get_product_batches.php?id=${product.id}`, { withCredentials: true });
      setBatches(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ฟังก์ชันกดปุ่มไปหน้าประวัติเต็ม
  const handleGoToFullHistory = () => {
    // 3. เรียกใช้ navigate ตรงนี้
    navigate(`/product/${product.id}`); 
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">📦 รายละเอียดสต็อก: {product.name}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase">
              <tr>
                <th className="p-3 border">วันที่รับเข้า</th>
                <th className="p-3 border text-gray-800">ผู้รับเข้า</th> 
                <th className="p-3 border">หมายเหตุ</th>
                <th className="p-3 border">วันหมดอายุ</th>
                <th className="p-3 border text-right">จำนวน</th>
                <th className="p-3 border text-right">ต้นทุน</th>
                <th className="p-3 border text-right text-blue-600">ราคาปลีก</th>
                <th className="p-3 border text-right text-purple-600">ราคาส่ง</th>
              </tr>
            </thead>
            <tbody>
              {batches.length === 0 ? (
                <tr><td colSpan="8" className="p-4 text-center text-gray-400">ไม่มีสต็อกคงเหลือ</td></tr>
              ) : (
                batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-gray-50 border-b">
                    <td className="p-3 border">{batch.received_date || '-'}</td>
                    <td className="p-3 border font-medium text-gray-700">
                        {batch.received_by || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="p-3 border text-gray-600 italic">
                        {batch.note ? batch.note : '-'}
                    </td>
                    <td className="p-3 border font-medium text-red-600">{batch.expiry_date}</td>
                    <td className="p-3 border text-right font-bold">{batch.quantity}</td>
                    <td className="p-3 border text-right text-gray-500">{parseFloat(batch.cost_price).toFixed(2)}</td>
                    <td className="p-3 border text-right text-blue-600 font-semibold">{parseFloat(batch.sale_price).toFixed(2)}</td>
                    <td className="p-3 border text-right text-purple-600 font-semibold">{parseFloat(batch.wholesale_price).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex justify-between items-center border-t pt-4">
             {/* ปุ่มไปหน้า Stock Card */}
             <button 
                onClick={handleGoToFullHistory}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                ดูประวัติสินค้าทั้งหมด (Stock Card)
             </button>

             <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-gray-700 transition-colors">ปิดหน้าต่าง</button>
        </div>
      </div>
    </div>
  );
};

export default BatchDetailsModal;