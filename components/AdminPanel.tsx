import React, { useState, useEffect, ChangeEvent } from 'react';
import { db, storage } from '../firebase'; 
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Product, HeroSlide, ProductVariant } from '../types';
import { Trash2, Plus, Upload, PlayCircle, Loader2, ArrowLeft, Edit, Search, X, CheckCircle2, Star } from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'hero'>('products');
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialFormState: Partial<Product> = {
    category: 'seasoning',
    name: { th: '', en: '', cn: '' },
    variants: [{ weight: '', price: 0 }], // ระบบใหม่รองรับหลายไซส์
    image: '',
    isNew: false,
    isBestSeller: false
  };
  const [productForm, setProductForm] = useState<Partial<Product>>(initialFormState);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [newVideoUrl, setNewVideoUrl] = useState('');

  useEffect(() => {
    const qProduct = query(collection(db, 'products'), orderBy('category'));
    const unsubProduct = onSnapshot(qProduct, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[]);
    });

    const qHero = query(collection(db, 'hero_slides'));
    const unsubHero = onSnapshot(qHero, (snapshot) => {
      setSlides(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as HeroSlide[]);
    });
    return () => { unsubProduct(); unsubHero(); };
  }, []);

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

  const resetForm = () => {
    setProductForm(initialFormState);
    setEditingId(null);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    
    // ดึงข้อมูลไซส์เก่ามาจัดรูปแบบใหม่
    let initVariants: ProductVariant[] = [];
    if (product.variants && product.variants.length > 0) {
      initVariants = product.variants;
    } else if (product.weight) {
      initVariants = [{ weight: product.weight, price: product.price || 0 }];
    } else {
      initVariants = [{ weight: '', price: 0 }];
    }

    setProductForm({
      category: product.category,
      name: product.name,
      variants: initVariants,
      image: product.image,
      isNew: product.isNew || false,
      isBestSeller: product.isBestSeller || false
    });
    setPreviewUrl(product.image);
    setSelectedFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // จัดการเพิ่ม/ลบไซส์ในฟอร์ม
  const handleVariantChange = (index: number, field: keyof ProductVariant, value: string | number) => {
    const newVariants = [...(productForm.variants || [])];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setProductForm({ ...productForm, variants: newVariants });
  };
  const addVariant = () => setProductForm({ ...productForm, variants: [...(productForm.variants || []), { weight: '', price: 0 }] });
  const removeVariant = (index: number) => {
    const newVariants = productForm.variants?.filter((_, i) => i !== index);
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

  const handleAddVideo = async () => {
    if (!newVideoUrl) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'hero_slides'), { url: newVideoUrl, type: 'video', createdAt: new Date() });
      setNewVideoUrl('');
      alert('เพิ่มวิดีโอสำเร็จ!');
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการเพิ่มวิดีโอ');
    }
    setLoading(false);
  };

  const handleDeleteVideo = async (id: string) => {
    if (confirm('ลบวิดีโอนี้ใช่หรือไม่?')) await deleteDoc(doc(db, 'hero_slides', id));
  };

  const filteredProducts = products.filter(p => 
    p.name.th.toLowerCase().includes(searchTerm.toLowerCase()) || (p.name.en && p.name.en.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const inputStyle = "w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition text-sm";
  const labelStyle = "block text-gray-700 font-semibold mb-1 text-sm";

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        <div className="bg-brand-dark text-white p-6 flex justify-between items-center shadow-md z-10 relative">
          <div>
            <h2 className="text-2xl font-bold font-display text-brand-orange">Admin Panel</h2>
          </div>
          <button onClick={onBack} className="flex items-center px-4 py-2 bg-gray-800 rounded-xl text-sm font-medium hover:bg-gray-700 transition">
            <ArrowLeft size={18} className="mr-2" /> กลับหน้าเว็บ
          </button>
        </div>

        <div className="bg-gray-50 border-b flex px-6 space-x-6 pt-4">
          <button onClick={() => setActiveTab('products')} className={`pb-3 font-bold border-b-4 transition ${activeTab === 'products' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>จัดการสินค้า ({products.length})</button>
          <button onClick={() => setActiveTab('hero')} className={`pb-3 font-bold border-b-4 transition ${activeTab === 'hero' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>วิดีโอหน้าแรก</button>
        </div>

        <div className="p-6 md:p-8 bg-white min-h-[600px]">
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
                      <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-brand-orange/30 border-dashed rounded-xl cursor-pointer bg-white relative overflow-hidden group">
                        {previewUrl ? <img src={previewUrl} className="w-full h-full object-contain p-2" /> : <div className="text-gray-400 text-center"><Upload size={28} className="mx-auto mb-2 text-brand-orange" /><p className="text-xs">คลิกอัปโหลดรูป</p></div>}
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
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-bold text-brand-dark flex items-center">ตั้งค่าขนาดและราคา</label>
                      </div>
                      
                      {productForm.variants?.map((v, idx) => (
                        <div key={idx} className="flex gap-2 items-center mb-2">
                          <input type="text" placeholder="เช่น 500g" className={`${inputStyle} w-1/2`} value={v.weight} onChange={(e) => handleVariantChange(idx, 'weight', e.target.value)} required />
                          <input type="number" placeholder="ราคา" className={`${inputStyle} w-1/2`} value={v.price || ''} onChange={(e) => handleVariantChange(idx, 'price', Number(e.target.value))} required />
                          {productForm.variants!.length > 1 && (
                             <button type="button" onClick={() => removeVariant(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={16} /></button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={addVariant} className="text-brand-orange text-sm font-bold flex items-center mt-2 hover:underline">
                        <Plus size={16} className="mr-1" /> เพิ่มไซส์สินค้า
                      </button>
                    </div>

                    {/* ป้ายกำกับ */}
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                        <input type="checkbox" id="isBestSeller" className="w-4 h-4 text-brand-orange rounded" checked={productForm.isBestSeller || false} onChange={(e) => setProductForm({...productForm, isBestSeller: e.target.checked})} />
                        <label htmlFor="isBestSeller" className="ml-2 text-sm font-semibold text-gray-700 flex items-center cursor-pointer"><Star size={14} className="text-brand-yellow mr-1" /> ขายดี</label>
                      </div>
                      <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                        <input type="checkbox" id="isNew" className="w-4 h-4 text-brand-orange rounded" checked={productForm.isNew || false} onChange={(e) => setProductForm({...productForm, isNew: e.target.checked})} />
                        <label htmlFor="isNew" className="ml-2 text-sm font-semibold text-gray-700 cursor-pointer text-red-500">NEW ใหม่</label>
                      </div>
                    </div>

                    <button disabled={loading} type="submit" className={`w-full text-white font-bold py-3 rounded-xl transition flex justify-center items-center mt-4 ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-brand-orange hover:bg-orange-600'}`}>
                      {loading ? <Loader2 className="animate-spin mr-2" /> : editingId ? <CheckCircle2 className="mr-2" size={20} /> : <Plus className="mr-2" size={20} />} 
                      {editingId ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}
                    </button>
                  </form>
                </div>
              </div>

              {/* === RIGHT: LIST === */}
              <div className="lg:col-span-8">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="ค้นหาชื่อสินค้า..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-orange outline-none text-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="max-h-[700px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10 text-sm">
                        <tr>
                          <th className="p-4 font-semibold border-b">สินค้า</th>
                          <th className="p-4 font-semibold border-b">ขนาด / ราคา</th>
                          <th className="p-4 font-semibold border-b text-right">จัดการ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((p) => {
                           const vList = p.variants?.length ? p.variants : (p.weight ? [{weight: p.weight, price: p.price}] : []);
                           return (
                            <tr key={p.id} className={`hover:bg-orange-50/50 transition ${editingId === p.id ? 'bg-blue-50' : ''}`}>
                              <td className="p-4 flex items-center gap-3">
                                <img src={p.image || 'https://via.placeholder.com/100'} className="w-16 h-16 rounded-lg object-cover border" />
                                <div>
                                  <p className="font-bold text-gray-800">{p.name.th}</p>
                                  <div className="flex gap-1 mt-1">
                                    {p.isBestSeller && <span className="text-[10px] bg-brand-yellow px-1.5 py-0.5 rounded text-brand-dark font-bold">Best Seller</span>}
                                    {p.isNew && <span className="text-[10px] bg-red-500 px-1.5 py-0.5 rounded text-white font-bold">New</span>}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 align-top">
                                <div className="space-y-1">
                                  {vList.map((v, i) => (
                                    <div key={i} className="text-xs flex gap-2">
                                      <span className="bg-gray-100 px-2 py-0.5 rounded">{v.weight || '?'}</span>
                                      <span className="text-brand-orange font-bold">฿{v.price || 0}</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className="p-4 text-right align-top">
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

          {/* === HERO TAB === */}
          {activeTab === 'hero' && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><PlayCircle className="text-brand-orange" /> เพิ่มวิดีโอ</h3>
                <div className="flex gap-4">
                  <input type="text" placeholder="URL วิดีโอ" className={inputStyle} value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} />
                  <button onClick={handleAddVideo} className="bg-brand-orange text-white px-6 rounded-xl font-bold hover:bg-orange-600">เพิ่ม</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {slides.map((slide, i) => (
                  <div key={slide.id} className="relative group bg-gray-900 rounded-xl overflow-hidden aspect-video">
                    <video src={slide.url} className="w-full h-full object-cover opacity-80" />
                    <button onClick={() => handleDeleteVideo(slide.id)} className="absolute inset-0 m-auto w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
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