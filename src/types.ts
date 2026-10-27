export type SupportCategory = 
  | 'food'      // Thực phẩm & Bếp cơm 0 đồng
  | 'medical'   // Y tế & Thuốc men & Bình oxy
  | 'shelter'   // Nơi lưu trú & Trú bão tạm
  | 'supplies'  // Nhu yếu phẩm & Quần áo ấm
  | 'rescue'    // Cứu hộ xuồng máy & Phương tiện
  | 'donation'; // Điểm tiếp nhận quyên góp & Tình nguyện viên

export type SupportStatus = 
  | 'active'   // Đang hoạt động tốt
  | 'urgent'   // Cần chi viện gấp
  | 'limited'  // Nguồn lực có hạn / Sắp hết
  | 'full';    // Đã tiếp nhận đủ / Tạm ngưng

export interface SupportPoint {
  id: string;
  title: string;
  category: SupportCategory;
  status: SupportStatus;
  lat: number;
  lng: number;
  address: string;
  province: string;
  district: string;
  phone: string;
  contactPerson: string;
  operatingHours: string;
  availableItems: string[];
  urgentNeeds: string[];
  capacity: {
    current: number;
    max: number;
    unit: string;
  };
  notes: string;
  verified: boolean;
  updatedAt: string;
}

export type SOSUrgency = 'critical' | 'high' | 'medium';

export interface SOSRequest {
  id: string;
  fullName: string;
  phone: string;
  lat: number;
  lng: number;
  address: string;
  province: string;
  urgency: SOSUrgency;
  peopleCount: number;
  needs: string[];
  description: string;
  createdAt: string;
  status: 'pending' | 'in_progress' | 'rescued';
}

export interface SupportPledge {
  id: string;
  pointId: string;
  donorName: string;
  phone: string;
  pledgeType: 'supplies' | 'food' | 'volunteer' | 'financial';
  description: string;
  quantity: string;
  createdAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  area: string;
  description: string;
  category: 'national' | 'medical' | 'rescue' | 'charity';
}
