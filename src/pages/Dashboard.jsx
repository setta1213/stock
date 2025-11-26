import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import CreateProductModal from "../components/CreateProductModal";
import StockModal from "../components/StockModal";
import BatchDetailsModal from "../components/BatchDetailsModal"; 

const API_BASE = "https://api2.koishop.click/stock/stock-api";

function Dashboard() {
  // เริ่มต้นเป็น Array ว่างเสมอ เพื่อกัน Error .map
  const [products, setProducts] = useState([]);
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [stockModal, setStockModal] = useState({ isOpen: false, type: 'IN', product: null });
  const [detailsModal, setDetailsModal] = useState({ isOpen: false, product: null });

  // 1. Load Data
  const fetchProducts = async () => {
    try {
      // ✅ แก้ไข 1: เพิ่ม { withCredentials: true } เพื่อส่ง Session/Cookie ไปหา PHP
      const res = await axios.get(`${API_BASE}/get_products.php`, { withCredentials: true });
      
      // ✅ แก้ไข 2: เช็คว่าเป็น Array จริงไหม ก่อนนำไปใช้ (กันหน้าขาวถ้า API ตอบ Error)
      if (Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        console.warn("API Error (Not Array):", res.data);
        setProducts([]); // ถ้าไม่ใช่ Array ให้เคลียร์เป็นว่าง
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]); 
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Handlers
  const handleOpenStock = (type, product) => {
    setStockModal({ isOpen: true, type, product });
  };

  const handleCloseStock = () => {
    setStockModal({ ...stockModal, isOpen: false });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Buttons */}
        <Link
          to="/history"
          className="inline-block mb-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow"
        >
          🕒 ดูประวัติ
        </Link>
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📦 ระบบจัดการสต็อก (FIFO)</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2"
          >
            + เพิ่มสินค้าใหม่
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ✅ แก้ไข 3: เช็ค Array.isArray ก่อนวนลูป .map เสมอ */}
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onStockIn={(p) => handleOpenStock('IN', p)}
                onStockOut={(p) => handleOpenStock('OUT', p)}
                onViewDetails={(p) => setDetailsModal({ isOpen: true, product: p })}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm">
              <p className="text-lg">ไม่พบข้อมูลสินค้า</p>
              <p className="text-sm mt-2">หากเพิ่งเข้าสู่ระบบ กรุณารีเฟรชหน้าจอ หรือกดเพิ่มสินค้าใหม่</p>
            </div>
          )}
        </div>

        {/* --- Modals --- */}
        <CreateProductModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onSuccess={fetchProducts}
          apiBase={API_BASE}
        />

        <StockModal
          isOpen={stockModal.isOpen}
          onClose={handleCloseStock}
          onSuccess={fetchProducts}
          apiBase={API_BASE}
          type={stockModal.type}
          product={stockModal.product}
        />

        <BatchDetailsModal
          isOpen={detailsModal.isOpen}
          onClose={() => setDetailsModal({ ...detailsModal, isOpen: false })}
          product={detailsModal.product}
          apiBase={API_BASE}
        />

      </div>
    </div>
  );
}

export default Dashboard;