import React from 'react';
import { SOSRequest } from '../types.ts';
import { calculateDistanceKm, formatDistance } from '../utils/geo.ts';
import { X, ShieldAlert, Phone, Users, MapPin, Navigation, CheckCircle2 } from 'lucide-react';

interface SOSDetailDrawerProps {
  sos: SOSRequest | null;
  onClose: () => void;
  onUpdateStatus: (sosId: string, status: SOSRequest['status']) => void;
  userLocation: { lat: number; lng: number } | null;
}

export const SOSDetailDrawer: React.FC<SOSDetailDrawerProps> = ({
  sos,
  onClose,
  onUpdateStatus,
  userLocation,
}) => {
  if (!sos) return null;

  const distance = userLocation
    ? calculateDistanceKm(userLocation.lat, userLocation.lng, sos.lat, sos.lng)
    : null;

  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${sos.lat},${sos.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white shadow-2xl border-l border-red-200 flex flex-col transform transition-transform duration-300 ease-out">
      {/* Header */}
      <div className="p-4 border-b border-red-200 flex items-center justify-between bg-red-600 text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
            SOS
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-red-100 flex items-center gap-1.5">
              <span>Tin Cứu Trợ Khẩn Cấp</span>
              <span>·</span>
              <span className="font-mono">{sos.id}</span>
            </div>
            <div className="text-[11px] text-red-100">{sos.createdAt}</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar text-slate-800">
        {/* Urgency Badge & Person */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                sos.urgency === 'critical'
                  ? 'bg-red-100 text-red-700 border border-red-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {sos.urgency === 'critical' ? '🔴 MỨC ĐỘ NGUY CẤP' : '🟠 MỨC ĐỘ KHẨN CẤP'}
            </span>

            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              Trạng thái: {sos.status === 'in_progress' ? 'Đang tiếp cận' : sos.status === 'rescued' ? 'Đã an toàn' : 'Chờ cứu hộ'}
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 leading-snug">
            {sos.fullName}
          </h2>

          <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              {sos.peopleCount} người cần hỗ trợ
            </span>
            {distance !== null && (
              <span className="font-semibold text-blue-600">
                Cách bạn: {formatDistance(distance)}
              </span>
            )}
          </div>
        </div>

        {/* Action Call & Navigate */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${sos.phone}`}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
          >
            <Phone className="w-4 h-4" />
            <span>Gọi ngay: {sos.phone}</span>
          </a>

          <button
            onClick={openDirections}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
          >
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span>Dẫn đường tới</span>
          </button>
        </div>

        {/* Location Box */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-900">Vị trí mắc kẹt / Cần hỗ trợ:</div>
              <div className="text-slate-700 font-medium">{sos.address}, {sos.province}</div>
              <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                Tọa độ: {sos.lat.toFixed(5)}, {sos.lng.toFixed(5)}
              </div>
            </div>
          </div>
        </div>

        {/* Urgent Description */}
        <div className="bg-red-50/80 p-4 rounded-xl border border-red-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-800 uppercase tracking-wider mb-1.5">
            <ShieldAlert className="w-4 h-4 text-red-600" />
            <span>Mô tả hoàn cảnh từ hiện trường</span>
          </div>
          <p className="text-xs text-red-950 leading-relaxed font-medium">
            "{sos.description}"
          </p>
        </div>

        {/* Needs List */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Nhu yếu phẩm đang cần gấp
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {sos.needs.map((item, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold px-2.5 py-1 rounded-md bg-red-100 text-red-800 border border-red-200"
              >
                🚨 {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Rescue Status Controls */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2 shrink-0">
        <div className="text-xs font-semibold text-slate-700">Cập nhật tình trạng ứng cứu:</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onUpdateStatus(sos.id, 'in_progress')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors ${
              sos.status === 'in_progress'
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Đang trên đường đến
          </button>
          <button
            onClick={() => onUpdateStatus(sos.id, 'rescued')}
            className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-colors flex items-center justify-center gap-1 ${
              sos.status === 'rescued'
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Đã tiếp cận an toàn
          </button>
        </div>
      </div>
    </div>
  );
};
