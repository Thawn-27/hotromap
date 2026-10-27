import React, { useState } from 'react';
import { EmergencyContact } from '../types.ts';
import { EMERGENCY_CONTACTS } from '../data/initialData.ts';
import { X, PhoneCall, Search, Shield, HeartPulse, LifeBuoy } from 'lucide-react';

interface EmergencyHotlineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyHotlineModal: React.FC<EmergencyHotlineModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = EMERGENCY_CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.area.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Danh Bạ Đường Dây Nóng Khẩn Cấp</h3>
              <p className="text-xs text-slate-300">Tra cứu nhanh đầu số cứu nạn, y tế và cứu trợ toàn quốc</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo đơn vị cứu nạn, khu vực (Hà Nội, Quảng Bình, Toàn quốc)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2.5 custom-scrollbar">
          {filtered.map((contact) => {
            const isNational = contact.category === 'national' || contact.category === 'rescue';
            return (
              <div
                key={contact.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-slate-500 font-semibold">{contact.area}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {contact.category === 'national' ? 'Quốc gia' : contact.category === 'rescue' ? 'Cứu nạn bão lũ' : contact.category === 'medical' ? 'Y tế' : 'Thiện nguyện'}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{contact.name}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{contact.description}</p>
                </div>

                <div className="shrink-0 flex items-center justify-end sm:flex-col sm:items-end gap-1.5">
                  <a
                    href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs transition-colors shadow-sm ${
                      isNational
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Gọi {contact.phone}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          Các cuộc gọi đến 112, 114, 115 hoàn toàn miễn phí cước viễn thông và hoạt động liên tục 24/7.
        </div>
      </div>
    </div>
  );
};
