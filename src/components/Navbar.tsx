import React from 'react';
import { PlusCircle, AlertCircle, PhoneCall, BarChart3, Map, ListFilter } from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'list' | 'sos' | 'hotlines' | 'stats';
  setActiveTab: (tab: 'map' | 'list' | 'sos' | 'hotlines' | 'stats') => void;
  onOpenAddPoint: () => void;
  onOpenSOSModal: () => void;
  sosCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddPoint,
  onOpenSOSModal,
  sosCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
            H
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
              HoTroMap
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded tracking-wide">
              H02
            </span>
          </div>
        </div>

        {/* Zone 2: Single-line Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'map'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Bản đồ trực quan</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'list'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>Danh sách điểm</span>
          </button>

          <button
            onClick={() => setActiveTab('sos')}
            className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'sos'
                ? 'text-red-600 font-semibold border-b-2 border-red-600'
                : 'text-red-600 hover:text-red-700'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Tin cứu trợ SOS</span>
            {sosCount > 0 && (
              <span className="bg-red-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
                {sosCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('hotlines')}
            className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'hotlines'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Danh bạ khẩn cấp</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'stats'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Thống kê</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Quick SOS */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenSOSModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Gửi cứu trợ</span> SOS
          </button>

          <button
            onClick={onOpenAddPoint}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Đăng ký điểm hỗ trợ</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Tab Navigation Strip */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-2 bg-slate-50 text-xs">
        <button
          onClick={() => setActiveTab('map')}
          className={`px-2.5 py-1 rounded font-medium ${activeTab === 'map' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'}`}
        >
          Bản đồ
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`px-2.5 py-1 rounded font-medium ${activeTab === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'}`}
        >
          Danh sách
        </button>
        <button
          onClick={() => setActiveTab('sos')}
          className={`px-2.5 py-1 rounded font-medium text-red-600 flex items-center gap-1 ${activeTab === 'sos' ? 'bg-red-100/60 font-semibold' : ''}`}
        >
          SOS ({sosCount})
        </button>
        <button
          onClick={() => setActiveTab('hotlines')}
          className={`px-2.5 py-1 rounded font-medium ${activeTab === 'hotlines' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'}`}
        >
          Đường dây nóng
        </button>
      </div>
    </header>
  );
};
