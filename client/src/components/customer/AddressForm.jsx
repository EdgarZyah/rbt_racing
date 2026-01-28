import { useState, useEffect } from 'react';
import { useAddress } from '../../hooks/useAddress';
import { Loader2, Save, X } from 'lucide-react';

export default function AddressForm({ initialData, onClose, onSuccess }) {
  const { 
    addAddress, updateAddress, 
    provinces, cities, districts, subDistricts,
    getProvinces, getCities, getDistricts, getSubDistricts,
    loading 
  } = useAddress();

  const [formData, setFormData] = useState({
    receiverName: '', phoneNumber: '',
    provinceId: '', province: '',
    cityId: '', city: '',
    districtId: '', district: '', 
    subDistrictId: '', subDistrict: '', 
    postalCode: '', fullAddress: '', isMain: false
  });

  // Load Provinsi saat mount (Dengan Abort Controller untuk cegah Double Hit)
  useEffect(() => {
    const controller = new AbortController();
    getProvinces(controller.signal);
    return () => controller.abort(); // Cleanup saat unmount/remount
  }, [getProvinces]);

  // Pre-fill data jika mode Edit
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      const controller = new AbortController();
      if(initialData.provinceId) getCities(initialData.provinceId, controller.signal);
      if(initialData.cityId) getDistricts(initialData.cityId, controller.signal);
      if(initialData.districtId) getSubDistricts(initialData.districtId, controller.signal);
      return () => controller.abort();
    }
  }, [initialData]);

  // --- HANDLERS DENGAN RESET LOGIC ---

  const handleProvinceChange = (e) => {
    const id = e.target.value;
    const name = id ? e.target.options[e.target.selectedIndex].text : '';
    
    setFormData(p => ({ 
      ...p, provinceId: id, province: name, 
      cityId: '', city: '', districtId: '', district: '', subDistrictId: '', subDistrict: '',
      postalCode: '' 
    }));
    getCities(id);
  };

  const handleCityChange = (e) => {
    const id = e.target.value;
    const name = id ? e.target.options[e.target.selectedIndex].text : '';
    setFormData(p => ({ 
      ...p, cityId: id, city: name, 
      districtId: '', district: '', subDistrictId: '', subDistrict: '',
      postalCode: '' 
    }));
    getDistricts(id);
  };

  const handleDistrictChange = (e) => {
    const id = e.target.value;
    const name = id ? e.target.options[e.target.selectedIndex].text : '';
    setFormData(p => ({ 
      ...p, districtId: id, district: name, 
      subDistrictId: '', subDistrict: '',
      postalCode: '' 
    }));
    getSubDistricts(id);
  };

  // --- FITUR AUTO ZIP CODE ---
  const handleSubDistrictChange = (e) => {
    const id = e.target.value;
    const name = id ? e.target.options[e.target.selectedIndex].text : '';

    // Cari object subDistrict yang dipilih untuk ambil kode pos
    // Kita gunakan String() untuk perbandingan aman antara ID string/number
    const selectedSub = subDistricts.find(s => String(s.id || s.sub_district_id) === String(id));
    
    // API Komerce biasanya menyimpan kode pos di properti 'zip_code'
    const zipCode = selectedSub ? (selectedSub.zip_code || selectedSub.postal_code || '') : '';

    setFormData(p => ({ 
      ...p, 
      subDistrictId: id, 
      subDistrict: name,
      postalCode: zipCode // Otomatis isi kode pos
    }));
  };
  // ---------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    
    let res;
    if (initialData?.id) {
      res = await updateAddress(initialData.id, payload);
    } else {
      res = await addAddress(payload);
    }

    if (res.success) onSuccess();
    else alert(res.message);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-black"><X/></button>
        
        <h2 className="text-2xl font-black italic uppercase mb-8">
          {initialData ? 'Update Location' : 'New Deployment Point'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              type="text" placeholder="RECEIVER NAME" required
              value={formData.receiverName}
              onChange={e => setFormData({...formData, receiverName: e.target.value})}
              className="bg-zinc-50 border border-zinc-200 p-4 text-[10px] font-bold tracking-widest outline-none focus:border-black"
            />
            <input 
              type="text" placeholder="PHONE NUMBER (e.g. 081...)" required
              value={formData.phoneNumber}
              onChange={e => setFormData({...formData, phoneNumber: e.target.value.replace(/\D/,'')})}
              className="bg-zinc-50 border border-zinc-200 p-4 text-[10px] font-bold tracking-widest outline-none focus:border-black"
            />
          </div>

          {/* --- DROPDOWNS --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PROVINCE */}
            <select required value={formData.provinceId} onChange={handleProvinceChange} 
              className="bg-zinc-50 border border-zinc-200 p-4 text-[10px] font-bold uppercase outline-none focus:border-black cursor-pointer">
              <option value="">-- SELECT PROVINCE --</option>
              {provinces.map(p => (
                <option key={p.id || p.province_id} value={p.id || p.province_id}>
                  {p.name || p.province}
                </option>
              ))}
            </select>

            {/* CITY */}
            <select required value={formData.cityId} onChange={handleCityChange} disabled={!formData.provinceId}
              className="bg-zinc-50 border border-zinc-200 p-4 text-[10px] font-bold uppercase outline-none focus:border-black disabled:opacity-50 cursor-pointer">
              <option value="">-- SELECT CITY --</option>
              {cities.map(c => (
                <option key={c.id || c.city_id} value={c.id || c.city_id}>
                  {c.type || ''} {c.name || c.city_name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DISTRICT */}
            <select required value={formData.districtId} onChange={handleDistrictChange} disabled={!formData.cityId}
              className="bg-zinc-50 border border-zinc-200 p-4 text-[10px] font-bold uppercase outline-none focus:border-black disabled:opacity-50 cursor-pointer">
              <option value="">-- DISTRICT --</option>
              {districts.map(d => (
                <option key={d.id || d.district_id} value={d.id || d.district_id}>
                  {d.name || d.subdistrict_name}
                </option>
              ))}
            </select>

            {/* SUBDISTRICT */}
            <select required value={formData.subDistrictId} onChange={handleSubDistrictChange} disabled={!formData.districtId}
              className="bg-zinc-50 border border-zinc-200 p-4 text-[10px] font-bold uppercase outline-none focus:border-black disabled:opacity-50 cursor-pointer">
              <option value="">-- SUBDISTRICT --</option>
              {subDistricts.map(s => (
                <option key={s.id || s.sub_district_id} value={s.id || s.sub_district_id}>
                  {s.name || s.subdistrict_name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* POSTAL CODE (AUTO-FILLED) */}
            <input 
              type="text" placeholder="POSTAL CODE" required
              value={formData.postalCode}
              onChange={e => setFormData({...formData, postalCode: e.target.value})}
              className="col-span-1 bg-zinc-50 border border-zinc-200 p-4 text-[10px] font-bold tracking-widest outline-none focus:border-black"
            />
             <div className="col-span-2 flex items-center">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isMain}
                    onChange={e => setFormData({...formData, isMain: e.target.checked})}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-[10px] font-bold uppercase text-zinc-500">Set as Main HQ</span>
                </label>
             </div>
          </div>

          <textarea 
            placeholder="FULL ADDRESS (Street, Number, RT/RW, Landmarks)" 
            required
            value={formData.fullAddress}
            onChange={e => setFormData({...formData, fullAddress: e.target.value})}
            className="w-full bg-zinc-50 border border-zinc-200 p-4 text-[10px] font-bold outline-none h-24 resize-none focus:border-black"
          />

          <button type="submit" disabled={loading} className="w-full bg-black text-white py-4 flex items-center justify-center space-x-2 hover:bg-zinc-800 transition">
            {loading ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
            <span className="text-xs font-black uppercase tracking-widest">Save Coordinates</span>
          </button>
        </form>
      </div>
    </div>
  );
}