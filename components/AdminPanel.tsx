import React, { useState, useEffect, ChangeEvent } from 'react';
import { db, storage } from '../firebase'; // ดึง "ท่อ" ที่เราสร้างไว้มาใช้
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Product, HeroSlide } from '../types';
import { Trash2, Plus, Upload, PlayCircle, Loader2, ArrowLeft } from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'hero'>('products');
  const [loading, setLoading] = useState(false);

  // --- STATE: Products ---
  const [products, setProducts] = useState<Product[]>([]);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    category: 'seasoning',
    name: { th: '', en: '', cn: '' },
    description: { th: '', en: '', cn: '' },
    weight: '',
    price: 0,
    image: '',
    isNew: true
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // --- STATE: Hero Slides ---
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState('');

  // --- EFFECT: ดึงข้อมูล Real-time จาก Firebase ---
  useEffect(() => {
    // 1. Subscribe ข้อมูลสินค้า
    const qProduct = query(collection(db, 'products'), orderBy('category'));
    const unsubProduct = onSnapshot(qProduct, (snapshot) => {
      const loadedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(loadedProducts);
    });

    // 2. Subscribe ข้อมูลวิดีโอ Hero
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

  // --- FUNCTION: อัปโหลดรูปภาพ ---
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

  // --- FUNCTION: จัดการสินค้า (Add / Delete) ---
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name?.th || !productForm.category) return alert('กรุณากรอกชื่อและหมวดหมู่');
    
    setLoading(true);
    try {
      let imageUrl = productForm.image || '';
      
      // ถ้ามีการเลือกไฟล์ ให้อัปโหลดก่อน
      if (selectedFile) {
        imageUrl = await uploadImageToStorage(selectedFile);
      }

      // บันทึกลง Firestore
      await addDoc(collection(db, 'products'), {
        ...productForm,
        image: imageUrl,
        createdAt: new Date()
      });

      alert('บันทึกสินค้าเรียบร้อย!');
      // Reset Form
      setProductForm({
        category: 'seasoning',
        name: { th: '', en: '', cn: '' },
        description: { th: '', en: '', cn: '' },
        weight: '',
        price: 0,
        image: '',
        isNew: true
      });
      setSelectedFile(null);
      setPreviewUrl('');
    } catch (error) {
      console.error("Error adding product: ", error);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  // --- FUNCTION: จัดการวิดีโอ (Add / Delete) ---
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
    } catch (error) {
      console.error("Error adding video: ", error);
      alert('เกิดข้อผิดพลาด');
    }
    setLoading(false);
  };

  const handleDeleteVideo = async (id: string) => {
    if (confirm('ลบวิดีโอนี้?')) {
      await deleteDoc(doc(db, 'hero_slides', id));
    }
  };

  // --- STYLES ---
  const inputStyle = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange outline-none transition";
  const labelStyle = "block text-gray-700 font-bold mb-2 text-sm";

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-brand-dark text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold font-display text-brand-orange">Admin Panel</h2>
            <p className="text-sm text-gray-400">ระบบจัดการหลังบ้าน (เชื่อมต่อ Firebase)</p>
          </div>
          <button onClick={onBack} className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition">
            <ArrowLeft size={16} className="mr-2" /> กลับหน้าหลัก
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-gray-50 border-b flex px-6 space-x-4 pt-4">
          <button 
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-2 font-bold border-b-4 transition ${activeTab === 'products' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            จัดการสินค้า
          </button>
          <button 
            onClick={() => setActiveTab('hero')}
            className={`pb-3 px-2 font-bold border-b-4 transition ${activeTab === 'hero' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            จัดการวิดีโอ (Hero)
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="p-6 md:p-8">
          
          {/* ================= TAB: PRODUCTS ================= */}
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left: Form เพิ่มสินค้า */}
              <div className="lg:col-span-1 space-y-6">
                <h3 className="text-lg font-bold text-brand-dark border-b pb-2">เพิ่มสินค้าใหม่</h3>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  
                  {/* Image Upload */}
                  <div>
                    <label className={labelStyle}>รูปภาพสินค้า</label>
                    <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition relative overflow-hidden">
                      {previewUrl ? (
                         <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                          <Upload size={32} className="mb-2" />
                          <p className="text-xs">คลิกเพื่ออัปโหลด</p>
                        </div>
                      )}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleFileChange} />
                    </div>
                  </div>

                  {/* Inputs */}
                  <div>
                    <label className={labelStyle}>ชื่อสินค้า (ไทย)</label>
                    <input required type="text" className={inputStyle} 
                      value={productForm.name?.th}
                      onChange={(e) => setProductForm({...productForm, name: { ...productForm.name!, th: e.target.value }})} />
                  </div>
                  <div>
                    <label className={labelStyle}>หมวดหมู่</label>
                    <select className={inputStyle} value={productForm.category}
                      onChange={(e) => setProductForm({...productForm, category: e.target.value})}>
                      <option value="seasoning">ผงปรุงรส</option>
                      <option value="beverage">เครื่องดื่ม</option>
                      <option value="additives">สารเสริม</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="ขนาด (500g)" className={inputStyle} 
                      value={productForm.weight} onChange={(e) => setProductForm({...productForm, weight: e.target.value})} />
                    <input type="number" placeholder="ราคา" className={inputStyle} 
                      value={productForm.price || ''} onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})} />
                  </div>

                  <button disabled={loading} type="submit" className="w-full bg-brand-orange text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition shadow-lg flex justify-center items-center">
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2" />} 
                    บันทึกสินค้า
                  </button>
                </form>
              </div>

              {/* Right: รายการสินค้าที่มีอยู่ */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-bold text-brand-dark border-b pb-2 mb-4">รายการสินค้าทั้งหมด ({products.length})</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                  {products.map((p) => (
                    <div key={p.id} className="flex bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition">
                      <img src={p.image || 'https://via.placeholder.com/100'} alt={p.name.th} className="w-20 h-20 object-cover rounded-md bg-gray-200" />
                      <div className="ml-4 flex-1">
                        <h4 className="font-bold text-brand-dark">{p.name.th}</h4>
                        <p className="text-xs text-gray-500">{p.category} • {p.weight}</p>
                        <p className="text-brand-orange font-bold text-sm mt-1">{p.price ? `฿${p.price}` : '-'}</p>
                      </div>
                      <button onClick={() => handleDeleteProduct(p.id)} className="text-gray-400 hover:text-red-500 p-2">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB: HERO ================= */}
          {activeTab === 'hero' && (
            <div className="space-y-8">
              {/* Add Video */}
              <div className="bg-gray-50 p-6 rounded-xl border">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <PlayCircle className="text-brand-orange" /> เพิ่มวิดีโอหน้าแรก
                </h3>
                <div className="flex gap-4">
                  <input type="text" placeholder="วาง URL วิดีโอ (.mp4)" className={inputStyle}
                    value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} />
                  <button onClick={handleAddVideo} disabled={loading} className="bg-brand-orange text-white px-6 rounded-lg font-bold hover:bg-orange-600">
                    {loading ? '...' : 'เพิ่ม'}
                  </button>
                </div>
              </div>

              {/* Video List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {slides.map((slide, index) => (
                  <div key={slide.id} className="relative group bg-black rounded-xl overflow-hidden aspect-video">
                    <video src={slide.url} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">#{index + 1}</div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40">
                      <button onClick={() => handleDeleteVideo(slide.id)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                        <Trash2 size={24} />
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