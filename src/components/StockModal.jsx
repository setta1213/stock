import { useState, useEffect } from 'react';
import axios from 'axios';

const StockModal = ({ isOpen, onClose, onSuccess, apiBase, type, product }) => {
  const [transaction, setTransaction] = useState({
    quantity: 1,
    expiry_date: "",
    cost_price: 0,
  });

  // Reset ค่าเมื่อเปิด Modal ใหม่
  useEffect(() => {
    if (isOpen) {
      setTransaction({ quantity: 1, expiry_date: "", cost_price: 0 });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = type === "IN" ? "/stock_in.php" : "/stock_out.php";
    const payload = { ...transaction, type, product_id: product?.id };

    try {
      const res = await axios.post(`${apiBase}${endpoint}`, payload);
      if (res.data.status === "success") {
        alert(res.data.message);
        onSuccess();
        onClose();
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className={`text-xl font-bold mb-4 ${type === "IN" ? "text-emerald-600" : "text-rose-600"}`}>
          {type === "IN" ? `📥 รับเข้า: ${product.name}` : `📤 เบิกออก: ${product.name}`}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">จำนวน</label>
            <input
              type="number"
              min="1"
              className="w-full border p-2 rounded focus:ring-2 ring-blue-500"
              required
              value={transaction.quantity}
              onChange={(e) => setTransaction({ ...transaction, quantity: e.target.value })}
            />
          </div>

          {type === "IN" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">ต้นทุนต่อหน่วย (บาท)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border p-2 rounded"
                  required
                  onChange={(e) => setTransaction({ ...transaction, cost_price: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">วันหมดอายุ (Expiry Date)</label>
                <input
                  type="date"
                  className="w-full border p-2 rounded bg-yellow-50"
                  required
                  onChange={(e) => setTransaction({ ...transaction, expiry_date: e.target.value })}
                />
              </div>
            </>
          )}

          {type === "OUT" && (
            <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded">
              ℹ️ ระบบจะตัดจากล็อตที่หมดอายุก่อนโดยอัตโนมัติ (FIFO)
            </p>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">ยกเลิก</button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded ${type === "IN" ? "bg-emerald-600" : "bg-rose-600"}`}
            >
              ยืนยัน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockModal;