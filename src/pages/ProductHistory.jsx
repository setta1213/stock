import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const API_BASE = "https://api2.koishop.click/stock/stock-api";

// สีสำหรับกราฟ
const COLORS = ['#10B981', '#F59E0B', '#EF4444']; // เขียว(ดี), เหลือง(ใกล้หมด), แดง(หมดอายุ)

const ProductHistory = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('DASHBOARD'); // เพิ่ม Tab Dashboard

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/get_product_full_info.php?id=${id}`, { withCredentials: true });
        if (res.data.status === 'success') {
          setData(res.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // --- ส่วนคำนวณสถิติ (Calculation Logic) ---
  const stats = useMemo(() => {
    if (!data) return null;
    const { batches, transactions } = data;
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    // 1. คำนวณยอดรวม เข้า/ออก
    const totalIn = transactions.filter(t => t.type === 'IN').reduce((sum, t) => sum + parseInt(t.quantity), 0);
    const totalOut = transactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + parseInt(t.quantity), 0);
    const currentStock = batches.reduce((sum, b) => sum + parseInt(b.quantity), 0);

    // 2. วิเคราะห์สุขภาพสต็อก (จากล็อตที่ยังมีของอยู่)
    let stockGood = 0;
    let stockExpiring = 0; // ใกล้หมดใน 30 วัน
    let stockExpired = 0;  // หมดอายุแล้ว

    batches.forEach(b => {
        const qty = parseInt(b.quantity);
        if (qty > 0) {
            const expDate = new Date(b.expiry_date);
            if (expDate < today) {
                stockExpired += qty;
            } else if (expDate <= next30Days) {
                stockExpiring += qty;
            } else {
                stockGood += qty;
            }
        }
    });

    // 3. เตรียมข้อมูลกราฟแท่ง (Monthly Movements)
    // Group transactions by Month (YYYY-MM)
    const monthlyData = {};
    transactions.forEach(t => {
        const date = new Date(t.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // 2023-10
        
        if (!monthlyData[monthKey]) monthlyData[monthKey] = { name: monthKey, IN: 0, OUT: 0 };
        
        if (t.type === 'IN') monthlyData[monthKey].IN += parseInt(t.quantity);
        else monthlyData[monthKey].OUT += parseInt(t.quantity);
    });
    // แปลง Object เป็น Array แล้วเรียงตามเดือนเก่า -> ใหม่
    const chartDataMovement = Object.values(monthlyData).sort((a, b) => a.name.localeCompare(b.name));

    // 4. เตรียมข้อมูลกราฟวงกลม (Stock Health)
    const chartDataHealth = [
        { name: 'ปกติ', value: stockGood },
        { name: 'ใกล้หมดอายุ (30วัน)', value: stockExpiring },
        { name: 'หมดอายุแล้ว', value: stockExpired },
    ].filter(item => item.value > 0); // เอาเฉพาะที่มีค่ามาแสดง

    return { totalIn, totalOut, currentStock, stockGood, stockExpiring, stockExpired, chartDataMovement, chartDataHealth };
  }, [data]);


  if (loading) return <div className="p-8 text-center">กำลังโหลดข้อมูล...</div>;
  if (!data) return <div className="p-8 text-center">ไม่พบข้อมูลสินค้า</div>;

  const { product, batches, transactions } = data;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 flex justify-between items-start">
            <div>
                <Link to="/" className="text-sm text-gray-500 hover:underline">← กลับหน้าหลัก</Link>
                <h1 className="text-3xl font-bold text-gray-800 mt-2">{product.name}</h1>
                <p className="text-gray-600">SKU: {product.sku}</p>
            </div>
            <div className="text-right">
                <div className="text-sm text-gray-500">คงเหลือปัจจุบัน</div>
                <div className={`text-4xl font-bold ${stats.stockExpired > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                    {stats.currentStock} <span className="text-lg text-gray-400">{product.unit}</span>
                </div>
            </div>
        </div>

        {/* --- SECTION 1: สรุปตัวเลข (Summary Cards) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-emerald-500">
                <p className="text-gray-500 text-sm">ยอดรับเข้าทั้งหมด (IN)</p>
                <p className="text-2xl font-bold text-emerald-600">+{stats.totalIn}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-rose-500">
                <p className="text-gray-500 text-sm">ยอดเบิกออกทั้งหมด (OUT)</p>
                <p className="text-2xl font-bold text-rose-600">-{stats.totalOut}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-400">
                <p className="text-gray-500 text-sm">ใกล้หมดอายุ (30 วัน)</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.stockExpiring}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-600">
                <p className="text-gray-500 text-sm">หมดอายุแล้ว (ค้างสต็อก)</p>
                <p className="text-2xl font-bold text-red-600">{stats.stockExpired}</p>
            </div>
        </div>

        {/* --- SECTION 2: กราฟแสดงผล (Charts) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* กราฟแท่ง: การเคลื่อนไหวรายเดือน */}
            <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-700 mb-4">📊 แนวโน้มการรับเข้า vs เบิกออก (รายเดือน)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.chartDataMovement}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="IN" name="รับเข้า" fill="#10B981" />
                            <Bar dataKey="OUT" name="เบิกออก" fill="#EF4444" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* กราฟวงกลม: สุขภาพสต็อก */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-bold text-gray-700 mb-4">🍰 สุขภาพสต็อกปัจจุบัน</h3>
                <div className="h-64 flex flex-col items-center justify-center">
                    {stats.currentStock > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.chartDataHealth}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.chartDataHealth.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400">ไม่มีสินค้าในสต็อก</p>
                    )}
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-300 mb-6">
             <button 
                onClick={() => setTab('DASHBOARD')}
                className={`pb-2 px-4 font-semibold ${tab === 'DASHBOARD' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
                📋 ตารางประวัติ (Transaction)
            </button>
            <button 
                onClick={() => setTab('BATCH')}
                className={`pb-2 px-4 font-semibold ${tab === 'BATCH' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
                📦 ตารางล็อต (Batch List)
            </button>
        </div>

        {/* --- SECTION 3: ตารางข้อมูล (Tables) --- */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
            
            {/* ตาราง 1: Transactions (เข้า/ออก) */}
            {tab === 'DASHBOARD' && (
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">วัน-เวลา</th>
                            <th className="p-4">รายการ</th>
                            <th className="p-4 text-right">จำนวน</th>
                            <th className="p-4">ทำโดย</th>
                            <th className="p-4">หมายเหตุ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((t) => (
                            <tr key={t.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 text-sm text-gray-600">{t.created_at}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${t.type === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {t.type === 'IN' ? 'รับเข้า' : 'เบิกออก'}
                                    </span>
                                </td>
                                <td className={`p-4 text-right font-bold ${t.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.type === 'IN' ? '+' : '-'}{t.quantity}
                                </td>
                                <td className="p-4 text-sm">{t.created_by}</td>
                                <td className="p-4 text-sm text-gray-500">{t.note || '-'}</td>
                            </tr>
                        ))}
                        {transactions.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-400">ไม่มีรายการเคลื่อนไหว</td></tr>}
                    </tbody>
                </table>
            )}

            {/* ตาราง 2: Batches (ล็อตทั้งหมด) */}
            {tab === 'BATCH' && (
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Code</th>
                            <th className="p-4 text-right">คงเหลือ</th>
                            <th className="p-4">วันหมดอายุ</th>
                            <th className="p-4">สถานะ</th>
                            <th className="p-4">วันที่รับเข้า</th>
                            <th className="p-4">ผู้รับ</th>
                            <th className="p-4">หมายเหตุ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {batches.map((b) => {
                            const isExpired = new Date(b.expiry_date) < new Date() && parseInt(b.quantity) > 0;
                            return (
                                <tr key={b.id} className={`border-b ${parseInt(b.quantity) === 0 ? 'bg-gray-100 text-gray-400' : (isExpired ? 'bg-red-50' : 'hover:bg-gray-50')}`}>
                                    <td className="p-4 text-sm font-mono">{b.batch_code || '-'}</td>
                                    <td className="p-4 text-right font-bold">
                                        {b.quantity} {parseInt(b.quantity) === 0 && <span className="text-xs text-red-500 ml-1">(หมด)</span>}
                                    </td>
                                    <td className={`p-4 ${isExpired ? 'text-red-600 font-bold' : ''}`}>{b.expiry_date}</td>
                                    <td className="p-4">
                                        {parseInt(b.quantity) === 0 ? <span className="text-gray-400 text-xs">ขายหมดแล้ว</span> : 
                                         isExpired ? <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">หมดอายุ</span> :
                                         <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">ปกติ</span>
                                        }
                                    </td>
                                    <td className="p-4 text-sm">{b.received_date}</td>
                                    <td className="p-4 text-sm">{b.received_by}</td>
                                    <td className="p-4 text-sm">{b.note || '-'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

        </div>
      </div>
    </div>
  );
};

export default ProductHistory;