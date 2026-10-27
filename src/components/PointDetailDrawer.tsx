import React, { useState } from 'react';
import { SupportPoint } from '../types.ts';
import { CATEGORY_LABELS, STATUS_LABELS, calculateDistanceKm, formatDistance } from '../utils/geo.ts';
import { X, MapPin, Phone, Clock, User, ShieldCheck, Navigation, HeartHandshake, Share2, AlertTriangle, Check } from 'lucide-react';

interface PointDetailDrawerProps {
  point: SupportPoint | null;
  onClose: () => void;
  onOpenPledge: (point: SupportPoint) => void;
  userLocation: { lat: number; lng: number } | null;
}

export const PointDetailDrawer: React.FC<PointDetailDrawerProps> = ({
  point,
  onClose,
  onOpenPledge,
  userLocation,
}) => {
  const [copied, setCopied] = useState(false);

  if (!point) return null;

  const catMeta = CATEGORY_LABELS[point.category] || CATEGORY_LABELS.food;
  const statusMeta = STATUS_LABELS[point.status] || STATUS_LABELS.active;

  const distance = userLocation
    ? calculateDistanceKm(userLocation.lat, userLocation.lng, point.lat, point.lng)
    : null;

  const handleCopyLink = () => {
    const text = `${point.title} - ${point.address} (ĐT: ${point.phone}) [HoTroMap - H02]`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openDirections = () => {
    // Open in Google Maps or OpenStreetMap
    const url = `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`;
    window.open(url, '_blank');
  };

  const capacityPct = Math.min(100, Math.round((point.capacity.current / point.capacity.max) * 100));

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-white shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-300 ease-out">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
        <div className="flex items-center gap-2">
          <span className="text-xl">{catMeta.icon}</span>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>{catMeta.label}</span>
              <span>·</span>
              <span className="font-mono">{point.id}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar text-slate-800">
        {/* Title and Status */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${statusMeta.badgeClass}`}>
              {statusMeta.label}
            </span>
            {point.verified && (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                Đã xác minh bởi cộng đồng
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900 leading-snug">
            {point.title}
          </h2>
          {distance !== null && (
            <div className="mt-1 text-xs font-semibold text-blue-600 flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5" />
              Cách vị trí của bạn: {formatDistance(distance)}
            </div>
          )}
        </div>

        {/* Quick Contact & Action Bar */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${point.phone}`}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
          >
            <Phone className="w-4 h-4" />
            <span>Gọi ngay: {point.phone}</span>
          </a>

          <button
            onClick={openDirections}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
          >
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span>Chỉ đường</span>
          </button>
        </div>

        {/* Address and Info Card */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5 text-xs">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-900">Địa chỉ cụ thể:</div>
              <div className="text-slate-600">{point.address}, {point.district}, {point.province}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-900">Thời gian phục vụ:</div>
              <div className="text-slate-600">{point.operatingHours}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-900">Người đại diện / Điều phối:</div>
              <div className="text-slate-600">{point.contactPerson}</div>
            </div>
          </div>
        </div>

        {/* Capacity / Năng lực tiếp nhận */}
        <div className="border border-slate-200 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-700">Khả năng cung ứng hiện tại</span>
            <span className="font-mono text-slate-900 tabular-nums">
              {point.capacity.current} / {point.capacity.max} {point.capacity.unit} ({capacityPct}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                capacityPct > 80 ? 'bg-emerald-600' : capacityPct > 40 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${capacityPct}%` }}
            />
          </div>
        </div>

        {/* Available Items */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Nguồn lực & Nhu yếu phẩm sẵn có
          </h4>
          <div className="space-y-1.5">
            {point.availableItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-xs text-slate-700 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Needs */}
        {point.urgentNeeds.length > 0 && (
          <div className="bg-red-50/70 p-3.5 rounded-xl border border-red-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Cần chi viện khẩn cấp</span>
            </div>
            <div className="space-y-1.5">
              {point.urgentNeeds.map((need, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-red-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                  <span>{need}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {point.notes && (
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/60">
            <div className="font-semibold text-slate-800 mb-0.5">Ghi chú từ trạm:</div>
            <p className="leading-relaxed">{point.notes}</p>
          </div>
        )}

        {/* Update timestamp */}
        <div className="text-[11px] text-slate-400 text-right">
          Cập nhật lần cuối: {point.updatedAt}
        </div>
      </div>

      {/* Footer Primary CTA */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2 shrink-0">
        <button
          onClick={() => onOpenPledge(point)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
        >
          <HeartHandshake className="w-4 h-4" />
          <span>Tôi muốn hỗ trợ điểm này</span>
        </button>

        <button
          onClick={handleCopyLink}
          title="Sao chép thông tin trạm"
          className="p-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-white hover:border-slate-400 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
