import { useEffect, useState } from 'react';
import { useAddress } from '../../hooks/useAddress';
import AddressForm from '../../components/customer/AddressForm';
import { MapPin, Plus, Edit, Trash2, CheckCircle, Loader2 } from 'lucide-react';

export default function AddressBook() {
  const { addresses, getAddresses, deleteAddress, setMainAddress, loading } = useAddress();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);

  useEffect(() => { getAddresses(); }, [getAddresses]);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-10 border-b border-zinc-100 pb-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Address Book</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Manage Shipping Destinations</p>
        </div>
        <button 
          onClick={() => { setEditingData(null); setIsFormOpen(true); }}
          className="bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 hover:bg-zinc-800 transition"
        >
          <Plus size={14}/> <span>Add New</span>
        </button>
      </div>

      {loading && addresses.length === 0 ? (
        <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-zinc-300"/></div>
      ) : addresses.length > 0 ? (
        <div className="grid gap-6">
          {addresses.map(addr => (
            <div key={addr.id} className={`p-6 border transition-all ${addr.isMain ? 'border-black bg-zinc-50' : 'border-zinc-200 bg-white hover:border-zinc-300'}`}>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-black uppercase">{addr.receiverName}</span>
                    {addr.isMain && <span className="bg-black text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-wide">Main HQ</span>}
                  </div>
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide">{addr.phoneNumber}</p>
                  
                  {/* --- DISPLAY ALAMAT --- */}
                  <div className="text-sm text-zinc-600 font-medium leading-relaxed max-w-xl mt-2">
                    <p>{addr.fullAddress}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {addr.subDistrict ? `${addr.subDistrict}, ` : ''} 
                      {addr.district ? `${addr.district}, ` : ''} 
                      {addr.city}, {addr.province} 
                      <span className="font-bold ml-1">{addr.postalCode}</span>
                    </p>
                  </div>
                  {/* ---------------------- */}
                </div>

                <div className="flex flex-col space-y-2 items-end">
                   {!addr.isMain && (
                     <button onClick={() => setMainAddress(addr.id)} className="text-[9px] font-bold uppercase text-zinc-400 hover:text-black flex items-center space-x-1 mb-2">
                       <CheckCircle size={12}/> <span>Set as Main</span>
                     </button>
                   )}
                   <div className="flex space-x-2">
                     <button onClick={() => { setEditingData(addr); setIsFormOpen(true); }} className="p-2 border border-zinc-200 hover:border-black hover:bg-black hover:text-white transition" title="Edit Address">
                       <Edit size={14}/>
                     </button>
                     <button onClick={() => handleDelete(addr.id)} className="p-2 border border-zinc-200 hover:border-red-500 hover:bg-red-500 hover:text-white transition" title="Delete Address">
                       <Trash2 size={14}/>
                     </button>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-zinc-100">
           <MapPin size={48} className="mx-auto text-zinc-200 mb-4"/>
           <p className="text-zinc-400 uppercase text-xs font-bold tracking-widest">No addresses found</p>
        </div>
      )}

      {isFormOpen && (
        <AddressForm 
          initialData={editingData} 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => { setIsFormOpen(false); getAddresses(); }}
        />
      )}
    </div>
  );
}