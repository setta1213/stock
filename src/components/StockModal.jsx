import { useState, useEffect } from 'react';
import axios from 'axios';

const StockModal = ({ isOpen, onClose, onSuccess, apiBase, type, product }) => {
  const [transaction, setTransaction] = useState({
    quantity: 1,
    expiry_date: "",
    cost_price: 0,
    sale_price: 0,
    wholesale_price: 0,
    note: "" // state note ต้องมี
  });

  useEffect(() => {
    if (isOpen) {
      setTransaction({ quantity: 1, expiry_date: "", cost_price: 0, sale_price: 0, wholesale_price: 0, note: "" });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = type === "IN" ? "/stock_in.php" : "/stock_out.php";
    // ส่ง note ไปด้วยเสมอ
    const payload = { ...transaction, type, product_id: product?.id };

    try {
      const res = await axios.post(`${apiBase}${endpoint}`, payload, {
        withCredentials: true 
      });

      if (res.data.status === "success") {
        if (type === "OUT" && res.data.summary && res.data.summary.length > 0) {
            const summaryText = res.data.summary.join("\n");
            alert(`✅ ตัดสต็อกสำเร็จ!\n\nกรุณาหยิบสินค้าตามรายการนี้:\n${summaryText}`);
        } else {
            alert(res.data.message);
        }
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

          {/* ส่วนรับเข้า (เฉพาะ IN) */}
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
                <label className="block text-sm font-medium text-gray-700">วันหมดอายุ</label>
                <input
                  type="date"
                  className="w-full border p-2 rounded bg-yellow-50"
                  required
                  onChange={(e) => setTransaction({ ...transaction, expiry_date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded border">
                <div>
                   <label className="block text-sm font-medium text-blue-700">ราคาปลีก</label>
                   <input type="number" step="0.01" className="w-full border p-2 rounded" required onChange={(e) => setTransaction({ ...transaction, sale_price: e.target.value })} />
                </div>
                <div>
                   <label className="block text-sm font-medium text-purple-700">ราคาส่ง</label>
                   <input type="number" step="0.01" className="w-full border p-2 rounded" required onChange={(e) => setTransaction({ ...transaction, wholesale_price: e.target.value })} />
                </div>
              </div>
            </>
          )}

          {/* ✅ ย้าย "หมายเหตุ" ออกมาอยู่นอกวงเล็บ IN (เพื่อให้ OUT ก็เห็นด้วย) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">หมายเหตุ (Note)</label>
            <input 
                type="text" 
                className="w-full border p-2 rounded" 
                placeholder="เช่น ขายหน้าร้าน, ของแถม, เสียหาย"
                value={transaction.note}
                onChange={(e) => setTransaction({ ...transaction, note: e.target.value })} 
            />
          </div>

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