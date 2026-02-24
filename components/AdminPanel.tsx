import React, { useState, useEffect, ChangeEvent } from 'react';
import { db, storage, auth } from '../firebase'; 
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Product, HeroSlide, ProductVariant } from '../types';
import { Trash2, Plus, Upload, PlayCircle, Loader2, ArrowLeft, Edit, Search, X, CheckCircle2, Star, LayoutDashboard, EyeOff, Eye, Image as ImageIcon, LogOut, Lock, DownloadCloud } from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

interface Banner { id: string; url: string; createdAt: any; }

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  // --- Auth State ---
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  // --- Tabs ---
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'banners' | 'hero'>('overview');
  const [loading, setLoading] = useState(false);

  // --- Data State ---
  const [products, setProducts] = useState<Product[]>([]);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  
  // --- Form State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  // State สำหรับ Video
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);

  const initialFormState: Partial<Product & { isHidden?: boolean }> = {
    category: 'seasoning',
    name: { th: '', en: '', cn: '' },
    variants: [{ weight: '', price: 0 }], 
    image: '',
    isNew: false,
    isBestSeller: false,
    isHidden: false
  };
  const [productForm, setProductForm] = useState<any>(initialFormState);

  // --- Listeners ---
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const qProduct = query(collection(db, 'products'), orderBy('category'));
    const unsubProduct = onSnapshot(qProduct, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);
    });

    const unsubHero = onSnapshot(query(collection(db, 'hero_slides')), (snapshot) => {
      setSlides(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as HeroSlide[]);
    });

    const unsubBanners = onSnapshot(query(collection(db, 'banners')), (snapshot) => {
      setBanners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Banner[]);
    });

    return () => { unsubProduct(); unsubHero(); unsubBanners(); };
  }, [user]);

  // --- Auth Functions ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await signInWithEmailAndPassword(auth, email, password); } 
    catch (error) { alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง โปรดตั้งค่าใน Firebase Authentication'); }
    setLoading(false);
  };
  const handleLogout = () => signOut(auth);

  // --- File Upload ---
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImageToStorage = async (file: File, folder: string = 'products'):Promise<string> => {
    const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // อัปโหลดวิดีโอ
  const uploadVideoToStorage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `hero_videos/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  // --- Form Handlers ---
  const resetForm = () => {
    setProductForm(initialFormState);
    setEditingId(null);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    let initVariants: ProductVariant[] = [];
    if (product.variants && product.variants.length > 0) initVariants = product.variants;
    else if (product.weight) initVariants = [{ weight: product.weight, price: product.price || 0 }];
    else initVariants = [{ weight: '', price: 0 }];

    setProductForm({
      category: product.category,
      name: product.name,
      variants: initVariants,
      image: product.image,
      isNew: product.isNew || false,
      isBestSeller: product.isBestSeller || false,
      isHidden: (product as any).isHidden || false
    });
    setPreviewUrl(product.image);
    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: string | number) => {
    const newVariants = [...(productForm.variants || [])];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setProductForm({ ...productForm, variants: newVariants });
  };
  const addVariant = () => setProductForm({ ...productForm, variants: [...(productForm.variants || []), { weight: '', price: 0 }] });
  const removeVariant = (index: number) => {
    const newVariants = productForm.variants?.filter((_:any, i:number) => i !== index);
    setProductForm({ ...productForm, variants: newVariants });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name?.th || !productForm.category) return alert('กรุณากรอกชื่อและหมวดหมู่');
    if (!productForm.variants || productForm.variants.length === 0) return alert('กรุณาเพิ่มขนาดอย่างน้อย 1 ไซส์');
    
    setLoading(true);
    try {
      let imageUrl = productForm.image || '';
      if (selectedFile) imageUrl = await uploadImageToStorage(selectedFile);

      const productData = {
        category: productForm.category,
        name: productForm.name,
        variants: productForm.variants,
        image: imageUrl,
        isNew: productForm.isNew,
        isBestSeller: productForm.isBestSeller,
        isHidden: productForm.isHidden || false,
        updatedAt: new Date()
      };

      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), productData);
        alert('อัปเดตสินค้าเรียบร้อย!');
      } else {
        await addDoc(collection(db, 'products'), { ...productData, createdAt: new Date() });
        alert('เพิ่มสินค้าใหม่เรียบร้อย!');
      }
      resetForm();
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึก');
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('ลบสินค้านี้แบบถาวร?')) await deleteDoc(doc(db, 'products', id));
  };

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    await updateDoc(doc(db, 'products', id), { isHidden: !currentStatus });
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name(TH)', 'Category', 'Price(1st Variant)', 'Status'];
    const rows = products.map(p => [p.id, `"${p.name.th}"`, p.category, p.variants?.[0]?.price || 0, (p as any).isHidden ? 'Hidden' : 'Visible']);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Donut_Products_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleAddVideo = async () => {
    if (!newVideoUrl && !selectedVideoFile) return alert('กรุณาใส่ URL วิดีโอ หรืออัปโหลดไฟล์วิดีโอจากเครื่อง');
    setLoading(true);
    try {
      let finalUrl = newVideoUrl;
      // ถ้ามีการเลือกไฟล์วิดีโอจากเครื่อง ให้อัปโหลดขึ้น Storage ก่อน
      if (selectedVideoFile) {
        finalUrl = await uploadVideoToStorage(selectedVideoFile);
      }
      
      await addDoc(collection(db, 'hero_slides'), { url: finalUrl, type: 'video', createdAt: new Date() });
      
      // ล้างค่าฟอร์ม
      setNewVideoUrl('');
      setSelectedVideoFile(null);
      const fileInput = document.getElementById('videoFileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      alert('เพิ่มวิดีโอสำเร็จ!');
    } catch (error) { 
      console.error(error);
      alert('เกิดข้อผิดพลาดในการอัปโหลดวิดีโอ'); 
    }
    setLoading(false);
  };

  const handleDeleteVideo = async (id: string) => {
    if (confirm('ลบวิดีโอนี้ใช่หรือไม่?')) await deleteDoc(doc(db, 'hero_slides', id));
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return alert('กรุณาเลือกรูปภาพ');
    setLoading(true);
    try {
      const url = await uploadImageToStorage(selectedFile, 'banners');
      await addDoc(collection(db, 'banners'), { url, createdAt: new Date() });
      setSelectedFile(null); setPreviewUrl(''); alert('อัปโหลดแบนเนอร์สำเร็จ');
    } catch (error) { alert('เกิดข้อผิดพลาด'); }
    setLoading(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.th.toLowerCase().includes(searchTerm.toLowerCase()) || (p.name.en && p.name.en.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const inputStyle = "w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition text-sm";
  const labelStyle = "block text-gray-700 font-semibold mb-1 text-sm";

  // --- UI: Loading & Login ---
  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-brand-orange" size={40}/></div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-orange"></div>
          <div className="flex justify-center mb-6">
            <div className="bg-orange-50 p-4 rounded-full"><Lock className="text-brand-orange" size={32} /></div>
          </div>
          <h2 className="text-2xl font-bold font-display text-center text-brand-dark mb-6">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-700">อีเมล (Email)</label>
              <input type="email" required className="w-full p-3 mt-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none transition" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700">รหัสผ่าน (Password)</label>
              <input type="password" required className="w-full p-3 mt-1 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-orange outline-none transition" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-brand-orange text-white font-bold p-3.5 rounded-xl hover:bg-orange-600 transition shadow-lg flex justify-center mt-6">
              {loading ? <Loader2 className="animate-spin" /> : 'เข้าสู่ระบบ'}
            </button>
          </form>
          <button onClick={onBack} className="w-full mt-6 flex items-center justify-center text-gray-500 text-sm hover:text-brand-dark transition">
            <ArrowLeft size={16} className="mr-1"/> กลับไปหน้าเว็บหลัก
          </button>
        </div>
      </div>
    );
  }

  // --- UI: Main Dashboard ---
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-brand-dark text-white p-6 flex flex-col sm:flex-row justify-between items-center shadow-md z-10 relative gap-4">
          <div>
            <h2 className="text-2xl font-bold font-display text-brand-orange flex items-center gap-2">Admin Panel</h2>
            <p className="text-xs text-gray-400 mt-1">Logged in as {user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="flex items-center px-4 py-2 bg-red-500/20 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/30 transition">
              <LogOut size={16} className="mr-2" /> ออกจากระบบ
            </button>
            <button onClick={onBack} className="flex items-center px-4 py-2 bg-gray-800 rounded-xl text-sm font-medium hover:bg-gray-700 transition border border-gray-700">
              <ArrowLeft size={16} className="mr-2" /> กลับหน้าเว็บ
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-50 border-b flex px-6 space-x-6 pt-4 overflow-x-auto">
          <button onClick={() => setActiveTab('overview')} className={`pb-3 font-bold border-b-4 transition whitespace-nowrap ${activeTab === 'overview' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-800'}`}><LayoutDashboard size={16} className="inline mr-1" /> ภาพรวมระบบ</button>
          <button onClick={() => setActiveTab('products')} className={`pb-3 font-bold border-b-4 transition whitespace-nowrap ${activeTab === 'products' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>จัดการสินค้า ({products.length})</button>
          <button onClick={() => setActiveTab('banners')} className={`pb-3 font-bold border-b-4 transition whitespace-nowrap ${activeTab === 'banners' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>แบนเนอร์โปรโมชั่น</button>
          <button onClick={() => setActiveTab('hero')} className={`pb-3 font-bold border-b-4 transition whitespace-nowrap ${activeTab === 'hero' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>วิดีโอหน้าแรก</button>
        </div>

        <div className="p-6 md:p-8 bg-white min-h-[600px]">
          
          {/* === OVERVIEW TAB === */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-md text-white">
                  <p className="text-blue-100 text-sm font-bold flex items-center"><LayoutDashboard size={16} className="mr-2" /> สินค้าทั้งหมดในระบบ</p>
                  <h4 className="text-5xl font-display mt-3 font-bold">{products.length} <span className="text-xl font-normal">รายการ</span></h4>
                </div>
                <div className="bg-gradient-to-br from-brand-yellow to-brand-orange p-6 rounded-2xl shadow-md text-white">
                  <p className="text-yellow-100 text-sm font-bold flex items-center"><Star size={16} className="mr-2" /> สินค้าขายดี (Best Sellers)</p>
                  <h4 className="text-5xl font-display mt-3 font-bold">{products.filter(p=>p.isBestSeller).length} <span className="text-xl font-normal">รายการ</span></h4>
                </div>
                <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-6 rounded-2xl shadow-md text-white">
                  <p className="text-gray-200 text-sm font-bold flex items-center"><EyeOff size={16} className="mr-2" /> สินค้าที่ถูกซ่อน (หมดสต๊อก)</p>
                  <h4 className="text-5xl font-display mt-3 font-bold">{products.filter(p=>(p as any).isHidden).length} <span className="text-xl font-normal">รายการ</span></h4>
                </div>
              </div>
            </div>
          )}

          {/* === PRODUCTS TAB === */}
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* === LEFT: FORM === */}
              <div className="lg:col-span-4">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 sticky top-8">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                      {editingId ? <Edit size={20} className="mr-2 text-blue-600" /> : <Plus size={20} className="mr-2 text-green-600" />}
                      {editingId ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มสินค้าใหม่'}
                    </h3>
                    {editingId && <button onClick={resetForm} className="text-xs text-red-500 flex items-center bg-red-50 px-2 py-1 rounded"><X size={14}/> ยกเลิก</button>}
                  </div>
                  
                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    <div>
                      <label className={labelStyle}>รูปภาพสินค้า</label>
                      <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-brand-orange/30 border-dashed rounded-xl cursor-pointer bg-white relative overflow-hidden group hover:bg-orange-50 transition">
                        {previewUrl ? <img src={previewUrl} className="w-full h-full object-contain p-2" /> : <div className="text-gray-400 text-center"><Upload size={28} className="mx-auto mb-2 text-brand-orange" /><p className="text-xs font-medium">คลิกอัปโหลดรูป</p></div>}
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleFileChange} />
                      </div>
                    </div>

                    <div>
                      <label className={labelStyle}>ชื่อสินค้า (TH) *</label>
                      <input required type="text" className={inputStyle} value={productForm.name?.th} onChange={(e) => setProductForm({...productForm, name: { ...productForm.name!, th: e.target.value }})} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={labelStyle}>ชื่อ (EN)</label><input type="text" className={inputStyle} value={productForm.name?.en} onChange={(e) => setProductForm({...productForm, name: { ...productForm.name!, th: productForm.name?.th || '', cn: productForm.name?.cn || '', en: e.target.value }})} /></div>
                      <div><label className={labelStyle}>ชื่อ (CN)</label><input type="text" className={inputStyle} value={productForm.name?.cn} onChange={(e) => setProductForm({...productForm, name: { ...productForm.name!, th: productForm.name?.th || '', en: productForm.name?.en || '', cn: e.target.value }})} /></div>
                    </div>

                    <div>
                      <label className={labelStyle}>หมวดหมู่</label>
                      <select className={inputStyle} value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})}>
                        <option value="seasoning">ผงปรุงรส</option>
                        <option value="beverage">เครื่องดื่ม</option>
                        <option value="additives">สารเสริม/วัตถุดิบ</option>
                      </select>
                    </div>

                    {/* === เพิ่มหลายไซส์หลายราคา === */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-bold text-brand-dark">ตั้งค่าขนาดและราคา</label>
                      </div>
                      
                      {productForm.variants?.map((v:any, idx:number) => (
                        <div key={idx} className="flex gap-2 items-center mb-2">
                          <input type="text" placeholder="เช่น 500g" className={`${inputStyle} w-1/2`} value={v.weight} onChange={(e) => handleVariantChange(idx, 'weight', e.target.value)} required />
                          <input type="number" placeholder="ราคา" className={`${inputStyle} w-1/2`} value={v.price || ''} onChange={(e) => handleVariantChange(idx, 'price', Number(e.target.value))} required />
                          {productForm.variants!.length > 1 && (
                             <button type="button" onClick={() => removeVariant(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><Trash2 size={16} /></button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={addVariant} className="text-brand-orange text-sm font-bold flex items-center mt-2 hover:underline">
                        <Plus size={16} className="mr-1" /> เพิ่มไซส์สินค้า
                      </button>
                    </div>

                    {/* ป้ายกำกับ */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer">
                        <input type="checkbox" id="isBestSeller" className="w-4 h-4 text-brand-orange rounded cursor-pointer" checked={productForm.isBestSeller || false} onChange={(e) => setProductForm({...productForm, isBestSeller: e.target.checked})} />
                        <label htmlFor="isBestSeller" className="ml-2 text-sm font-semibold text-gray-700 flex items-center cursor-pointer select-none"><Star size={14} className="text-brand-yellow mr-1" /> ขายดี</label>
                      </div>
                      <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer">
                        <input type="checkbox" id="isNew" className="w-4 h-4 text-brand-orange rounded cursor-pointer" checked={productForm.isNew || false} onChange={(e) => setProductForm({...productForm, isNew: e.target.checked})} />
                        <label htmlFor="isNew" className="ml-2 text-sm font-semibold text-gray-700 cursor-pointer text-red-500 select-none">NEW ใหม่</label>
                      </div>
                    </div>

                    <button disabled={loading} type="submit" className={`w-full text-white font-bold py-3.5 rounded-xl transition shadow-lg flex justify-center items-center mt-4 ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-brand-orange hover:bg-orange-600'}`}>
                      {loading ? <Loader2 className="animate-spin mr-2" /> : editingId ? <CheckCircle2 className="mr-2" size={20} /> : <Plus className="mr-2" size={20} />} 
                      {editingId ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}
                    </button>
                  </form>
                </div>
              </div>

              {/* === RIGHT: LIST === */}
              <div className="lg:col-span-8">
                <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 gap-4">
                  <div className="relative w-full sm:w-1/2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="ค้นหาชื่อสินค้า..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <button onClick={handleExportCSV} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-bold shadow-sm w-full sm:w-auto justify-center transition">
                    <DownloadCloud size={16}/> Export Excel
                  </button>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="max-h-[700px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10 text-sm">
                        <tr>
                          <th className="p-4 font-semibold border-b">สินค้า</th>
                          <th className="p-4 font-semibold border-b">ขนาด / ราคา</th>
                          <th className="p-4 font-semibold border-b text-center">การแสดงผล</th>
                          <th className="p-4 font-semibold border-b text-right">จัดการ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((p) => {
                           const vList = p.variants?.length ? p.variants : (p.weight ? [{weight: p.weight, price: p.price}] : []);
                           const isHidden = (p as any).isHidden;
                           return (
                            <tr key={p.id} className={`hover:bg-orange-50/50 transition ${editingId === p.id ? 'bg-blue-50' : ''} ${isHidden ? 'opacity-60 bg-gray-50' : ''}`}>
                              <td className="p-4 flex items-center gap-3">
                                <img src={p.image || 'https://via.placeholder.com/100'} className="w-14 h-14 rounded-lg object-cover border border-gray-200 shadow-sm" />
                                <div>
                                  <p className="font-bold text-gray-800">{p.name.th}</p>
                                  <div className="flex gap-1 mt-1">
                                    {p.isBestSeller && <span className="text-[10px] bg-brand-yellow px-1.5 py-0.5 rounded text-brand-dark font-bold">Best Seller</span>}
                                    {p.isNew && <span className="text-[10px] bg-red-500 px-1.5 py-0.5 rounded text-white font-bold">New</span>}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 align-top">
                                <div className="space-y-1.5">
                                  {vList.map((v, i) => (
                                    <div key={i} className="text-xs flex gap-2 items-center">
                                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-medium">{v.weight || '?'}</span>
                                      <span className="text-brand-orange font-bold">฿{v.price || 0}</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="p-4 text-center align-middle">
                                 <button onClick={()=>toggleVisibility(p.id, isHidden)} className={`px-2.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition ${isHidden ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                                   {isHidden ? <><EyeOff size={14}/> ซ่อนอยู่</> : <><Eye size={14}/> แสดงผล</>}
                                 </button>
                              </td>
                              <td className="p-4 text-right align-middle">
                                <button onClick={() => handleEditClick(p)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"><Edit size={18} /></button>
                                <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition ml-1"><Trash2 size={18} /></button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === BANNERS TAB === */}
          {activeTab === 'banners' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-brand-dark"><ImageIcon className="text-brand-orange" /> อัปโหลดแบนเนอร์โปรโมชั่น</h3>
                <form onSubmit={handleAddBanner} className="flex flex-col sm:flex-row gap-4">
                  <input type="file" accept="image/*" onChange={handleFileChange} required className={inputStyle} />
                  <button type="submit" disabled={loading} className="bg-brand-orange text-white px-8 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition shadow-md whitespace-nowrap">
                    {loading ? 'กำลังอัปโหลด...' : 'เพิ่มแบนเนอร์'}
                  </button>
                </form>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((b) => (
                  <div key={b.id} className="relative group bg-gray-100 rounded-2xl overflow-hidden aspect-video shadow-md border border-gray-200">
                    <img src={b.url} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40 backdrop-blur-sm">
                      <button onClick={() => { if(confirm('ลบแบนเนอร์นี้?')) deleteDoc(doc(db, 'banners', b.id)) }} className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 shadow-lg transform hover:scale-105 transition">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === HERO TAB === */}
          {activeTab === 'hero' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><PlayCircle className="text-brand-orange" /> เพิ่มวิดีโอหน้าแรก</h3>
                
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <input 
                      type="text" 
                      placeholder="วาง URL วิดีโอ (ถ้ามี)" 
                      className={`${inputStyle} w-full`} 
                      value={newVideoUrl} 
                      onChange={(e) => setNewVideoUrl(e.target.value)} 
                      disabled={!!selectedVideoFile}
                    />
                    
                    <span className="font-bold text-gray-500">หรือ</span>
                    
                    <input 
                      id="videoFileInput" 
                      type="file" 
                      accept="video/mp4,video/webm" 
                      onChange={(e) => {
                        setSelectedVideoFile(e.target.files?.[0] || null);
                        if (e.target.files?.[0]) setNewVideoUrl(''); // เคลียร์ URL ถ้าเลือกไฟล์
                      }} 
                      className={`${inputStyle} w-full bg-white`} 
                      disabled={!!newVideoUrl}
                    />
                  </div>

                  <button 
                    onClick={handleAddVideo} 
                    disabled={loading || (!newVideoUrl && !selectedVideoFile)} 
                    className="bg-brand-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 shadow-md w-full sm:w-auto self-end flex justify-center items-center transition disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Plus className="mr-2" size={20} />} 
                    {loading ? 'กำลังอัปโหลด...' : 'เพิ่มวิดีโอเข้าสู่ระบบ'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {slides.map((slide) => (
                  <div key={slide.id} className="relative group bg-gray-900 rounded-2xl overflow-hidden aspect-video shadow-lg">
                    <video src={slide.url} className="w-full h-full object-cover opacity-80" muted autoPlay loop playsInline />
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