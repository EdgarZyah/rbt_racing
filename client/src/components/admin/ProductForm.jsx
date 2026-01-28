// client/src/components/admin/ProductForm.jsx
import { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, Star, Calculator, Loader2 } from "lucide-react";
import { useCategory } from "../../hooks/useCategory";
import { APP_BASE_URL } from "../../api/axios";

export default function ProductForm({ initialData, onSubmit, isLoading }) {
  const { categories, getCategories } = useCategory();
  const [formData, setFormData] = useState({ name: "", price: "", stock: 0, CategoryId: "", description: "", featured: false });
  const [mainImage, setMainImage] = useState({ file: null, preview: null });
  const [existingGallery, setExistingGallery] = useState([]); 
  const [newGalleryFiles, setNewGalleryFiles] = useState([]); 
  const [variants, setVariants] = useState([]);

  useEffect(() => { getCategories(); }, [getCategories]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "", price: initialData.price || "",
        stock: initialData.stock || 0, CategoryId: initialData.CategoryId || "",
        description: initialData.description || "", featured: initialData.featured || false
      });
      if (initialData.imageUrl) setMainImage({ file: null, preview: `${APP_BASE_URL}${initialData.imageUrl}` });
      if (initialData.gallery) setExistingGallery(initialData.gallery);
      if (initialData.variants?.length > 0) {
        setVariants(initialData.variants.map(v => ({
          category: v.category, value: v.value, stock: v.stock,
          imageUrl: v.imageUrl, imageFile: null,
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

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
    setNewGalleryFiles(prev => [...prev, ...newFiles]);
  };

  const removeGalleryImage = (type, index) => {
    if (type === 'existing') setExistingGallery(prev => prev.filter((_, i) => i !== index));
    else setNewGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (mainImage.file) data.append("image", mainImage.file);
    newGalleryFiles.forEach(item => data.append("gallery", item.file));
    data.append("existingGallery", JSON.stringify(existingGallery));
    const variantsMeta = variants.map(v => {
      if (v.imageFile) data.append("variantImages", v.imageFile);
      return { category: v.category, value: v.value, stock: v.stock, imageUrl: v.imageUrl, hasImage: !!v.imageFile };
    });
    data.append("variants", JSON.stringify(variantsMeta));
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 lg:space-y-12 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* MEDIA SECTION */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">
              Primary Thumbnail
            </label>
            
            <div className="aspect-square bg-zinc-50 border-2 border-dashed border-zinc-100 relative flex items-center justify-center overflow-hidden group hover:border-zinc-300 transition-colors">
              {mainImage.preview ? (
                <>
                  <img src={mainImage.preview} className="w-full h-full object-cover" alt="" />
                  {/* Overlay saat sudah ada gambar */}
                  <label className="absolute inset-0 cursor-pointer bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <Plus size={40} className="text-white" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Replace Image</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={e => setMainImage({ file: e.target.files[0], preview: URL.createObjectURL(e.target.files[0]) })} 
                    />
                  </label>
                </>
              ) : (
                /* Tampilan saat kosong */
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-100/50 transition-colors">
                  <div className="text-center">
                    <Plus size={100} className="mx-auto text-zinc-200 mb-2 group-hover:text-zinc-400 transition-colors" />
                    <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
                      Upload Main Asset
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={e => setMainImage({ file: e.target.files[0], preview: URL.createObjectURL(e.target.files[0]) })} 
                  />
                </label>
              )}
            </div>
          </div>

          <div className="overflow-x-auto pb-2 no-scrollbar">
            <p className="text-[10px] font-black uppercase text-zinc-300 mb-3">Gallery Assets</p>
            <div className="flex lg:grid lg:grid-cols-4 gap-3 min-w-max lg:min-w-0">
              {existingGallery.map((url, i) => (
                <div key={`exist-${i}`} className="w-20 h-20 lg:w-auto lg:h-auto lg:aspect-square bg-zinc-50 border border-zinc-100 relative group">
                  <img src={`${APP_BASE_URL}${url}`} className="w-full h-full object-cover grayscale" alt="Gallery" />
                  <button type="button" onClick={() => removeGalleryImage('existing', i)} className="absolute top-1 right-1 bg-red-600 text-white p-1 hover:bg-red-700"><Trash2 size={10} /></button>
                </div>
              ))}
              {newGalleryFiles.map((item, i) => (
                <div key={`new-${i}`} className="w-20 h-20 lg:w-auto lg:h-auto lg:aspect-square bg-zinc-50 border border-zinc-100 relative group">
                  <img src={item.preview} className="w-full h-full object-cover" alt="New Gallery" />
                  <button type="button" onClick={() => removeGalleryImage('new', i)} className="absolute top-1 right-1 bg-black text-white p-1 hover:bg-zinc-800"><Trash2 size={10} /></button>
                </div>
              ))}
              <label className="w-20 h-20 lg:w-auto lg:h-auto lg:aspect-square border-2 border-dashed border-zinc-100 flex items-center justify-center cursor-pointer hover:border-black transition shrink-0">
                <Plus size={20} className="text-zinc-300" />
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryChange} />
              </label>
            </div>
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="space-y-6 lg:space-y-8">
          <div className="flex gap-4 border-b border-zinc-100 pb-2">
            <input type="text" placeholder="PRODUCT NAME" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="text-2xl lg:text-4xl font-black italic uppercase w-full outline-none bg-transparent" required />
            <button type="button" onClick={() => setFormData(p => ({ ...p, featured: !p.featured }))} className={`transition ${formData.featured ? 'text-black' : 'text-zinc-200'}`}>
              <Star fill={formData.featured ? "currentColor" : "none"} size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="number" placeholder="PRICE" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} className="bg-zinc-50 p-4 text-xs font-black outline-none w-full" required />
            <div className="relative">
               <input type="number" value={formData.stock} readOnly className="w-full bg-zinc-100 p-4 text-xs font-black outline-none text-zinc-400" />
               <Calculator className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-300" size={14} />
            </div>
          </div>

          <select value={formData.CategoryId} onChange={e => setFormData(p => ({ ...p, CategoryId: e.target.value }))} className="w-full bg-zinc-50 p-4 text-xs font-bold outline-none uppercase" required>
            <option value="">-- SELECT CATEGORIES --</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>

          <textarea placeholder="DESCRIPTION" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="w-full bg-zinc-50 p-4 text-xs font-bold outline-none h-40 lg:h-60 resize-none" required />
        </div>
      </div>
      
      {/* VARIANT SECTION */}
      <div className="pt-10 border-t border-zinc-100">
        <h3 className="font-black italic uppercase mb-6 tracking-tighter text-xl">Variants</h3>
        <div className="space-y-3">
          {variants.map((v, i) => (
            <div key={i} className="flex flex-col sm:flex-row bg-zinc-50 border border-zinc-100 p-4 gap-4 items-center group relative sm:static">
              <div className="w-full h-75 sm:w-16 sm:h-16 bg-white border border-zinc-200 shrink-0 relative flex items-center justify-center overflow-hidden">
                {v.preview ? <img src={v.preview} className="w-full h-full object-cover" alt="Var" /> : <ImageIcon size={16} className="text-zinc-200"/>}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                  <span className="text-[8px] font-black text-white uppercase">Change</span>
                  <input type="file" className="hidden" onChange={e => {
                     const file = e.target.files[0];
                     const newVars = [...variants];
                     newVars[i].imageFile = file;
                     newVars[i].preview = URL.createObjectURL(file);
                     setVariants(newVars);
                  }} />
                </label>
              </div>
              <div className="grid grid-cols-2 sm:flex flex-1 gap-3 w-full">
                <input type="text" placeholder="SPEC" value={v.category} onChange={e => { const n = [...variants]; n[i].category = e.target.value; setVariants(n); }} className="bg-transparent text-[10px] font-black uppercase w-full outline-none border-b border-zinc-200 focus:border-black py-2" />
                <input type="text" placeholder="VALUE" value={v.value} onChange={e => { const n = [...variants]; n[i].value = e.target.value; setVariants(n); }} className="bg-transparent text-[10px] font-black uppercase w-full outline-none border-b border-zinc-200 focus:border-black py-2" />
                <input type="number" placeholder="STOCK" value={v.stock} onChange={e => { const n = [...variants]; n[i].stock = e.target.value; setVariants(n); }} className="bg-transparent text-[10px] font-black w-full sm:w-20 outline-none border-b border-zinc-200 focus:border-black py-2" />
              </div>
              <button type="button" onClick={() => setVariants(variants.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 sm:static text-zinc-300 hover:text-red-500"><Trash2 size={16}/></button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setVariants([...variants, { category: "", value: "", stock: 0, imageFile: null, preview: null }])} className="mt-6 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black flex items-center gap-2"><Plus size={14}/> Add Config</button>
      </div>

      <button type="submit" disabled={isLoading} className="w-full bg-black text-white py-6 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-zinc-800 transition shadow-xl flex items-center justify-center space-x-3 active:scale-[0.98]">
        {isLoading ? <Loader2 className="animate-spin" size={14} /> : "SAVE CHANGES"}
      </button>
    </form>
  );
}