import React, { useState, useEffect } from 'react';
import { SupportPoint, SOSRequest, SupportPledge, SupportCategory, SupportStatus } from './types.ts';
import { INITIAL_SUPPORT_POINTS, INITIAL_SOS_REQUESTS } from './data/initialData.ts';
import { Navbar } from './components/Navbar.tsx';
import { InteractiveMap } from './components/InteractiveMap.tsx';
import { SidebarList } from './components/SidebarList.tsx';
import { PointDetailDrawer } from './components/PointDetailDrawer.tsx';
import { SOSDetailDrawer } from './components/SOSDetailDrawer.tsx';
import { SOSModal } from './components/SOSModal.tsx';
import { AddPointModal } from './components/AddPointModal.tsx';
import { SupportPledgeModal } from './components/SupportPledgeModal.tsx';
import { EmergencyHotlineModal } from './components/EmergencyHotlineModal.tsx';
import { StatsModal } from './components/StatsModal.tsx';
import { SOSTabView } from './components/SOSTabView.tsx';
import { MapPin, AlertCircle, HeartHandshake, PhoneCall } from 'lucide-react';

export default function App() {
  // Points State with LocalStorage persistence
  const [points, setPoints] = useState<SupportPoint[]>(() => {
    const saved = localStorage.getItem('hotromap_points');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved points', e);
      }
    }
    return INITIAL_SUPPORT_POINTS;
  });

  // SOS Requests State with LocalStorage persistence
  const [sosRequests, setSosRequests] = useState<SOSRequest[]>(() => {
    const saved = localStorage.getItem('hotromap_sos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved SOS', e);
      }
    }
    return INITIAL_SOS_REQUESTS;
  });

  // Pledges State
  const [pledges, setPledges] = useState<SupportPledge[]>(() => {
    const saved = localStorage.getItem('hotromap_pledges');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved pledges', e);
      }
    }
    return [];
  });

  // Navigation & View
  const [activeTab, setActiveTab] = useState<'map' | 'list' | 'sos' | 'hotlines' | 'stats'>('map');

  // Selected Items for Drawers
  const [selectedPoint, setSelectedPoint] = useState<SupportPoint | null>(null);
  const [selectedSOS, setSelectedSOS] = useState<SOSRequest | null>(null);
  const [pointToPledge, setPointToPledge] = useState<SupportPoint | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<SupportCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<SupportStatus | 'all'>('all');

  // User Geolocation
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Coordinate Picking for AddPoint and SOS
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [pendingModalType, setPendingModalType] = useState<'add_point' | 'sos' | null>(null);

  // Modals
  const [isAddPointOpen, setIsAddPointOpen] = useState(false);
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [isHotlinesOpen, setIsHotlinesOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Status Notification Toast
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('hotromap_points', JSON.stringify(points));
  }, [points]);

  useEffect(() => {
    localStorage.setItem('hotromap_sos', JSON.stringify(sosRequests));
  }, [sosRequests]);

  useEffect(() => {
    localStorage.setItem('hotromap_pledges', JSON.stringify(pledges));
  }, [pledges]);

  // Try to obtain user geolocation gently on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          // If permission dismissed or denied, use default
          console.log('Location permission not granted or unavailable.');
        },
        { timeout: 8000 }
      );
    }
  }, []);

  // Handle location picked on map
  const handleLocationPicked = (lat: number, lng: number) => {
    if (isPickingLocation) {
      setPickedLocation({ lat, lng });
      setIsPickingLocation(false);
      if (pendingModalType === 'add_point') {
        setIsAddPointOpen(true);
      } else if (pendingModalType === 'sos') {
        setIsSOSModalOpen(true);
      }
      setPendingModalType(null);
      showNotification(`Đã chọn tọa độ: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  // Trigger pick location
  const handleRequestPick = (type: 'add_point' | 'sos') => {
    setPendingModalType(type);
    setIsPickingLocation(true);
    showNotification('Nhấp vào bất kỳ điểm nào trên bản đồ để chọn vị trí');
  };

  // Add Point
  const handleAddPoint = (newPoint: SupportPoint) => {
    setPoints((prev) => [newPoint, ...prev]);
    setSelectedPoint(newPoint);
    setActiveTab('map');
    showNotification(`Đã thêm điểm hỗ trợ: "${newPoint.title}" thành công!`);
  };

  // Submit SOS
  const handleSubmitSOS = (newSOSData: Omit<SOSRequest, 'id' | 'createdAt' | 'status'>) => {
    const newSOS: SOSRequest = {
      ...newSOSData,
      id: `SOS-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: 'Vừa xong',
      status: 'pending',
    };
    setSosRequests((prev) => [newSOS, ...prev]);
    setSelectedSOS(newSOS);
    setActiveTab('map');
    showNotification(`Đã phát tín hiệu SOS cho ${newSOS.fullName}!`);
  };

  // Submit Pledge
  const handleSubmitPledge = (newPledge: SupportPledge) => {
    setPledges((prev) => [newPledge, ...prev]);
    showNotification(`Đã gửi thông tin chi viện: "${newPledge.quantity}" thành công!`);
  };

  // Update SOS status
  const handleUpdateSOSStatus = (sosId: string, status: SOSRequest['status']) => {
    setSosRequests((prev) =>
      prev.map((s) => (s.id === sosId ? { ...s, status } : s))
    );
    if (selectedSOS?.id === sosId) {
      setSelectedSOS((prev) => (prev ? { ...prev, status } : null));
    }
    showNotification('Đã cập nhật trạng thái cứu hộ');
  };

  // Handle hotlines and stats from navbar
  const handleTabChange = (tab: 'map' | 'list' | 'sos' | 'hotlines' | 'stats') => {
    if (tab === 'hotlines') {
      setIsHotlinesOpen(true);
    } else if (tab === 'stats') {
      setIsStatsOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100 overflow-hidden text-slate-900 font-sans antialiased">
      {/* Navbar with 3-Zone contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenAddPoint={() => setIsAddPointOpen(true)}
        onOpenSOSModal={() => setIsSOSModalOpen(true)}
        sosCount={sosRequests.filter((s) => s.status !== 'rescued').length}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900/95 text-white text-xs md:text-sm px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-fade-in">
          <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 relative flex overflow-hidden">
        {/* VIEW 1: Interactive Map + Sidebar Split View */}
        {activeTab === 'map' && (
          <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">
            {/* Left Filter & Stations List Sidebar (Collapsible on mobile) */}
            <div className="w-full md:w-[380px] lg:w-[420px] h-full shrink-0 z-10 hidden md:block">
              <SidebarList
                points={points}
                selectedPoint={selectedPoint}
                onSelectPoint={(point) => {
                  setSelectedPoint(point);
                  setSelectedSOS(null);
                }}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedProvince={selectedProvince}
                setSelectedProvince={setSelectedProvince}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                userLocation={userLocation}
                onOpenSOSModal={() => setIsSOSModalOpen(true)}
              />
            </div>

            {/* Right Map Viewport */}
            <div className="flex-1 h-full relative">
              <InteractiveMap
                points={points}
                sosRequests={sosRequests}
                selectedPoint={selectedPoint}
                selectedSOS={selectedSOS}
                onSelectPoint={(point) => {
                  setSelectedPoint(point);
                  setSelectedSOS(null);
                }}
                onSelectSOS={(sos) => {
                  setSelectedSOS(sos);
                  setSelectedPoint(null);
                }}
                userLocation={userLocation}
                isPickingLocation={isPickingLocation}
                pickedLocation={pickedLocation}
                onLocationPicked={handleLocationPicked}
                activeCategory={selectedCategory}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: Full List Mode */}
        {activeTab === 'list' && (
          <div className="w-full h-full max-w-6xl mx-auto flex flex-col overflow-hidden bg-white shadow-sm border-x border-slate-200">
            <SidebarList
              points={points}
              selectedPoint={selectedPoint}
              onSelectPoint={(point) => {
                setSelectedPoint(point);
                setActiveTab('map');
              }}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedProvince={selectedProvince}
              setSelectedProvince={setSelectedProvince}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              userLocation={userLocation}
              onOpenSOSModal={() => setIsSOSModalOpen(true)}
            />
          </div>
        )}

        {/* VIEW 3: Dedicated SOS Tab View */}
        {activeTab === 'sos' && (
          <div className="w-full h-full flex flex-col md:flex-row overflow-hidden">
            <div className="w-full md:w-[460px] lg:w-[500px] h-full shrink-0 border-r border-slate-200">
              <SOSTabView
                sosRequests={sosRequests}
                selectedSOS={selectedSOS}
                onSelectSOS={(sos) => {
                  setSelectedSOS(sos);
                  setSelectedPoint(null);
                }}
                onOpenSOSModal={() => setIsSOSModalOpen(true)}
                userLocation={userLocation}
              />
            </div>
            <div className="flex-1 h-full hidden md:block">
              <InteractiveMap
                points={points}
                sosRequests={sosRequests}
                selectedPoint={selectedPoint}
                selectedSOS={selectedSOS}
                onSelectPoint={(point) => {
                  setSelectedPoint(point);
                  setSelectedSOS(null);
                }}
                onSelectSOS={(sos) => {
                  setSelectedSOS(sos);
                  setSelectedPoint(null);
                }}
                userLocation={userLocation}
                isPickingLocation={isPickingLocation}
                pickedLocation={pickedLocation}
                onLocationPicked={handleLocationPicked}
                activeCategory={selectedCategory}
              />
            </div>
          </div>
        )}

        {/* Support Point Detail Drawer */}
        <PointDetailDrawer
          point={selectedPoint}
          onClose={() => setSelectedPoint(null)}
          onOpenPledge={(pt) => setPointToPledge(pt)}
          userLocation={userLocation}
        />

        {/* SOS Emergency Detail Drawer */}
        <SOSDetailDrawer
          sos={selectedSOS}
          onClose={() => setSelectedSOS(null)}
          onUpdateStatus={handleUpdateSOSStatus}
          userLocation={userLocation}
        />

        {/* Add Point Modal */}
        <AddPointModal
          isOpen={isAddPointOpen}
          onClose={() => setIsAddPointOpen(false)}
          onAddPoint={handleAddPoint}
          userLocation={userLocation}
          onRequestPickLocation={() => handleRequestPick('add_point')}
          pickedLocation={pickedLocation}
        />

        {/* SOS Request Modal */}
        <SOSModal
          isOpen={isSOSModalOpen}
          onClose={() => setIsSOSModalOpen(false)}
          onSubmitSOS={handleSubmitSOS}
          userLocation={userLocation}
          onRequestPickLocation={() => handleRequestPick('sos')}
          pickedLocation={pickedLocation}
        />

        {/* Pledge Modal */}
        <SupportPledgeModal
          isOpen={!!pointToPledge}
          onClose={() => setPointToPledge(null)}
          point={pointToPledge}
          onSubmitPledge={handleSubmitPledge}
        />

        {/* Emergency Hotlines Modal */}
        <EmergencyHotlineModal
          isOpen={isHotlinesOpen}
          onClose={() => setIsHotlinesOpen(false)}
        />

        {/* Stats & Community Impact Modal */}
        <StatsModal
          isOpen={isStatsOpen}
          onClose={() => setIsStatsOpen(false)}
          points={points}
          sosRequests={sosRequests}
          pledges={pledges}
        />
      </main>
    </div>
  );
}
