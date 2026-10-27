import React, { useState } from 'react';
import { SupportPoint, SupportCategory, SupportStatus } from '../types.ts';
import { CATEGORY_LABELS } from '../utils/geo.ts';
import { X, PlusCircle, MapPin, Phone, Clock, User, CheckCircle2 } from 'lucide-react';

interface AddPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPoint: (newPoint: SupportPoint) => void;
  userLocation: { lat: number; lng: number } | null;
  onRequestPickLocation: () => void;
  pickedLocation: { lat: number; lng: number } | null;
}

export const AddPointModal: React.FC<AddPointModalProps> = ({
  isOpen,
  onClose,
  onAddPoint,
  userLocation,
  onRequestPickLocation,
  pickedLocation,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SupportCategory>('food');
  const [province, setProvince] = useState('Hà Nội');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [operatingHours, setOperatingHours] = useState('08:00 - 18:00');
  const [availableItemsText, setAvailableItemsText] = useState('Cơm trưa miễn phí, Nước lọc tinh khiết');
  const [urgentNeedsText, setUrgentNeedsText] = useState('Tình nguyện viên hỗ trợ đóng gói');
  const [maxCapacity, setMaxCapacity] = useState('500');
  const [capacityUnit, setCapacityUnit] = useState('suất cơm');
  const [notes, setNotes] = useState('Điểm phục vụ miễn phí không thu bất kỳ chi phí nào.');
  const [status, setStatus] = useState<SupportStatus>('active');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentLat = pickedLocation?.lat ?? userLocation?.lat ?? 21.0285;
  const currentLng = pickedLocation?.lng ?? userLocation?.lng ?? 105.8542;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !address.trim() || !phone.trim() || !contactPerson.trim()) {
      alert('Vui lòng điền đầy đủ tên điểm hỗ trợ, địa chỉ, người phụ trách và số điện thoại.');
      return;
    }

    const availableItems = availableItemsText
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    const urgentNeeds = urgentNeedsText
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    const generatedId = `H02-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const newPoint: SupportPoint = {
      id: generatedId,
      title: title.trim(),
      category,
      status,
      lat: currentLat,
      lng: currentLng,
      address: address.trim(),
      province,
      district: district.trim() || 'Trung tâm',
      phone: phone.trim(),
      contactPerson: contactPerson.trim(),
      operatingHours: operatingHours.trim(),
      availableItems: availableItems.length > 0 ? availableItems : ['Nhu yếu phẩm hỗ trợ'],
      urgentNeeds,
      capacity: {
        current: Math.round(Number(maxCapacity) * 0.7) || 200,
        max: Number(maxCapacity) || 300,
        unit: capacityUnit || 'phần',
      },
      notes: notes.trim(),
      verified: true,
      updatedAt: 'Vừa xong',
    };

    onAddPoint(newPoint);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base leading-tight">Đăng Ký Điểm Hỗ Trợ Cộng Đồng Mới</h3>
              <p className="text-xs text-slate-300">Dành cho cá nhân, bếp thiện nguyện và tổ chức cứu trợ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Điểm hỗ trợ đã được tạo thành công!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Trạm của bạn đã được xuất hiện ngay trên bản đồ số HoTroMap để người dân có thể tra cứu và tiếp cận nguồn hỗ trợ.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto custom-scrollbar">
            {/* Title */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Tên điểm hỗ trợ / Tổ chức <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Bếp Cơm 0 Đồng Thiện Tâm - Đống Đa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Loại hình hỗ trợ <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SupportCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                >
                  {Object.entries(CATEGORY_LABELS).map(([catKey, meta]) => (
                    <option key={catKey} value={catKey}>
                      {meta.icon} {meta.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Trạng thái hoạt động
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as SupportStatus)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                >
                  <option value="active">Đang hoạt động tốt</option>
                  <option value="urgent">Cần chi viện gấp nguồn lực</option>
                  <option value="limited">Nguồn lực có hạn / Sắp hết</option>
                </select>
              </div>
            </div>

            {/* Province & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Tỉnh / Thành phố <span className="text-red-500">*</span>
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-emerald-600"
                >
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Quảng Bình">Quảng Bình</option>
                  <option value="Yên Bái">Yên Bái</option>
                  <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Lào Cai">Lào Cai</option>
                  <option value="Nghệ An">Nghệ An</option>
                  <option value="Hà Tĩnh">Hà Tĩnh</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Quận / Huyện
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Quận Cầu Giấy"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Địa chỉ chi tiết <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Số nhà, tên ngõ, đường, phường/xã..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Coordinates / Map Pinning */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-800">Tọa độ trên bản đồ:</div>
                <div className="font-mono text-slate-500 text-[11px]">
                  {currentLat.toFixed(4)}, {currentLng.toFixed(4)}
                  {pickedLocation ? ' (Đã nhấp ghim trên bản đồ)' : ' (Mặc định)'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequestPickLocation();
                }}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
              >
                Nhấp chọn trên bản đồ
              </button>
            </div>

            {/* Contact Person & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Người điều phối / Phụ trách <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Chị Mai Anh (Trưởng bếp)"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Số điện thoại hotline <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="0912 345 678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Operating Hours & Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Thời gian mở cửa phục vụ
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="10:00 - 13:00 hàng ngày"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Khả năng cung ứng tối đa
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="500"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    className="w-1/2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                  <input
                    type="text"
                    placeholder="suất cơm / phần quà"
                    value={capacityUnit}
                    onChange={(e) => setCapacityUnit(e.target.value)}
                    className="w-1/2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Available Items */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Các mặt hàng / Dịch vụ sẵn có (ngăn cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                placeholder="500 suất cơm trưa, Nước đóng chai, Sữa em bé"
                value={availableItemsText}
                onChange={(e) => setAvailableItemsText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Urgent Needs */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Nhu cầu cần tiếp viện thêm (ngăn cách bằng dấu phẩy)
              </label>
              <input
                type="text"
                placeholder="Tình nguyện viên chia cơm, Gạo tẻ thơm, Hộp đựng"
                value={urgentNeedsText}
                onChange={(e) => setUrgentNeedsText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Ghi chú thêm cho người dân
              </label>
              <textarea
                rows={2}
                placeholder="Chỉ dẫn đường đi, điều kiện tiếp nhận, lưu ý khi đến nhận..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Submit */}
            <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Hoàn tất đăng ký</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
