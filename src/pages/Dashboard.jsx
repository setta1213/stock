import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import CreateProductModal from "../components/CreateProductModal";
import StockModal from "../components/StockModal";

const API_BASE = "https://api2.koishop.click/stock/stock-api";

function Dashboard() {
  const [products, setProducts] = useState([]);
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [stockModal, setStockModal] = useState({ isOpen: false, type: 'IN', product: null });

  // 1. Load Data
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get_products.php`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
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
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onStockIn={(p) => handleOpenStock('IN', p)}
              onStockOut={(p) => handleOpenStock('OUT', p)}
            />
          ))}
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

      </div>
    </div>
  );
}

export default Dashboard;