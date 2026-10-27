import React, { useMemo } from 'react';
import { SupportPoint, SupportCategory, SupportStatus } from '../types.ts';
import { CATEGORY_LABELS, STATUS_LABELS, calculateDistanceKm, formatDistance } from '../utils/geo.ts';
import { Search, MapPin, Phone, Clock, ArrowRight, ShieldCheck, FilterX } from 'lucide-react';

interface SidebarListProps {
  points: SupportPoint[];
  selectedPoint: SupportPoint | null;
  onSelectPoint: (point: SupportPoint) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProvince: string;
  setSelectedProvince: (prov: string) => void;
  selectedCategory: SupportCategory | 'all';
  setSelectedCategory: (cat: SupportCategory | 'all') => void;
  selectedStatus: SupportStatus | 'all';
  setSelectedStatus: (status: SupportStatus | 'all') => void;
  userLocation: { lat: number; lng: number } | null;
  onOpenSOSModal: () => void;
}

export const SidebarList: React.FC<SidebarListProps> = ({
  points,
  selectedPoint,
  onSelectPoint,
  searchQuery,
  setSearchQuery,
  selectedProvince,
  setSelectedProvince,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  userLocation,
}) => {
  // Extract unique provinces
  const provinces = useMemo(() => {
    const list = Array.from(new Set(points.map((p) => p.province))).filter(Boolean);
    return ['all', ...list];
  }, [points]);

  // Filter and compute distances
  const filteredPoints = useMemo(() => {
    return points
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchAddr = p.address.toLowerCase().includes(q);
          const matchItems = p.availableItems.some((i) => i.toLowerCase().includes(q));
          const matchNeeds = p.urgentNeeds.some((n) => n.toLowerCase().includes(q));
          const matchContact = p.contactPerson.toLowerCase().includes(q);
          if (!matchTitle && !matchAddr && !matchItems && !matchNeeds && !matchContact) {
            return false;
          }
        }

        // Province
        if (selectedProvince !== 'all' && p.province !== selectedProvince) {
          return false;
        }

        // Category
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Status
        if (selectedStatus !== 'all' && p.status !== selectedStatus) {
          return false;
        }

        return true;
      })
      .map((p) => {
        let distance: number | null = null;
        if (userLocation) {
          distance = calculateDistanceKm(userLocation.lat, userLocation.lng, p.lat, p.lng);
        }
        return { ...p, distance };
      })
      .sort((a, b) => {
        // Prioritize urgent first, then distance if available
        if (a.status === 'urgent' && b.status !== 'urgent') return -1;
        if (b.status === 'urgent' && a.status !== 'urgent') return 1;
        if (a.distance !== null && b.distance !== null) {
          return a.distance - b.distance;
        }
        return 0;
      });
  }, [points, searchQuery, selectedProvince, selectedCategory, selectedStatus, userLocation]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedProvince('all');
    setSelectedCategory('all');
    setSelectedStatus('all');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedProvince !== 'all' ||
    selectedCategory !== 'all' ||
    selectedStatus !== 'all';

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Top Filter Area */}
      <div className="p-4 border-b border-slate-200 space-y-3 shrink-0">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên điểm, địa chỉ, đồ cứu trợ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
          />
        </div>

        {/* Province and Status Filter Controls */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-emerald-600"
            >
              <option value="all">Toàn quốc (Tất cả)</option>
              {provinces
                .filter((pr) => pr !== 'all')
                .map((pr) => (
                  <option key={pr} value={pr}>
                    {pr}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as SupportStatus | 'all')}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-emerald-600"
            >
              <option value="all">Mọi tình trạng</option>
              <option value="active">Đang hoạt động</option>
              <option value="urgent">Cần chi viện gấp</option>
              <option value="limited">Sắp hết nguồn lực</option>
            </select>
          </div>
        </div>

        {/* Category Segmented Scrollable Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả ({points.length})
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, meta]) => {
            const count = points.filter((p) => p.category === key).length;
            const isSelected = selectedCategory === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as SupportCategory)}
                className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{meta.icon}</span>
                <span>{meta.label}</span>
                <span className="text-[10px] opacity-80 tabular-nums">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Filter Summary & Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
          <span>
            Tìm thấy <strong className="text-slate-900 tabular-nums">{filteredPoints.length}</strong> điểm hỗ trợ
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* Points Scrollable List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar p-2">
        {filteredPoints.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <p className="text-sm font-medium text-slate-700 mb-1">Không tìm thấy điểm hỗ trợ phù hợp</p>
            <p className="text-xs text-slate-500 mb-3">Thử thay đổi từ khóa hoặc bỏ bớt các điều kiện lọc</p>
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100"
            >
              Xem tất cả điểm hỗ trợ
            </button>
          </div>
        ) : (
          filteredPoints.map((point) => {
            const catMeta = CATEGORY_LABELS[point.category] || CATEGORY_LABELS.food;
            const statusMeta = STATUS_LABELS[point.status] || STATUS_LABELS.active;
            const isSelected = selectedPoint?.id === point.id;

            return (
              <div
                key={point.id}
                onClick={() => onSelectPoint(point)}
                className={`p-3.5 rounded-lg cursor-pointer transition-all duration-150 mb-1 ${
                  isSelected
                    ? 'bg-emerald-50/70 border border-emerald-300 shadow-sm'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{catMeta.icon} {catMeta.label}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[11px]">{point.province}</span>
                    {point.distance !== null && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-blue-600 tabular-nums">
                          {formatDistance(point.distance)}
                        </span>
                      </>
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${statusMeta.badgeClass}`}
                  >
                    {statusMeta.label}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-1">
                  {point.title}
                </h3>

                {/* Address */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{point.address}</span>
                </div>

                {/* Supplies Overview */}
                <div className="text-xs text-slate-600 mb-2 bg-slate-50 p-2 rounded border border-slate-100">
                  <div className="font-medium text-slate-700 mb-0.5 text-[11px]">Sẵn có:</div>
                  <div className="text-[11px] text-slate-600 truncate">
                    {point.availableItems.join(' · ')}
                  </div>
                  {point.urgentNeeds.length > 0 && (
                    <div className="mt-1 text-[11px] text-red-600 font-medium truncate">
                      Cần thêm: {point.urgentNeeds.join(' · ')}
                    </div>
                  )}
                </div>

                {/* Footer metadata */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-[11px]">{point.operatingHours.split('&')[0]}</span>
                    </span>
                    {point.verified && (
                      <span className="flex items-center gap-0.5 text-emerald-600 text-[11px] font-medium" title="Đã được ban điều phối xác minh">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Xác minh</span>
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-slate-900 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Chi tiết
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
