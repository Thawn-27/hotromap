import React, { useState } from 'react';
import { SOSRequest, SOSUrgency } from '../types.ts';
import { calculateDistanceKm, formatDistance } from '../utils/geo.ts';
import { AlertCircle, Phone, MapPin, Users, PlusCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SOSTabViewProps {
  sosRequests: SOSRequest[];
  selectedSOS: SOSRequest | null;
  onSelectSOS: (sos: SOSRequest) => void;
  onOpenSOSModal: () => void;
  userLocation: { lat: number; lng: number } | null;
}

export const SOSTabView: React.FC<SOSTabViewProps> = ({
  sosRequests,
  selectedSOS,
  onSelectSOS,
  onOpenSOSModal,
  userLocation,
}) => {
  const [filterUrgency, setFilterUrgency] = useState<SOSUrgency | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<SOSRequest['status'] | 'all'>('all');

  const filtered = sosRequests.filter((s) => {
    if (filterUrgency !== 'all' && s.urgency !== filterUrgency) return false;
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top Banner */}
      <div className="p-4 border-b border-red-200 bg-red-50/70 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              SOS
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Kênh Điều Phối Cứu Trợ Khẩn Cấp
              </h2>
              <p className="text-xs text-red-700">
                Kết nối trực tiếp người dân gặp nguy hiểm với các đội xuồng máy và tình nguyện viên
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSOSModal}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Phát tín hiệu SOS mới</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-red-200/60 text-xs">
          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value as SOSUrgency | 'all')}
            className="px-2.5 py-1.5 bg-white border border-red-200 rounded-lg text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">Mọi mức độ khẩn cấp</option>
            <option value="critical">🔴 Nguy cấp (Cần xuồng/di tản)</option>
            <option value="high">🟠 Rất cần (Lương thực/Y tế)</option>
            <option value="medium">🔵 Cần hỗ trợ</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as SOSRequest['status'] | 'all')}
            className="px-2.5 py-1.5 bg-white border border-red-200 rounded-lg text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">Mọi trạng thái ứng cứu</option>
            <option value="pending">Chờ cứu hộ</option>
            <option value="in_progress">Đang tiếp cận</option>
            <option value="rescued">Đã an toàn</option>
          </select>

          <span className="text-[11px] text-slate-500 ml-auto font-mono">
            {filtered.length} yêu cầu
          </span>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="font-semibold text-slate-700">Hiện không có yêu cầu SOS nào trong nhóm này</p>
            <p className="text-xs text-slate-500">Tất cả các điểm đã được tiếp cận hoặc chưa có thêm tin báo mới</p>
          </div>
        ) : (
          filtered.map((sos) => {
            const distance = userLocation
              ? calculateDistanceKm(userLocation.lat, userLocation.lng, sos.lat, sos.lng)
              : null;
            const isSelected = selectedSOS?.id === sos.id;

            return (
              <div
                key={sos.id}
                onClick={() => onSelectSOS(sos)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-red-500 bg-red-50/60 shadow-md ring-2 ring-red-500/20'
                    : 'border-slate-200 hover:border-red-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                        sos.urgency === 'critical'
                          ? 'bg-red-600 text-white'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {sos.urgency === 'critical' ? '🔴 NGUY CẤP' : '🟠 KHẨN CẤP'}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">{sos.id}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500 text-[11px]">{sos.createdAt}</span>
                    {distance !== null && (
                      <>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="font-semibold text-blue-600 text-[11px]">
                          {formatDistance(distance)}
                        </span>
                      </>
                    )}
                  </div>

                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      sos.status === 'in_progress'
                        ? 'bg-amber-100 text-amber-800'
                        : sos.status === 'rescued'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {sos.status === 'in_progress' ? 'Đang cứu hộ' : sos.status === 'rescued' ? 'Đã an toàn' : 'Chờ cứu hộ'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                  <span>{sos.fullName}</span>
                  <span className="text-xs font-normal text-slate-500">
                    ({sos.peopleCount} người mắc kẹt)
                  </span>
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{sos.address}, {sos.province}</span>
                </div>

                <div className="bg-red-50/50 p-2.5 rounded-lg border border-red-100 text-xs text-red-950 mb-3 italic">
                  "{sos.description}"
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-wrap gap-1">
                    {sos.needs.map((n, i) => (
                      <span key={i} className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                        {n}
                      </span>
                    ))}
                  </div>

                  <a
                    href={`tel:${sos.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 ml-2 shrink-0 px-2.5 py-1 bg-red-50 rounded border border-red-200"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Gọi {sos.phone}</span>
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
