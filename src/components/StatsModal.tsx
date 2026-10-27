import React from 'react';
import { SupportPoint, SOSRequest, SupportPledge } from '../types.ts';
import { CATEGORY_LABELS } from '../utils/geo.ts';
import { X, BarChart3, TrendingUp, Users, HeartHandshake, ShieldCheck } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  points: SupportPoint[];
  sosRequests: SOSRequest[];
  pledges: SupportPledge[];
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  points,
  sosRequests,
  pledges,
}) => {
  if (!isOpen) return null;

  const totalCapacity = points.reduce((acc, p) => acc + p.capacity.current, 0);
  const urgentCount = points.filter((p) => p.status === 'urgent').length;
  const criticalSOS = sosRequests.filter((s) => s.urgency === 'critical').length;
  const resolvedSOS = sosRequests.filter((s) => s.status === 'rescued').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Thống Kê Hoạt Động & Tác Động Cộng Đồng</h3>
              <p className="text-xs text-slate-300">Dữ liệu thời gian thực dự án HoTroMap (Mã đề tài: H02)</p>
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
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Key Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="text-2xl font-bold text-slate-900 tabular-nums">{points.length}</div>
              <div className="text-xs text-slate-500 mt-1">Điểm hỗ trợ đã mở</div>
            </div>

            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl">
              <div className="text-2xl font-bold text-emerald-700 tabular-nums">{totalCapacity.toLocaleString()}</div>
              <div className="text-xs text-slate-600 mt-1">Suất hỗ trợ sẵn sàng</div>
            </div>

            <div className="p-4 bg-red-50/60 border border-red-200 rounded-xl">
              <div className="text-2xl font-bold text-red-600 tabular-nums">{sosRequests.length}</div>
              <div className="text-xs text-slate-600 mt-1">Tin báo SOS tiếp nhận</div>
            </div>

            <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl">
              <div className="text-2xl font-bold text-blue-700 tabular-nums">{pledges.length}</div>
              <div className="text-xs text-slate-600 mt-1">Lượt chi viện gửi tới</div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              Phân bố theo nhóm hỗ trợ
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(CATEGORY_LABELS).map(([catKey, meta]) => {
                const count = points.filter((p) => p.category === catKey).length;
                const pct = points.length > 0 ? Math.round((count / points.length) * 100) : 0;
                return (
                  <div
                    key={catKey}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{meta.icon}</span>
                      <div>
                        <div className="text-xs font-semibold text-slate-800">{meta.label}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{pct}% tổng số điểm</div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                      {count} trạm
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rescue & Urgent Status */}
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-700" />
              <span>Tình hình điều phối khẩn cấp</span>
            </h4>
            <div className="text-xs text-amber-950 space-y-1">
              <div>• Có <strong className="tabular-nums">{urgentCount}</strong> trạm đang trong tình trạng cần chi viện gấp lương thực, vật tư hoặc tình nguyện viên.</div>
              <div>• Có <strong className="tabular-nums">{criticalSOS}</strong> ca SOS mức độ nguy cấp đang được lực lượng chức năng và đội xuồng máy tiếp cận.</div>
              <div>• Đã có <strong className="tabular-nums">{resolvedSOS}</strong> điểm ngập úng được hỗ trợ di dời người dân thành công.</div>
            </div>
          </div>

          {/* Project Details Footer */}
          <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              Đề tài: <strong>Bản đồ điểm hỗ trợ cộng đồng</strong> (Mã đề tài: <strong>H02</strong>)
            </div>
            <div className="font-mono text-emerald-700">hotromap.ai.studio</div>
          </div>
        </div>
      </div>
    </div>
  );
};
