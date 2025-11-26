import React from 'react';

const ProductCard = ({ product, onStockIn, onStockOut, onViewDetails }) => {
  // 1. แปลงค่าเป็นตัวเลขให้ชัวร์ก่อนเปรียบเทียบ (แก้ปัญหา Low Stock)
  const currentStock = Number(product.total_stock) || 0;
  const minStock = Number(product.min_level) || 0;

  // เปรียบเทียบ: ถ้าคงเหลือน้อยกว่าหรือเท่ากับขั้นต่ำ -> Low Stock
  const isLowStock = currentStock <= minStock;

  // เช็คว่ามีรูปภาพไหม
  const hasImage = product.image && product.image.length > 0;

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      {/* 1. ส่วนรูปภาพ (Image Section) */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        {hasImage ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-slate-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium">No Image</span>
          </div>
        )}

        {/* Badge: Low Stock (Overlay) */}
        {isLowStock && (
          <div className="absolute top-3 right-3 animate-pulse">
            <span className="bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Low Stock
            </span>
          </div>
        )}
      </div>

      {/* 2. ส่วนเนื้อหา */}
      <div className="flex flex-col flex-1 p-5">

        <div className="flex justify-between items-start mb-2">
          <div className="pr-4">
            <h3 className="text-lg font-bold text-slate-800 leading-tight line-clamp-2 min-h-[3rem]">
              {product.name}
            </h3>
            {/* แสดง SKU */}
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded border border-slate-200 font-mono tracking-wide">
                SKU: {product.sku}
              </span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="flex flex-col items-end">
              {/* แสดงตัวเลข Stock */}
              <span className={`text-2xl font-extrabold tracking-tight ${isLowStock ? 'text-red-500' : 'text-blue-600'}`}>
                {currentStock}
              </span>
              <span className="text-xs text-slate-400 font-medium -mt-1">{product.unit}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onViewDetails(product)}
          className="text-xs text-indigo-600 hover:underline mt-1 mb-2 block text-left"
        >
          📄 ดูรายละเอียดราคา/ล็อต
        </button>

        {/* --- ✅ ส่วนแสดงหมายเหตุ (Note) --- */}
        {product.note && (
          <div className="mt-2 mb-2 p-2 bg-gray-50 rounded border border-gray-100 flex items-start gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
             </svg>
             <p className="text-xs text-gray-600 leading-snug break-words">
               {product.note}
             </p>
          </div>
        )}
        {/* ---------------------------------- */}

        {/* Expiry Warning */}
        <div className="mt-auto pt-2 mb-4">
          {product.next_expiry ? (
            <div className="bg-amber-50 text-amber-700 text-xs px-3 py-2 rounded-lg border border-amber-100 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex flex-col">
                <span className="font-bold text-[10px] text-amber-600 uppercase tracking-wider">Expiry Date</span>
                <span className="font-medium">{product.next_expiry}</span>
              </div>
            </div>
          ) : (
             /* Spacer กรณีไม่มีวันหมดอายุ และไม่มี Note เพื่อให้การ์ดเท่ากัน */
             !product.note && <div className="h-[42px]"></div>
          )}
        </div>

        {/* 3. ปุ่มกด */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => onStockIn(product)}
            className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 group/btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover/btn:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            รับเข้า
          </button>
          <button
            onClick={() => onStockOut(product)}
            className="flex items-center justify-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 group/btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            เบิกออก
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;