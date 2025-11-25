import React from 'react';

const ProductCard = ({ product, onStockIn, onStockOut }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      {/* Product Image */}
      <div className="h-48 bg-gray-200 w-full relative">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
        {/* Badge Low Stock */}
        {parseInt(product.total_stock) <= parseInt(product.min_level) && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Low Stock
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              {product.total_stock}
            </p>
            <p className="text-xs text-gray-500">{product.unit}</p>
          </div>
        </div>

        {/* Expiry Warning */}
        {product.next_expiry && (
          <div className="mt-3 bg-yellow-50 text-yellow-800 text-xs px-2 py-1 rounded border border-yellow-200">
            ⚠️ ล็อตต่อไปหมดอายุ: {product.next_expiry}
          </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={() => onStockIn(product)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded text-sm font-semibold"
          >
            รับเข้า (In)
          </button>
          <button
            onClick={() => onStockOut(product)}
            className="bg-rose-500 hover:bg-rose-600 text-white py-2 rounded text-sm font-semibold"
          >
            เบิกออก (Out)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;