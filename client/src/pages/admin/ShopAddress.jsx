// client/src/pages/admin/ShopAddress.jsx
import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Loader2, Save, MapPin, Building2, Phone, Map } from 'lucide-react';
import Notification from '../../components/commons/Notification';

export default function ShopAddress() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [notif, setNotif] = useState({ show: false, message: '', type: 'success' });

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);

  const [formData, setFormData] = useState({
    shopName: '', phoneNumber: '', provinceId: '', province: '',
    cityId: '', city: '', districtId: '', district: '', 
    subDistrictId: '', subDistrict: '', postalCode: '', fullAddress: ''
  });

  // Fetchers tetap sama dengan logika Anda...
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

  useEffect(() => {
    const initData = async () => {
      await fetchProvinces();
      try {
        const { data } = await api.get('/shop-address');
        if (data) {
          setFormData({
            shopName: data.shopName || '', phoneNumber: data.phoneNumber || '',
            provinceId: data.provinceId || '', province: data.province || '',
            cityId: data.cityId || '', city: data.city || '',
            districtId: data.districtId || '', district: data.district || '',
            subDistrictId: data.subDistrictId || '', subDistrict: data.subDistrict || '',
            postalCode: data.postalCode || '', fullAddress: data.fullAddress || ''
          });
          if(data.provinceId) await fetchCities(data.provinceId);
          if(data.cityId) await fetchDistricts(data.cityId);
          if(data.districtId) await fetchSubDistricts(data.districtId);
        }
      } catch (err) { console.error(err); } finally { setInitialLoading(false); }
    };
    initData();
  }, []);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleProvinceChange = (e) => {
    const id = e.target.value;
    const name = id ? e.target.options[e.target.selectedIndex].text : '';
    setFormData(prev => ({ ...prev, provinceId: id, province: name, cityId: '', city: '', districtId: '', district: '', subDistrictId: '', subDistrict: '', postalCode: '' }));
    setCities([]); setDistricts([]); setSubDistricts([]);
    fetchCities(id);
  };

  const handleCityChange = (e) => {
    const id = e.target.value;
    const name = id ? e.target.options[e.target.selectedIndex].text : '';
    setFormData(prev => ({ ...prev, cityId: id, city: name, districtId: '', district: '', subDistrictId: '', subDistrict: '', postalCode: '' }));
    setDistricts([]); setSubDistricts([]);
    fetchDistricts(id);
  };

  const handleDistrictChange = (e) => {
    const id = e.target.value;
    const name = id ? e.target.options[e.target.selectedIndex].text : '';
    setFormData(prev => ({ ...prev, districtId: id, district: name, subDistrictId: '', subDistrict: '', postalCode: '' }));
    setSubDistricts([]);
    fetchSubDistricts(id);
  };

  const handleSubDistrictChange = (e) => {
    const id = e.target.value;
    const name = id ? e.target.options[e.target.selectedIndex].text : '';
    const selectedSub = subDistricts.find(s => String(s.id || s.sub_district_id) === String(id));
    const zipCode = selectedSub ? (selectedSub.zip_code || selectedSub.postal_code || '') : '';
    setFormData(prev => ({ ...prev, subDistrictId: id, subDistrict: name, postalCode: zipCode }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/shop-address', formData);
      setNotif({ show: true, message: 'Shop address updated successfully!', type: 'success' });
    } catch (err) {
      setNotif({ show: true, message: 'Failed to update address', type: 'error' });
    } finally { setLoading(false); }
  };

  if (initialLoading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-zinc-300"/></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
      {/* Header Responsif */}
      <div className="mb-8 pb-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="bg-black text-white p-3 shadow-lg w-fit">
          <Building2 size={24} />
        </div>
        <div className="text-left">
          <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter leading-none">Shop HQ Location</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Origin Point for Logistics</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-5 sm:p-8 border border-zinc-100 shadow-sm text-left">
        
        {/* Info Toko - Grid 1 col di mobile, 2 col di desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div>
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">
              <Building2 size={12}/> Shop Name
            </label>
            <input type="text" required value={formData.shopName} onChange={e => handleChange('shopName', e.target.value)} className="w-full bg-zinc-50 border border-zinc-200 p-4 text-xs font-bold outline-none focus:border-black uppercase transition-all" placeholder="e.g. OFFICIAL STORE" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">
              <Phone size={12}/> Phone Number
            </label>
            <input type="text" required value={formData.phoneNumber} onChange={e => handleChange('phoneNumber', e.target.value.replace(/\D/,''))} className="w-full bg-zinc-50 border border-zinc-200 p-4 text-xs font-bold outline-none focus:border-black transition-all" placeholder="08..." />
          </div>
        </div>

        {/* Wilayah Dropdowns - Grid 1 col di mobile, 2 col di desktop */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-50 pb-2">
             <MapPin size={14} className="text-zinc-400"/>
             <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">Regional Manifest</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            <div className="space-y-2">
                <p className="text-[9px] font-bold text-zinc-400 uppercase">Province</p>
                <select required value={formData.provinceId} onChange={handleProvinceChange} className="w-full bg-zinc-50 border border-zinc-200 p-3.5 text-xs font-bold uppercase outline-none focus:border-black appearance-none">
                  <option value="">-- Select Province --</option>
                  {provinces.map(p => <option key={p.id || p.province_id} value={p.id || p.province_id}>{p.name || p.province}</option>)}
                </select>
            </div>

            <div className="space-y-2">
                <p className="text-[9px] font-bold text-zinc-400 uppercase">City / Regency</p>
                <select required value={formData.cityId} onChange={handleCityChange} disabled={!formData.provinceId} className="w-full bg-zinc-50 border border-zinc-200 p-3.5 text-xs font-bold uppercase outline-none focus:border-black disabled:opacity-30">
                  <option value="">-- Select City --</option>
                  {cities.map(c => <option key={c.id || c.city_id} value={c.id || c.city_id}>{c.type} {c.name || c.city_name}</option>)}
                </select>
            </div>

            <div className="space-y-2">
                <p className="text-[9px] font-bold text-zinc-400 uppercase">District</p>
                <select required value={formData.districtId} onChange={handleDistrictChange} disabled={!formData.cityId} className="w-full bg-zinc-50 border border-zinc-200 p-3.5 text-xs font-bold uppercase outline-none focus:border-black disabled:opacity-30">
                  <option value="">-- Select District --</option>
                  {districts.map(d => <option key={d.id || d.district_id} value={d.id || d.district_id}>{d.name || d.subdistrict_name}</option>)}
                </select>
            </div>

            <div className="space-y-2">
                <p className="text-[9px] font-bold text-zinc-400 uppercase">Subdistrict</p>
                <select required value={formData.subDistrictId} onChange={handleSubDistrictChange} disabled={!formData.districtId} className="w-full bg-zinc-50 border border-zinc-200 p-3.5 text-xs font-bold uppercase outline-none focus:border-black disabled:opacity-30">
                  <option value="">-- Select Subdistrict --</option>
                  {subDistricts.map(s => <option key={s.id || s.sub_district_id} value={s.id || s.sub_district_id}>{s.name || s.subdistrict_name}</option>)}
                </select>
            </div>
          </div>
        </div>

        {/* Alamat Detail */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 block">ZIP Code</label>
            <input type="text" required value={formData.postalCode} onChange={e => handleChange('postalCode', e.target.value)} className="w-full bg-zinc-100 border border-zinc-200 p-4 text-xs font-black outline-none focus:border-black" />
          </div>
          <div className="md:col-span-3">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">
               <Map size={12}/> Full Transmission Address
            </label>
            <textarea required value={formData.fullAddress} onChange={e => handleChange('fullAddress', e.target.value)} placeholder="STREET, BUILDING, UNIT..." className="w-full bg-zinc-50 border border-zinc-200 p-4 text-xs font-bold outline-none focus:border-black h-28 resize-none leading-relaxed uppercase" />
          </div>
        </div>

        <div className="flex pt-6 border-t border-zinc-100">
          <button type="submit" disabled={loading} className="w-full sm:w-auto bg-black text-white px-10 py-5 flex items-center justify-center gap-3 hover:bg-zinc-800 transition active:scale-95 disabled:opacity-50 group">
            {loading ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} className="group-hover:translate-y-[-2px] transition-transform"/>}
            <span className="text-xs font-black uppercase tracking-[0.2em]">Save</span>
          </button>
        </div>

      </form>
      <Notification show={notif.show} {...notif} onClose={() => setNotif({...notif, show: false})} />
    </div>
  );
}