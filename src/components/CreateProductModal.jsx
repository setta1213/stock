import { useState } from 'react';
import axios from 'axios';

const CreateProductModal = ({ isOpen, onClose, onSuccess, apiBase }) => {
  const [newProduct, setNewProduct] = useState({ sku: '', name: '', min_level: 10, image: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("sku", newProduct.sku);
    formData.append("name", newProduct.name);
    formData.append("min_level", newProduct.min_level);
    if (newProduct.image) formData.append("image", newProduct.image);

    try {
      const res = await axios.post(`${apiBase}/create_product.php`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.status === "success") {
        alert("เพิ่มสินค้าสำเร็จ");
        onSuccess(); // แจ้ง Parent ให้โหลดข้อมูลใหม่
        onClose();
        setNewProduct({ sku: '', name: '', min_level: 10, image: null }); // Reset form
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาด");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">เพิ่มสินค้าใหม่</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="SKU / Barcode"
            className="w-full border p-2 rounded"
            required
            onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
          />
          <input
            type="text"
            placeholder="ชื่อสินค้า"
            className="w-full border p-2 rounded"
            required
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="จุดแจ้งเตือนขั้นต่ำ"
            className="w-full border p-2 rounded"
            onChange={(e) => setNewProduct({ ...newProduct, min_level: e.target.value })}
          />
          <input
            type="file"
            className="w-full border p-2 rounded"
            accept="image/*"
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
          />

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">ยกเลิก</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">บันทึก</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;