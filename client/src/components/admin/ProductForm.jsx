import { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, Star, Calculator, Loader2 } from "lucide-react";
import { useCategory } from "../../hooks/useCategory";

// IMPORT URL DARI AXIOS CONFIG
import { APP_BASE_URL } from "../../api/axios";

export default function ProductForm({ initialData, onSubmit, isLoading }) {
  const { categories, getCategories } = useCategory();
  
  // State Data
  const [formData, setFormData] = useState({
    name: "", price: "", stock: 0, CategoryId: "", description: "", featured: false
  });
  const [mainImage, setMainImage] = useState({ file: null, preview: null });
  
  // State Galeri
  const [existingGallery, setExistingGallery] = useState([]); 
  const [newGalleryFiles, setNewGalleryFiles] = useState([]); 
  
  const [variants, setVariants] = useState([]);

  useEffect(() => { getCategories(); }, [getCategories]);

  // Load Data
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        price: initialData.price || "",
        stock: initialData.stock || 0,
        CategoryId: initialData.CategoryId || "",
        description: initialData.description || "",
        featured: initialData.featured || false
      });

      if (initialData.imageUrl) {
        // GUNAKAN APP_BASE_URL
        setMainImage({ file: null, preview: `${APP_BASE_URL}${initialData.imageUrl}` });
      }

      if (initialData.gallery && Array.isArray(initialData.gallery)) {
        setExistingGallery(initialData.gallery);
      }

      if (initialData.variants && initialData.variants.length > 0) {
        setVariants(initialData.variants.map(v => ({
          category: v.category,
          value: v.value,
          stock: v.stock,
          imageUrl: v.imageUrl,
          imageFile: null,
          // GUNAKAN APP_BASE_URL
          preview: v.imageUrl ? `${APP_BASE_URL}${v.imageUrl}` : null
        })));
      } else {
        setVariants([{ category: "", value: "", stock: 0, imageFile: null, preview: null }]);
      }
    } else {
      setVariants([{ category: "", value: "", stock: 0, imageFile: null, preview: null }]);
    }
  }, [initialData]);

  useEffect(() => {
    const total = variants.reduce((acc, curr) => acc + (parseInt(curr.stock) || 0), 0);
    setFormData(prev => ({ ...prev, stock: total }));
  }, [variants]);

  // --- HANDLERS ---
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setNewGalleryFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeGalleryImage = (type, index) => {
    if (type === 'existing') {
      setExistingGallery(prev => prev.filter((_, i) => i !== index));
    } else {
      setNewGalleryFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("CategoryId", formData.CategoryId);
    data.append("description", formData.description);
    data.append("featured", formData.featured);

    if (mainImage.file) data.append("image", mainImage.file);

    newGalleryFiles.forEach(item => {
      data.append("gallery", item.file);
    });
    data.append("existingGallery", JSON.stringify(existingGallery));

    const variantsMeta = variants.map(v => {
      if (v.imageFile) data.append("variantImages", v.imageFile);
      return {
        category: v.category,
        value: v.value,
        stock: v.stock,
        imageUrl: v.imageUrl,
        hasImage: !!v.imageFile
      };
    });
    data.append("variants", JSON.stringify(variantsMeta));

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* MEDIA SECTION */}
        <div className="space-y-8">
          <div className="aspect-square bg-zinc-50 border-2 border-dashed border-zinc-100 relative flex items-center justify-center overflow-hidden group">
            {mainImage.preview ? (
              <img src={mainImage.preview} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center pointer-events-none">
                <ImageIcon size={40} className="mx-auto text-zinc-200 mb-2" />
                <span className="text-[9px] font-black uppercase text-zinc-400">Main Asset</span>
              </div>
            )}
            <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/5 opacity-0 hover:opacity-100 transition">
              <input type="file" className="hidden" accept="image/*" onChange={e => setMainImage({ file: e.target.files[0], preview: URL.createObjectURL(e.target.files[0]) })} />
            </label>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase text-zinc-300 mb-2">Gallery Assets</p>
            <div className="grid grid-cols-4 gap-4">
              
              {/* RENDER GAMBAR LAMA */}
              {existingGallery.map((url, i) => (
                <div key={`exist-${i}`} className="aspect-square bg-zinc-50 border border-zinc-100 relative group">
                  {/* GUNAKAN APP_BASE_URL */}
                  <img src={`${APP_BASE_URL}${url}`} className="w-full h-full object-cover grayscale" />
                  
                  <button 
                    type="button" 
                    onClick={() => removeGalleryImage('existing', i)} 
                    className="absolute top-1 right-1 z-10 bg-red-600 text-white p-1.5 shadow-sm hover:bg-red-700 transition-colors"
                    title="Remove Image"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              
              {/* RENDER UPLOAD BARU */}
              {newGalleryFiles.map((item, i) => (
                <div key={`new-${i}`} className="aspect-square bg-zinc-50 border border-zinc-100 relative group">
                  <img src={item.preview} className="w-full h-full object-cover" />
                  
                  <button 
                    type="button" 
                    onClick={() => removeGalleryImage('new', i)} 
                    className="absolute top-1 right-1 z-10 bg-black text-white p-1.5 shadow-sm hover:bg-zinc-800 transition-colors"
                    title="Remove Image"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}

              <label className="aspect-square border-2 border-dashed border-zinc-100 flex items-center justify-center cursor-pointer hover:border-black hover:bg-zinc-50 transition">
                <Plus size={20} className="text-zinc-300" />
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryChange} />
              </label>
            </div>
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="space-y-8">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
            <input type="text" placeholder="PRODUCT NAME" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="text-4xl font-black italic uppercase w-full outline-none bg-transparent" required />
            <button type="button" onClick={() => setFormData(p => ({ ...p, featured: !p.featured }))} className={`p-2 transition ${formData.featured ? 'text-black' : 'text-zinc-200'}`}>
              <Star fill={formData.featured ? "currentColor" : "none"} size={28} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="PRICE" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} className="bg-zinc-50 p-4 text-xs font-black outline-none" required />
            <div className="relative">
               <input type="number" value={formData.stock} readOnly className="w-full bg-zinc-100 p-4 text-xs font-black outline-none text-zinc-400 cursor-not-allowed" />
               <Calculator className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300" size={14} />
            </div>
          </div>

          <select value={formData.CategoryId} onChange={e => setFormData(p => ({ ...p, CategoryId: e.target.value }))} className="w-full bg-zinc-50 p-4 text-xs font-bold outline-none uppercase" required>
            <option value="">-- SELECT TIER --</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>

          <textarea placeholder="DESCRIPTION" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="w-full bg-zinc-50 p-4 text-xs font-bold outline-none h-40 resize-none" required />
        </div>
      </div>
      
      {/* VARIANT SECTION */}
      <div className="pt-10 border-t border-zinc-100">
        <h3 className="font-black italic uppercase mb-6 tracking-tighter text-xl">Technical Variants</h3>
        <div className="space-y-4">
          {variants.map((v, i) => (
            <div key={i} className="flex flex-col md:flex-row bg-zinc-50 border border-zinc-100 p-4 gap-4 items-center group">
              <div className="w-16 h-16 bg-white border border-zinc-200 shrink-0 relative flex items-center justify-center overflow-hidden">
                {/* GUNAKAN APP_BASE_URL (Hanya jika v.imageUrl dan v.preview null) */}
                {/* Note: v.preview sudah dihandle di useEffect untuk memasukkan URL lengkap */}
                {v.preview ? <img src={v.preview} className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-zinc-200"/>}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                  <span className="text-[8px] font-black text-white uppercase text-center">Change</span>
                  <input type="file" className="hidden" accept="image/*" onChange={e => {
                     const file = e.target.files[0];
                     const newVars = [...variants];
                     newVars[i].imageFile = file;
                     newVars[i].preview = URL.createObjectURL(file);
                     setVariants(newVars);
                  }} />
                </label>
              </div>
              <input type="text" placeholder="SPEC" value={v.category} onChange={e => { const n = [...variants]; n[i].category = e.target.value; setVariants(n); }} className="bg-transparent text-[10px] font-black uppercase w-full outline-none border-b border-zinc-200 focus:border-black" />
              <input type="text" placeholder="VALUE" value={v.value} onChange={e => { const n = [...variants]; n[i].value = e.target.value; setVariants(n); }} className="bg-transparent text-[10px] font-black uppercase w-full outline-none border-b border-zinc-200 focus:border-black" />
              <input type="number" value={v.stock} onChange={e => { const n = [...variants]; n[i].stock = e.target.value; setVariants(n); }} className="bg-transparent text-[10px] font-black w-20 outline-none border-b border-zinc-200 focus:border-black" />
              <button type="button" onClick={() => setVariants(variants.filter((_, idx) => idx !== i))} className="text-zinc-300 hover:text-red-500"><Trash2 size={16}/></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setVariants([...variants, { category: "", value: "", stock: 0, imageFile: null, preview: null }])} className="mt-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition flex items-center gap-2"><Plus size={14}/> Add Config</button>
      </div>

      <button type="submit" disabled={isLoading} className="w-full bg-black text-white py-6 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-zinc-800 transition shadow-xl flex items-center justify-center space-x-3">
        {isLoading && <Loader2 className="animate-spin" size={14} />}
        <span>{isLoading ? "SYNCING..." : "SAVE CHANGES"}</span>
      </button>
    </form>
  );
}