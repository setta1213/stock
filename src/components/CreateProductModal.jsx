import { useState } from 'react';
import axios from 'axios';

const CreateProductModal = ({ isOpen, onClose, onSuccess, apiBase }) => {

  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    min_level: 10,
    image: null,
    note: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // เตรียมข้อมูลสำหรับส่ง
    const formData = new FormData();
    formData.append("sku", newProduct.sku);
    formData.append("name", newProduct.name);
    formData.append("min_level", newProduct.min_level);
    
    // ✅ แก้ไขจุดที่ 1: ต้องเป็น newProduct.note
    formData.append("note", newProduct.note); 
    
    if (newProduct.image) {
      formData.append("image", newProduct.image);
    }

    try {
      // ส่งข้อมูลไปที่ API
      const res = await axios.post(`${apiBase}/create_product.php`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true 
      });

      if (res.data.status === "success") {
        alert("เพิ่มสินค้าสำเร็จ");
        onSuccess(); 
        onClose();   

        // ✅ แก้ไขจุดที่ 2: Reset ค่า note ด้วย
        setNewProduct({ sku: '', name: '', min_level: 10, image: null, note: '' });
      } else {
        console.error("Server Error:", res.data);
        alert(res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">เพิ่มสินค้าใหม่</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ช่องกรอก SKU */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รหัสสินค้า / SKU</label>
            <input
              type="text"
              placeholder="ตัวอย่าง: A001"
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              value={newProduct.sku}
              onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
            />
          </div>

          {/* ช่องกรอกชื่อสินค้า */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า</label>
            <input
              type="text"
              placeholder="ระบุชื่อสินค้า"
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
          </div>

          {/* ช่องกรอกจุดแจ้งเตือน */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">แจ้งเตือนเมื่อต่ำกว่า (ชิ้น)</label>
            <input
              type="number"
              placeholder="ค่าเริ่มต้น: 10"
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={newProduct.min_level}
              onChange={(e) => setNewProduct({ ...newProduct, min_level: e.target.value })}
            />
          </div>

          {/* ช่องอัปโหลดรูปภาพ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รูปภาพสินค้า</label>
            <input
              type="file"
              className="w-full border border-gray-300 p-2 rounded bg-gray-50 text-sm focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept="image/*"
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
            />
          </div>

          {/* ช่องหมายเหตุ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ (เช่น ของแถม, รายละเอียด)</label>
            <textarea
              rows="2"
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="ระบุรายละเอียดเพิ่มเติม..."
              value={newProduct.note}
              onChange={(e) => setNewProduct({ ...newProduct, note: e.target.value })}
            />
          </div>

          {/* ปุ่ม Action */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition-colors"
            >
              บันทึก
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;