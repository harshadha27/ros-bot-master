
import React from 'react';
import { BOMItem } from '../types';

interface BOMTableProps {
  items: BOMItem[];
}

export const BOMTable: React.FC<BOMTableProps> = ({ items }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#30363d] bg-[#161b22] shadow-2xl">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#21262d] text-xs font-bold uppercase text-gray-400">
          <tr>
            <th className="px-6 py-4">Component</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Role & Justification</th>
            <th className="px-6 py-4">Est. Cost</th>
            <th className="px-6 py-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#30363d]">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-[#1f242c] transition-colors group">
              <td className="px-6 py-4 font-bold text-cyan-400 group-hover:text-cyan-300">{item.name}</td>
              <td className="px-6 py-4">
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border
                  ${item.category === 'Electronics' ? 'bg-purple-950/40 text-purple-400 border-purple-500/30' : 
                    item.category === 'Mechanical' ? 'bg-orange-950/40 text-orange-400 border-orange-500/30' :
                    item.category === 'Sensors' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30' : 
                    'bg-cyan-950/40 text-cyan-400 border-cyan-500/30'}`}>
                  {item.category}
                </span>
              </td>
              <td className="px-6 py-4">
                <p className="font-semibold text-gray-300">{item.role}</p>
                <p className="text-gray-500 text-xs mt-1 italic leading-relaxed">{item.justification}</p>
              </td>
              <td className="px-6 py-4 font-mono text-cyan-500/80">${item.costEstimate}</td>
              <td className="px-6 py-4">
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-cyan-500 hover:text-cyan-300 flex items-center gap-1 font-bold text-xs"
                >
                  DATASHEET 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
