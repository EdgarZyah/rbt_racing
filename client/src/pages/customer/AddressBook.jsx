// client/src/pages/customer/AddressBook.jsx
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
    <div className="w-full mx-auto py-8 lg:py-10 px-4 sm:px-6 animate-in fade-up duration-500">
      {/* HEADER - Responsive Flex Direction */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10 border-b border-zinc-100 pb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black italic uppercase tracking-tighter leading-none">Address Book</h1>
          <p className="text-[9px] lg:text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Manage Shipping Destinations</p>
        </div>
        <button 
          onClick={() => { setEditingData(null); setIsFormOpen(true); }}
          className="w-full sm:w-auto bg-black text-white px-6 py-4 sm:py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-zinc-800 transition shadow-xl"
        >
          <Plus size={14}/> <span>Add New Address</span>
        </button>
      </div>

      {loading && addresses.length === 0 ? (
        <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-zinc-300"/></div>
      ) : addresses.length > 0 ? (
        <div className="grid gap-4 lg:gap-6">
          {addresses.map(addr => (
            <div key={addr.id} className={`p-5 lg:p-6 border transition-all ${addr.isMain ? 'border-black bg-zinc-50' : 'border-zinc-200 bg-white hover:border-zinc-300'}`}>
              <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                <div className="space-y-2 w-full">
                  <div className="flex items-center flex-wrap gap-3">
                    <span className="text-xs font-black uppercase tracking-tight">{addr.receiverName}</span>
                    {addr.isMain && <span className="bg-black text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-wide italic">Main Address</span>}
                  </div>
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">{addr.phoneNumber}</p>
                  
                  <div className="text-xs lg:text-sm text-zinc-600 font-medium leading-relaxed mt-2">
                    <p className="break-words">{addr.fullAddress}</p>
                    <p className="mt-1 text-[10px] lg:text-xs text-zinc-400 uppercase tracking-tight">
                      {addr.subDistrict ? `${addr.subDistrict}, ` : ''} 
                      {addr.district ? `${addr.district}, ` : ''} 
                      {addr.city}, {addr.province} 
                      <span className="font-bold ml-1 text-black">{addr.postalCode}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-auto justify-between lg:justify-start items-center lg:items-end border-t lg:border-t-0 pt-4 lg:pt-0">
                   {!addr.isMain && (
                     <button onClick={() => setMainAddress(addr.id)} className="text-[9px] font-black uppercase text-zinc-400 hover:text-black flex items-center space-x-1">
                       <CheckCircle size={12}/> <span className="hidden sm:inline">Set as Main</span><span className="sm:hidden">Set Main</span>
                     </button>
                   )}
                   <div className="flex space-x-2 ml-auto lg:ml-0">
                     <button onClick={() => { setEditingData(addr); setIsFormOpen(true); }} className="p-3 border border-zinc-200 hover:border-black hover:bg-black hover:text-white transition shadow-sm bg-white" title="Edit Address">
                       <Edit size={14}/>
                     </button>
                     <button onClick={() => handleDelete(addr.id)} className="p-3 border border-zinc-200 hover:border-red-500 hover:bg-red-500 hover:text-white transition shadow-sm bg-white" title="Delete Address">
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
           <MapPin size={40} className="mx-auto text-zinc-200 mb-4"/>
           <p className="text-zinc-400 uppercase text-[10px] font-bold tracking-[0.2em]">No addresses found</p>
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