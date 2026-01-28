import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Loader2, Save, MapPin, Building2, Phone, Map } from 'lucide-react';
import Notification from '../../components/commons/Notification';

export default function ShopAddress() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [notif, setNotif] = useState({ show: false, message: '', type: 'success' });

  // Data Wilayah
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);

  const [formData, setFormData] = useState({
    shopName: '', phoneNumber: '',
    provinceId: '', province: '',
    cityId: '', city: '',
    districtId: '', district: '', 
    subDistrictId: '', subDistrict: '', 
    postalCode: '', fullAddress: ''
  });

  // --- FETCHERS ---
  const fetchProvinces = async () => {
    try { const { data } = await api.get('/rajaongkir/provinces'); setProvinces(data); } catch(e){}
  };
  const fetchCities = async (id) => {
    if(!id) return;
    try { const { data } = await api.get(`/rajaongkir/cities/${id}`); setCities(data); } catch(e){}
  };
  const fetchDistricts = async (id) => {
    if(!id) return;
    try { const { data } = await api.get(`/rajaongkir/districts/${id}`); setDistricts(data); } catch(e){}
  };
  const fetchSubDistricts = async (id) => {
    if(!id) return;
    try { const { data } = await api.get(`/rajaongkir/subdistricts/${id}`); setSubDistricts(data); } catch(e){}
  };

  // --- LOAD DATA AWAL ---
  useEffect(() => {
    const initData = async () => {
      await fetchProvinces();
      
      try {
        // PERBAIKAN ENDPOINT: Sesuai backend route '/shop-address'
        const { data } = await api.get('/shop-address');
        
        if (data) {
          setFormData({
            shopName: data.shopName || '',
            phoneNumber: data.phoneNumber || '',
            provinceId: data.provinceId || '', province: data.province || '',
            cityId: data.cityId || '', city: data.city || '',
            districtId: data.districtId || '', district: data.district || '',
            subDistrictId: data.subDistrictId || '', subDistrict: data.subDistrict || '',
            postalCode: data.postalCode || '', fullAddress: data.fullAddress || ''
          });

          // Load cascading data untuk dropdown agar terpilih otomatis
          if(data.provinceId) await fetchCities(data.provinceId);
          if(data.cityId) await fetchDistricts(data.cityId);
          if(data.districtId) await fetchSubDistricts(data.districtId);
        }
      } catch (err) {
        console.error("Gagal load alamat toko", err);
      } finally {
        setInitialLoading(false);
      }
    };
    initData();
  }, []);

  // --- HANDLERS ---
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProvinceChange = (e) => {
    const id = e.target.value;
    const name = id ? e.target.options[e.target.selectedIndex].text : '';
    setFormData(prev => ({ 
      ...prev, provinceId: id, province: name, 
      cityId: '', city: '', districtId: '', district: '', subDistrictId: '', subDistrict: '', postalCode: ''
    }));
    setCities([]); setDistricts([]); setSubDistricts([]);
    fetchCities(id);
  };

  const handleCityChange = (e) => {
    const id = e.target.value;
    const name = id ? e.target.options[e.target.selectedIndex].text : '';
    setFormData(prev => ({ 
      ...prev, cityId: id, city: name, 
      districtId: '', district: '', subDistrictId: '', subDistrict: '', postalCode: ''
    }));
    setDistricts([]); setSubDistricts([]);
    fetchDistricts(id);
  };

  const handleDistrictChange = (e) => {
    const id = e.target.value;
    const name = id ? e.target.options[e.target.selectedIndex].text : '';
    setFormData(prev => ({ 
      ...prev, districtId: id, district: name, 
      subDistrictId: '', subDistrict: '', postalCode: ''
    }));
    setSubDistricts([]);
    fetchSubDistricts(id);
  };

  const handleSubDistrictChange = (e) => {
    const id = e.target.value;
    const name = id ? e.target.options[e.target.selectedIndex].text : '';
    
    // Auto Postal Code (Cari dari array subDistricts)
    const selectedSub = subDistricts.find(s => String(s.id || s.sub_district_id) === String(id));
    const zipCode = selectedSub ? (selectedSub.zip_code || selectedSub.postal_code || '') : '';

    setFormData(prev => ({ ...prev, subDistrictId: id, subDistrict: name, postalCode: zipCode }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // PERBAIKAN ENDPOINT: '/shop-address'
      await api.put('/shop-address', formData);
      setNotif({ show: true, message: 'Shop address updated successfully!', type: 'success' });
    } catch (err) {
      setNotif({ show: true, message: 'Failed to update address', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-zinc-300"/></div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 animate-in fade-in duration-500">
      <div className="mb-10 pb-6 border-b border-zinc-100 flex flex-col md:flex-row md:items-center gap-4">
        <div className="bg-black text-white p-3 shadow-lg">
          <Building2 size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Shop HQ Location</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Origin Point for Shipping Calculations</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 border border-zinc-100 shadow-sm">
        
        {/* Info Toko */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">
              <Building2 size={12}/> Shop Name
            </label>
            <input 
              type="text" required value={formData.shopName}
              onChange={e => handleChange('shopName', e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 p-4 text-xs font-bold outline-none focus:border-black uppercase transition-colors"
              placeholder="e.g. OFFICIAL STORE"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">
              <Phone size={12}/> Phone Number
            </label>
            <input 
              type="text" required value={formData.phoneNumber}
              onChange={e => handleChange('phoneNumber', e.target.value.replace(/\D/,''))}
              className="w-full bg-zinc-50 border border-zinc-200 p-4 text-xs font-bold outline-none focus:border-black transition-colors"
              placeholder="08..."
            />
          </div>
        </div>

        {/* Wilayah Dropdowns */}
        <div>
          <div className="flex items-center gap-2 mb-6 border-b border-zinc-50 pb-2">
             <MapPin size={14} className="text-zinc-400"/>
             <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">Location Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select required value={formData.provinceId} onChange={handleProvinceChange} 
              className="w-full bg-zinc-50 border border-zinc-200 p-3 text-xs font-bold uppercase outline-none focus:border-black cursor-pointer">
              <option value="">-- Select Province --</option>
              {provinces.map(p => (
                <option key={p.id || p.province_id} value={p.id || p.province_id}>{p.name || p.province}</option>
              ))}
            </select>

            <select required value={formData.cityId} onChange={handleCityChange} disabled={!formData.provinceId}
              className="w-full bg-zinc-50 border border-zinc-200 p-3 text-xs font-bold uppercase outline-none focus:border-black disabled:opacity-50 cursor-pointer">
              <option value="">-- Select City --</option>
              {cities.map(c => (
                <option key={c.id || c.city_id} value={c.id || c.city_id}>{c.type} {c.name || c.city_name}</option>
              ))}
            </select>

            <select required value={formData.districtId} onChange={handleDistrictChange} disabled={!formData.cityId}
              className="w-full bg-zinc-50 border border-zinc-200 p-3 text-xs font-bold uppercase outline-none focus:border-black disabled:opacity-50 cursor-pointer">
              <option value="">-- Select District --</option>
              {districts.map(d => (
                <option key={d.id || d.district_id} value={d.id || d.district_id}>{d.name || d.subdistrict_name}</option>
              ))}
            </select>

            <select required value={formData.subDistrictId} onChange={handleSubDistrictChange} disabled={!formData.districtId}
              className="w-full bg-zinc-50 border border-zinc-200 p-3 text-xs font-bold uppercase outline-none focus:border-black disabled:opacity-50 cursor-pointer">
              <option value="">-- Select Subdistrict --</option>
              {subDistricts.map(s => (
                <option key={s.id || s.sub_district_id} value={s.id || s.sub_district_id}>{s.name || s.subdistrict_name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Alamat Detail */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block">Postal Code</label>
            <input 
              type="text" required value={formData.postalCode}
              onChange={e => handleChange('postalCode', e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 p-4 text-xs font-bold outline-none focus:border-black"
            />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
               <Map size={12}/> Full Address
            </label>
            <textarea 
              required value={formData.fullAddress}
              onChange={e => handleChange('fullAddress', e.target.value)}
              placeholder="Street name, Building number, etc."
              className="w-full bg-zinc-50 border border-zinc-200 p-4 text-xs font-bold outline-none focus:border-black h-32 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Tombol Simpan */}
        <div className="flex items-center justify-end pt-6 border-t border-zinc-100">
          <button type="submit" disabled={loading} className="bg-black text-white px-8 py-4 flex items-center gap-2 hover:bg-zinc-800 transition shadow-lg disabled:opacity-70 group">
            {loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} className="group-hover:scale-110 transition-transform"/>}
            <span className="text-xs font-black uppercase tracking-widest">Save Configuration</span>
          </button>
        </div>

      </form>
      <Notification show={notif.show} {...notif} onClose={() => setNotif({...notif, show: false})} />
    </div>
  );
}