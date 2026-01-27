import React from 'react';

export default function Table({ headers, data, renderRow, loading }) {
  return (
    <div className="w-full overflow-x-auto border border-zinc-100">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-100 bg-zinc-50">
            {headers.map((header, index) => (
              <th 
                key={index} 
                className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-12 text-center animate-pulse">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Loading Data...</span>
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td colSpan={headers.length} className="px-6 py-12 text-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No Data Available</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}