/**
 * Calculate distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function formatDistance(km: number | null | undefined): string {
  if (km === null || km === undefined) return '';
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export const CATEGORY_LABELS: Record<string, { label: string; icon: string; color: string; bgColor: string }> = {
  food: {
    label: 'Thực phẩm & Bếp cơm',
    icon: '🍲',
    color: '#ea580c', // orange-600
    bgColor: '#ffedd5', // orange-100
  },
  medical: {
    label: 'Y tế & Thuốc men',
    icon: '💊',
    color: '#0284c7', // sky-600
    bgColor: '#e0f2fe', // sky-100
  },
  shelter: {
    label: 'Chỗ ở & Trú ẩn',
    icon: '🏠',
    color: '#16a34a', // green-600
    bgColor: '#dcfce7', // green-100
  },
  supplies: {
    label: 'Nhu yếu phẩm & Đồ ấm',
    icon: '👕',
    color: '#7c3aed', // violet-600
    bgColor: '#ede9fe', // violet-100
  },
  rescue: {
    label: 'Cứu hộ & Xuồng máy',
    icon: '🆘',
    color: '#dc2626', // red-600
    bgColor: '#fee2e2', // red-100
  },
  donation: {
    label: 'Tiếp nhận quyên góp',
    icon: '🤝',
    color: '#059669', // emerald-600
    bgColor: '#d1fae5', // emerald-100
  },
};

export const STATUS_LABELS: Record<string, { label: string; color: string; badgeClass: string }> = {
  active: {
    label: 'Đang hoạt động',
    color: '#16a34a',
    badgeClass: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
  },
  urgent: {
    label: 'Cần chi viện gấp',
    color: '#dc2626',
    badgeClass: 'text-red-700 bg-red-50 border border-red-200',
  },
  limited: {
    label: 'Sắp hết nguồn lực',
    color: '#d97706',
    badgeClass: 'text-amber-700 bg-amber-50 border border-amber-200',
  },
  full: {
    label: 'Đã đủ / Tạm dừng',
    color: '#64748b',
    badgeClass: 'text-slate-700 bg-slate-100 border border-slate-200',
  },
};
