import React, { useState, useEffect, ChangeEvent } from 'react';
import { db, storage } from '../firebase'; 
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Product, HeroSlide } from '../types';
import { PRODUCTS } from '../constants'; 
import { Trash2, Plus, Upload, PlayCircle, Loader2, ArrowLeft, Download, Edit, Search, X, CheckCircle2 } from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'hero'>('products');
  const [loading, setLoading] = useState(false);

  // --- STATE: Products ---
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // สำหรับระบบ Update (Edit)
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState: Partial<Product> = {
    category: 'seasoning',
    name: { th: '', en: '', cn: '' },
    weight: '',
    price: 0,
    image: '',
    isNew: false
  };
  const [productForm, setProductForm] = useState<Partial<Product>>(initialFormState);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // --- STATE: Hero Slides ---
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState('');

  // --- EFFECT: ดึงข้อมูล Real-time ---
  useEffect(() => {
    const qProduct = query(collection(db, 'products'), orderBy('category'));
    const unsubProduct = onSnapshot(qProduct, (snapshot) => {
      const loadedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(loadedProducts);
    });

    const qHero = query(collection(db, 'hero_slides'));
    const unsubHero = onSnapshot(qHero, (snapshot) => {
      const loadedSlides = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HeroSlide[];
      setSlides(loadedSlides);
    });

    return () => { unsubProduct(); unsubHero(); };
  }, []);

  // --- FUNCTIONS: รูปภาพ ---
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImageToStorage = async (file: File):Promise<string> => {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // --- FUNCTIONS: จัดการฟอร์ม ---
  const resetForm = () => {
    setProductForm(initialFormState);
    setEditingId(null);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setProductForm({
      category: product.category,
      name: product.name,
      weight: product.weight,
      price: product.price || 0,
      image: product.image,
      isNew: product.isNew || false
    });
    setPreviewUrl(product.image); // โชว์รูปเดิม
    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // เลื่อนขึ้นไปบนสุด
  };

  // --- FUNCTIONS: CRUD (Create, Update, Delete) ---
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name?.th || !productForm.category) return alert('กรุณากรอกชื่อและหมวดหมู่');
    
    setLoading(true);
    try {
      let imageUrl = productForm.image || ''; // ใช้รูปเดิมถ้าไม่มีการเลือกใหม่
      
      // ถ้ามีการเลือกไฟล์ใหม่ ให้อัปโหลด
      if (selectedFile) {
        imageUrl = await uploadImageToStorage(selectedFile);
      }

      const productData = {
        category: productForm.category,
        name: productForm.name,
        weight: productForm.weight,
        price: productForm.price,
        image: imageUrl,
        isNew: productForm.isNew,
        updatedAt: new Date()
      };

      if (editingId) {
        // อัปเดตข้อมูลเดิม (UPDATE)
        await updateDoc(doc(db, 'products', editingId), productData);
        alert('อัปเดตสินค้าเรียบร้อย!');
      } else {
        // เพิ่มข้อมูลใหม่ (CREATE)
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: new Date()
        });
        alert('เพิ่มสินค้าใหม่เรียบร้อย!');
      }

      resetForm();
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบลบสินค้านี้แบบถาวร?')) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  const handleImportInitialData = async () => {
    if (!confirm('ต้องการนำเข้าสินค้าทั้งหมด 30+ รายการ ลงในฐานข้อมูลหรือไม่?\n(กดแค่ครั้งแรก)')) return;
    setLoading(true);
    try {
      for (const item of PRODUCTS) {
        await addDoc(collection(db, 'products'), {
          category: item.category,
          name: item.name,
          weight: item.weight,
          price: item.price || 0,
          image: item.image,
          isNew: item.isNew || false,
          createdAt: new Date()
        });
      }
      alert('นำเข้าสินค้าสำเร็จแล้ว!');
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการนำเข้าข้อมูล');
    }
    setLoading(false);
  };
  // --- FUNCTIONS: จัดการวิดีโอ (Hero) ---
  const handleAddVideo = async () => {
    if (!newVideoUrl) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'hero_slides'), {
        url: newVideoUrl,
        type: 'video',
        createdAt: new Date()
      });
      setNewVideoUrl('');
      alert('เพิ่มวิดีโอสำเร็จ!');
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการเพิ่มวิดีโอ');
    }
    setLoading(false);
  };

  const handleDeleteVideo = async (id: string) => {
    if (confirm('คุณต้องการลบวิดีโอนี้ใช่หรือไม่?')) {
      await deleteDoc(doc(db, 'hero_slides', id));
    }
  };

  // --- Filtered Products (Search) ---
  const filteredProducts = products.filter(p => 
    p.name.th.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- STYLES ---
  const inputStyle = "w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition text-sm";
  const labelStyle = "block text-gray-700 font-semibold mb-1 text-sm";

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-brand-dark text-white p-6 flex justify-between items-center shadow-md z-10 relative">
          <div>
            <h2 className="text-2xl font-bold font-display text-brand-orange flex items-center gap-2">
              Donut Brand <span className="text-white font-normal text-lg bg-white/20 px-2 py-0.5 rounded-lg">Admin Panel</span>
            </h2>
            <p className="text-sm text-gray-300 mt-1">ระบบจัดการเนื้อหาเว็บไซต์ (CMS)</p>
          </div>
          <button onClick={onBack} className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-medium transition shadow-sm border border-gray-700">
            <ArrowLeft size={18} className="mr-2" /> กลับหน้าเว็บหลัก
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-gray-50 border-b flex px-6 space-x-6 pt-4 overflow-x-auto">
          <button onClick={() => setActiveTab('products')} className={`pb-3 font-bold border-b-4 transition whitespace-nowrap ${activeTab === 'products' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
            จัดการสินค้าทั้งหมด ({products.length})
          </button>
          <button onClick={() => setActiveTab('hero')} className={`pb-3 font-bold border-b-4 transition whitespace-nowrap ${activeTab === 'hero' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
            จัดการวิดีโอหน้าแรก (Hero)
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="p-6 md:p-8 bg-white min-h-[600px]">
          
          {/* ================= TAB: PRODUCTS ================= */}
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Form (Sticky) */}
              <div className="lg:col-span-4">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 sticky top-8">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                      {editingId ? <Edit size={20} className="mr-2 text-blue-600" /> : <Plus size={20} className="mr-2 text-green-600" />}
                      {editingId ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่'}
                    </h3>
                    {editingId && (
                      <button onClick={resetForm} className="text-xs flex items-center text-red-500 hover:text-red-700 bg-red-50 px-2 py-1 rounded-md">
                        <X size={14} className="mr-1" /> ยกเลิก
                      </button>
                    )}
                  </div>
                  
                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    {/* Image Upload */}
                    <div>
                      <label className={labelStyle}>รูปภาพสินค้า</label>
                      <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-brand-orange/30 border-dashed rounded-xl cursor-pointer bg-white hover:bg-orange-50 transition relative overflow-hidden group">
                        {previewUrl ? (
                           <div className="relative w-full h-full">
                             <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                               <p className="text-white text-sm font-bold flex items-center"><Upload size={16} className="mr-1"/> เปลี่ยนรูป</p>
                             </div>
                           </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                            <Upload size={28} className="mb-2 text-brand-orange" />
                            <p className="text-xs font-medium">คลิกเพื่ออัปโหลดรูปภาพ</p>
                          </div>
                        )}
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleFileChange} />
                      </div>
                    </div>

                    {/* Inputs */}
                    <div>
                      <label className={labelStyle}>ชื่อสินค้า (TH) <span className="text-red-500">*</span></label>
                      <input required type="text" placeholder="เช่น ผงปรุงรสบาร์บีคิว" className={inputStyle} value={productForm.name?.th} onChange={(e) => setProductForm({...productForm, name: { ...productForm.name!, th: e.target.value }})} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelStyle}>ชื่อ (EN)</label>
                        <input type="text" placeholder="BBQ Seasoning" className={inputStyle} value={productForm.name?.en} onChange={(e) => setProductForm({...productForm, name: { ...productForm.name!, th: productForm.name?.th || '', cn: productForm.name?.cn || '', en: e.target.value }})} />
                      </div>
                      <div>
                        <label className={labelStyle}>ชื่อ (CN)</label>
                        <input type="text" placeholder="烧烤调料" className={inputStyle} value={productForm.name?.cn} onChange={(e) => setProductForm({...productForm, name: { ...productForm.name!, th: productForm.name?.th || '', en: productForm.name?.en || '', cn: e.target.value }})} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelStyle}>หมวดหมู่</label>
                        <select className={inputStyle} value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})}>
                          <option value="seasoning">ผงปรุงรส</option>
                          <option value="beverage">เครื่องดื่ม</option>
                          <option value="additives">สารเสริม/วัตถุดิบ</option>
                        </select>
                      </div>
                      <div>
                         <label className={labelStyle}>ขนาดบรรจุ</label>
                         <input type="text" placeholder="เช่น 500g" className={inputStyle} value={productForm.weight} onChange={(e) => setProductForm({...productForm, weight: e.target.value})} />
                      </div>
                    </div>

                    <div>
                      <label className={labelStyle}>ราคา (บาท)</label>
                      <input type="number" placeholder="0 = โชว์ว่าติดต่อสอบถาม" className={inputStyle} value={productForm.price || ''} onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})} />
                    </div>

                    {/* Toggle IS NEW */}
                    <div className="flex items-center mt-2 bg-white p-3 rounded-lg border border-gray-200">
                      <input 
                        type="checkbox" 
                        id="isNewToggle" 
                        className="w-5 h-5 text-brand-orange rounded focus:ring-brand-orange cursor-pointer"
                        checked={productForm.isNew || false}
                        onChange={(e) => setProductForm({...productForm, isNew: e.target.checked})}
                      />
                      <label htmlFor="isNewToggle" className="ml-2 text-sm font-semibold text-gray-700 cursor-pointer select-none">
                        ติดป้าย "สินค้าใหม่ (NEW)"
                      </label>
                    </div>

                    <button disabled={loading} type="submit" className={`w-full text-white font-bold py-3 rounded-xl transition shadow-lg flex justify-center items-center ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-brand-orange hover:bg-orange-600'}`}>
                      {loading ? <Loader2 className="animate-spin mr-2" /> : editingId ? <CheckCircle2 className="mr-2" size={20} /> : <Plus className="mr-2" size={20} />} 
                      {editingId ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มสินค้า'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: List & Filter */}
              <div className="lg:col-span-8">
                
                {/* Top bar (Search & Import) */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 gap-4">
                  <div className="relative w-full sm:w-1/2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="ค้นหาชื่อสินค้า (ไทย/อังกฤษ)..." 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  {products.length === 0 && (
                    <button 
                      onClick={handleImportInitialData}
                      disabled={loading} 
                      className="flex items-center text-sm bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 w-full sm:w-auto justify-center"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Download size={16} className="mr-2" />}
                      นำเข้าสินค้าจากระบบเดิม
                    </button>
                  )}
                </div>

                {/* Table/List */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="max-h-[700px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10 text-sm">
                        <tr>
                          <th className="p-4 font-semibold border-b">รูปภาพ</th>
                          <th className="p-4 font-semibold border-b">ชื่อสินค้า</th>
                          <th className="p-4 font-semibold border-b hidden sm:table-cell">หมวดหมู่</th>
                          <th className="p-4 font-semibold border-b text-right">จัดการ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-gray-400">ไม่พบข้อมูลสินค้า</td>
                          </tr>
                        ) : (
                          filteredProducts.map((p) => (
                            <tr key={p.id} className={`hover:bg-orange-50/50 transition ${editingId === p.id ? 'bg-blue-50' : ''}`}>
                              <td className="p-4 w-24">
                                <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden border border-gray-200 relative">
                                  {p.isNew && <div className="absolute top-0 right-0 bg-red-500 w-3 h-3 rounded-bl-lg"></div>}
                                  <img src={p.image || 'https://via.placeholder.com/100'} alt={p.name.th} className="w-full h-full object-cover" />
                                </div>
                              </td>
                              <td className="p-4">
                                <p className="font-bold text-gray-800">{p.name.th}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{p.name.en || '-'}</p>
                                <div className="flex gap-2 mt-1">
                                  <span className="inline-block bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded">{p.weight}</span>
                                  {p.price > 0 && <span className="inline-block bg-orange-100 text-brand-orange font-bold text-[10px] px-2 py-0.5 rounded">฿{p.price}</span>}
                                </div>
                              </td>
                              <td className="p-4 hidden sm:table-cell">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  p.category === 'seasoning' ? 'bg-yellow-100 text-yellow-800' :
                                  p.category === 'beverage' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {p.category}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => handleEditClick(p)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition tooltip" title="แก้ไข">
                                    <Edit size={18} />
                                  </button>
                                  <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition tooltip" title="ลบ">
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= TAB: HERO VIDEO ================= */}
          {activeTab === 'hero' && (
             // --- ส่วน Hero คงไว้ตามเดิม ---
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
                  <PlayCircle className="text-brand-orange" /> เพิ่มวิดีโอส่วนบนหน้าแรก
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input type="text" placeholder="วาง URL วิดีโอ (เช่น .mp4 หรือ Firebase Storage URL)" className={inputStyle}
                    value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} />
                  <button onClick={handleAddVideo} disabled={loading || !newVideoUrl} className="bg-brand-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 disabled:opacity-50 whitespace-nowrap shadow-md">
                    {loading ? 'กำลังเพิ่ม...' : 'เพิ่มวิดีโอ'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {slides.map((slide, index) => (
                  <div key={slide.id} className="relative group bg-gray-900 rounded-2xl overflow-hidden aspect-video shadow-lg border border-gray-200">
                    <video src={slide.url} className="w-full h-full object-cover opacity-80" muted autoPlay loop playsInline />
                    <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full font-bold backdrop-blur-sm">
                      สไลด์ที่ {index + 1}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/50 backdrop-blur-sm">
                      <button onClick={() => handleDeleteVideo(slide.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 flex items-center shadow-lg transform hover:scale-105 transition">
                        <Trash2 size={18} className="mr-2" /> ลบวิดีโอนี้
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminPanel;