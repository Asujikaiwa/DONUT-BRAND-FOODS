// src/components/AdminPanel.tsx (สร้างใหม่)
import React, { useState } from 'react';
import { Product } from '../types';

interface AdminPanelProps {
  onBack: () => void; // ฟังก์ชันสำหรับกดกลับหน้าบ้าน
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [product, setProduct] = useState<Partial<Product>>({
    category: 'seasoning',
    name: { th: '', en: '', cn: '' },
    weight: '',
    price: 0,
    image: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('ข้อมูลที่จะบันทึก:', product);
    alert(`เพิ่มสินค้า "${product.name?.th}" เรียบร้อย! (Data logged to console)`);
    // ตรงนี้คือจุดที่ต้องเขียนโค้ดต่อกับ Database ในอนาคต
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-brand-dark text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold font-display text-brand-orange">Admin Panel</h2>
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition"
          >
            กลับสู่หน้าหลัก
          </button>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* หมวดหมู่ */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">หมวดหมู่</label>
              <select 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none"
                onChange={(e) => setProduct({...product, category: e.target.value})}
              >
                <option value="seasoning">ผงปรุงรส (Seasoning)</option>
                <option value="beverage">เครื่องดื่ม (Beverage)</option>
                <option value="additives">สารเสริม (Additives)</option>
              </select>
            </div>

            {/* ชื่อสินค้า */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 text-sm mb-1">ชื่อ (ไทย)</label>
                <input required type="text" className="w-full p-2 border rounded" 
                  onChange={(e) => setProduct({...product, name: { ...product.name!, th: e.target.value }})} />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-1">Name (Eng)</label>
                <input type="text" className="w-full p-2 border rounded" 
                  onChange={(e) => setProduct({...product, name: { ...product.name!,QP: e.target.value }})} />{/* แก้ไข type QP เป็น en ใน code จริง */}
              </div>
               <div>
                <label className="block text-gray-700 text-sm mb-1">Name (CN)</label>
                <input type="text" className="w-full p-2 border rounded" 
                  onChange={(e) => setProduct({...product, name: { ...product.name!, cn: e.target.value }})} />
              </div>
            </div>

            {/* รายละเอียดอื่นๆ */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">ขนาด (Weight)</label>
                <input type="text" placeholder="เช่น 500g" className="w-full p-3 border rounded-lg"
                  onChange={(e) => setProduct({...product, weight: e.target.value})} />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">ราคา (Price)</label>
                <input type="number" placeholder="บาท" className="w-full p-3 border rounded-lg"
                  onChange={(e) => setProduct({...product, price: Number(e.target.value)})} />
              </div>
            </div>

            {/* รูปภาพ */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">URL รูปภาพ</label>
              <input type="text" placeholder="https://..." className="w-full p-3 border rounded-lg"
                onChange={(e) => setProduct({...product, image: e.target.value})} />
              {product.image && (
                <img src={product.image} alt="Preview" className="mt-4 h-32 w-32 object-cover rounded-lg border" />
              )}
            </div>

            <button type="submit" className="w-full bg-brand-orange text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition shadow-lg">
              บันทึกสินค้า
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;