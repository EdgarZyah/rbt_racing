import React, { useEffect, useState } from 'react';
import Table from '../../components/commons/Table';
import { Shield, User, Loader2 } from 'lucide-react';
import { useUser } from '../../hooks/useUser';
import Notification from '../../components/commons/Notification';

export default function UserManagement() {
  const { users, loading, getUsers, updateRole } = useUser();
  const [notif, setNotif] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleRoleChange = async (id, newRole) => {
    const result = await updateRole(id, newRole);
    if (result.success) {
      setNotif({ show: true, message: `User role updated to ${newRole}`, type: 'success' });
    }
  };

  const headers = ["ID", "Username", "Email", "Role", "Joined Date"];

  const renderRow = (user) => (
    <tr key={user.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition">
      <td className="px-6 py-4 text-[10px] font-bold text-zinc-300">#{user.id}</td>
      <td className="px-6 py-4 font-black text-xs uppercase italic">{user.username}</td>
      <td className="px-6 py-4 text-[11px] font-bold text-zinc-500">{user.email}</td>
      <td className="px-6 py-4">
        <select 
          value={user.role}
          onChange={(e) => handleRoleChange(user.id, e.target.value)}
          className={`text-[9px] font-black uppercase tracking-widest border px-2 py-1 outline-none ${
            user.role === 'ADMIN' ? 'bg-black text-white' : 'bg-white text-black border-zinc-200'
          }`}
        >
          <option value="CUSTOMER">CUSTOMER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </td>
      <td className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase">
        {new Date(user.createdAt).toLocaleDateString('id-ID')}
      </td>
    </tr>
  );

  return (
    <div className="p-10 animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase">Personnel</h1>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mt-2">Manage RBT Racing access levels</p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-zinc-200" /></div>
      ) : (
        <Table headers={headers} data={users} renderRow={renderRow} />
      )}

      <Notification show={notif.show} message={notif.message} type={notif.type} onClose={() => setNotif({...notif, show: false})} />
    </div>
  );
}