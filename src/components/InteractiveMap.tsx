import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { SupportPoint, SOSRequest, SupportCategory } from '../types.ts';
import { CATEGORY_LABELS, STATUS_LABELS } from '../utils/geo.ts';
import { Layers, Compass, Crosshair, MapPin } from 'lucide-react';

interface InteractiveMapProps {
  points: SupportPoint[];
  sosRequests: SOSRequest[];
  selectedPoint: SupportPoint | null;
  selectedSOS: SOSRequest | null;
  onSelectPoint: (point: SupportPoint) => void;
  onSelectSOS: (sos: SOSRequest) => void;
  userLocation: { lat: number; lng: number } | null;
  isPickingLocation: boolean;
  pickedLocation: { lat: number; lng: number; address?: string } | null;
  onLocationPicked: (lat: number, lng: number) => void;
  activeCategory: SupportCategory | 'all';
}

const TILE_LAYERS = {
  standard: {
    name: 'Bản đồ chuẩn',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  positron: {
    name: 'Sạch / Tinh gọn (CartoDB)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CARTO, &copy; OpenStreetMap contributors',
  },
  humanitarian: {
    name: 'Nhân đạo (Humanitarian)',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; Humanitarian OpenStreetMap Team',
  },
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  points,
  sosRequests,
  selectedPoint,
  selectedSOS,
  onSelectPoint,
  onSelectSOS,
  userLocation,
  isPickingLocation,
  pickedLocation,
  onLocationPicked,
  activeCategory,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const pickMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeTileKey, setActiveTileKey] = useState<keyof typeof TILE_LAYERS>('positron');
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center on Vietnam (approx 16.0, 107.5) with zoom 6
    const map = L.map(mapContainerRef.current, {
      center: [16.0471, 107.5],
      zoom: 6,
      zoomControl: false,
    });

    // Custom zoom control in bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial tile layer
    const initialTile = L.tileLayer(TILE_LAYERS[activeTileKey].url, {
      attribution: TILE_LAYERS[activeTileKey].attribution,
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = initialTile;
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Handle map clicks for location picking
    map.on('click', (e: L.LeafletMouseEvent) => {
      onLocationPicked(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer if switched
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const newTile = L.tileLayer(TILE_LAYERS[activeTileKey].url, {
      attribution: TILE_LAYERS[activeTileKey].attribution,
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTile;
  }, [activeTileKey]);

  // Update Picked Marker if user is picking
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (pickedLocation) {
      if (!pickMarkerRef.current) {
        const pinIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl border-2 border-white animate-bounce">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div class="absolute -bottom-2 w-3 h-1 bg-black/40 rounded-full blur-[1px]"></div>
            </div>
          `,
          iconSize: [40, 48],
          iconAnchor: [20, 44],
        });

        pickMarkerRef.current = L.marker([pickedLocation.lat, pickedLocation.lng], {
          icon: pinIcon,
          draggable: true,
        }).addTo(mapInstanceRef.current);

        pickMarkerRef.current.on('dragend', (e) => {
          const latlng = e.target.getLatLng();
          onLocationPicked(latlng.lat, latlng.lng);
        });
      } else {
        pickMarkerRef.current.setLatLng([pickedLocation.lat, pickedLocation.lng]);
      }
    } else if (pickMarkerRef.current) {
      mapInstanceRef.current.removeLayer(pickMarkerRef.current);
      pickMarkerRef.current = null;
    }
  }, [pickedLocation]);

  // Update User Location
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 9,
        fillColor: '#2563eb',
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(mapInstanceRef.current);

      userMarkerRef.current.bindPopup(`
        <div style="font-family: inherit; padding: 4px 6px;">
          <div style="font-weight: 600; color: #1e293b;">Vị trí của bạn</div>
          <div style="font-size: 11px; color: #64748b;">Độ chính xác tương đối</div>
        </div>
      `);
    } else {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation]);

  // Render Markers for Support Points and SOS Requests
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. Render Support Points
    points.forEach((point) => {
      // Filter if category is specified
      if (activeCategory !== 'all' && point.category !== activeCategory) {
        return;
      }

      const catMeta = CATEGORY_LABELS[point.category] || {
        icon: '📍',
        color: '#2563eb',
        bgColor: '#eff6ff',
      };
      const isUrgent = point.status === 'urgent';
      const isSelected = selectedPoint?.id === point.id;

      const markerHtml = `
        <div class="relative group cursor-pointer transition-transform duration-200 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
          ${
            isUrgent
              ? '<div class="absolute -inset-1 rounded-full bg-red-500/40 animate-ping"></div>'
              : ''
          }
          <div class="relative flex items-center justify-center w-9 h-9 rounded-full bg-white shadow-md border-2" style="border-color: ${catMeta.color};">
            <span class="text-base select-none leading-none">${catMeta.icon}</span>
          </div>
          ${
            isSelected
              ? `<div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style="background-color: ${catMeta.color};"></div>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: markerHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20],
      });

      const marker = L.marker([point.lat, point.lng], { icon: customIcon });

      const statusMeta = STATUS_LABELS[point.status] || STATUS_LABELS.active;

      const popupContent = document.createElement('div');
      popupContent.className = 'p-3.5 max-w-[280px] text-slate-800';
      popupContent.innerHTML = `
        <div class="text-[11px] font-medium text-slate-500 mb-1 flex items-center justify-between">
          <span>${catMeta.label}</span>
          <span style="color: ${statusMeta.color}; font-weight: 600;">${statusMeta.label}</span>
        </div>
        <h4 class="font-bold text-slate-900 text-sm leading-snug mb-1.5">${point.title}</h4>
        <p class="text-xs text-slate-600 mb-2 leading-relaxed line-clamp-2">${point.address}</p>
        <div class="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span class="text-slate-500 font-mono text-[11px]">${point.id}</span>
          <button id="btn-popup-${point.id}" class="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors">
            Xem chi tiết
          </button>
        </div>
      `;

      // Attach button click event in popup
      popupContent.querySelector(`#btn-popup-${point.id}`)?.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectPoint(point);
      });

      marker.bindPopup(popupContent, {
        className: 'custom-leaflet-popup',
        closeButton: true,
      });

      marker.on('click', () => {
        onSelectPoint(point);
      });

      markersLayerRef.current?.addLayer(marker);
    });

    // 2. Render SOS Emergency Requests
    sosRequests.forEach((sos) => {
      const isSelected = selectedSOS?.id === sos.id;
      const isCritical = sos.urgency === 'critical';

      const sosMarkerHtml = `
        <div class="relative cursor-pointer transition-transform duration-200 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
          <div class="absolute -inset-2 rounded-full ${isCritical ? 'bg-red-600/50 animate-sos-ring' : 'bg-amber-500/30 animate-pulse'}"></div>
          <div class="relative flex items-center justify-center w-10 h-10 rounded-full bg-red-600 text-white font-bold text-[11px] shadow-lg border-2 border-white tracking-wider">
            SOS
          </div>
        </div>
      `;

      const sosIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: sosMarkerHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -22],
      });

      const sosMarker = L.marker([sos.lat, sos.lng], { icon: sosIcon });

      const sosPopup = document.createElement('div');
      sosPopup.className = 'p-3.5 max-w-[280px] text-slate-800 bg-red-50/50';
      sosPopup.innerHTML = `
        <div class="text-[11px] font-bold text-red-600 uppercase tracking-wide mb-1 flex items-center justify-between">
          <span>Yêu cầu cứu trợ khẩn</span>
          <span class="font-mono text-slate-500">${sos.id}</span>
        </div>
        <h4 class="font-bold text-slate-900 text-sm leading-snug mb-1">${sos.fullName} (${sos.peopleCount} người)</h4>
        <p class="text-xs text-slate-600 mb-2 leading-relaxed line-clamp-2">${sos.address}</p>
        <p class="text-xs text-red-700 italic mb-2.5 bg-red-100/60 p-1.5 rounded">${sos.description}</p>
        <div class="flex items-center justify-between pt-2 border-t border-red-200/60 text-xs">
          <span class="text-slate-500 text-[11px]">${sos.createdAt}</span>
          <button id="btn-sos-${sos.id}" class="px-2.5 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors">
            Tiếp cận hỗ trợ
          </button>
        </div>
      `;

      sosPopup.querySelector(`#btn-sos-${sos.id}`)?.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectSOS(sos);
      });

      sosMarker.bindPopup(sosPopup, {
        className: 'custom-leaflet-popup',
        closeButton: true,
      });

      sosMarker.on('click', () => {
        onSelectSOS(sos);
      });

      markersLayerRef.current?.addLayer(sosMarker);
    });
  }, [points, sosRequests, activeCategory, selectedPoint, selectedSOS]);

  // Fly to selected item if requested
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (selectedPoint) {
      mapInstanceRef.current.flyTo([selectedPoint.lat, selectedPoint.lng], 14, {
        duration: 1.2,
      });
    } else if (selectedSOS) {
      mapInstanceRef.current.flyTo([selectedSOS.lat, selectedSOS.lng], 14, {
        duration: 1.2,
      });
    }
  }, [selectedPoint, selectedSOS]);

  // Center on user location
  const handleLocateMe = () => {
    if (!mapInstanceRef.current) return;

    if (userLocation) {
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 14, {
        duration: 1,
      });
      return;
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          onLocationPicked(lat, lng);
          mapInstanceRef.current?.flyTo([lat, lng], 14, { duration: 1 });
        },
        () => {
          // Fallback to central Hanoi or Danang if denied
          mapInstanceRef.current?.flyTo([21.0285, 105.8542], 12);
        }
      );
    }
  };

  const handleResetVietnamView = () => {
    mapInstanceRef.current?.flyTo([16.0471, 107.5], 6, { duration: 1 });
  };

  const handleJumpToRegion = (coords: [number, number], zoom = 12) => {
    mapInstanceRef.current?.flyTo(coords, zoom, { duration: 1 });
  };

  return (
    <div className="relative w-full h-full min-h-[480px] bg-slate-100 overflow-hidden select-none">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Picking Location Indicator Banner */}
      {isPickingLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2.5 text-xs md:text-sm animate-pulse">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Nhấp chuột lên bản đồ để chọn tọa độ điểm cần đăng ký</span>
        </div>
      )}

      {/* Floating Map Controls & Quick Regions */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* Layer Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            title="Đổi kiểu bản đồ"
            className="w-10 h-10 bg-white/95 backdrop-blur rounded-lg shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-white transition-colors"
          >
            <Layers className="w-5 h-5" />
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 w-52 z-30 text-xs">
              <div className="px-3 py-1 font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
                Giao diện bản đồ
              </div>
              {(Object.keys(TILE_LAYERS) as Array<keyof typeof TILE_LAYERS>).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTileKey(key);
                    setShowLayerMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    activeTileKey === key ? 'font-semibold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{TILE_LAYERS[key].name}</span>
                  {activeTileKey === key && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Locate Me */}
        <button
          onClick={handleLocateMe}
          title="Định vị tôi"
          className="w-10 h-10 bg-white/95 backdrop-blur rounded-lg shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-white transition-colors"
        >
          <Crosshair className="w-5 h-5" />
        </button>

        {/* Reset View */}
        <button
          onClick={handleResetVietnamView}
          title="Xem toàn cảnh Việt Nam"
          className="w-10 h-10 bg-white/95 backdrop-blur rounded-lg shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-white transition-colors"
        >
          <Compass className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Region Selector Floating Strip */}
      <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-lg shadow-md border border-slate-200 text-xs font-medium text-slate-700">
        <span className="text-[11px] text-slate-500 px-1 font-normal">Khu vực:</span>
        <button
          onClick={() => handleJumpToRegion([21.0285, 105.8542], 12)}
          className="px-2.5 py-1 rounded hover:bg-slate-100 transition-colors"
        >
          Hà Nội
        </button>
        <button
          onClick={() => handleJumpToRegion([16.0544, 108.2022], 12)}
          className="px-2.5 py-1 rounded hover:bg-slate-100 transition-colors"
        >
          Đà Nẵng
        </button>
        <button
          onClick={() => handleJumpToRegion([17.2185, 106.7792], 12)}
          className="px-2.5 py-1 rounded hover:bg-slate-100 transition-colors text-red-600 font-semibold"
        >
          Quảng Bình (Lũ lụt)
        </button>
        <button
          onClick={() => handleJumpToRegion([21.6748, 104.8872], 12)}
          className="px-2.5 py-1 rounded hover:bg-slate-100 transition-colors text-amber-700 font-semibold"
        >
          Yên Bái
        </button>
        <button
          onClick={() => handleJumpToRegion([10.8231, 106.6297], 12)}
          className="px-2.5 py-1 rounded hover:bg-slate-100 transition-colors"
        >
          TP. Hồ Chí Minh
        </button>
      </div>

      {/* Legend / Status indicator in bottom left */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-md border border-slate-200 text-[11px] text-slate-600 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Điểm hoạt động</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          <span>Khẩn cấp / Chi viện</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[8px]">
            SOS
          </span>
          <span>Yêu cầu cứu trợ</span>
        </div>
      </div>
    </div>
  );
};
