import React, { useState } from 'react';
import { SOSRequest, SOSUrgency } from '../types.ts';
import { X, AlertCircle, MapPin, Phone, Users, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSOS: (newSOS: Omit<SOSRequest, 'id' | 'createdAt' | 'status'>) => void;
  userLocation: { lat: number; lng: number } | null;
  onRequestPickLocation: () => void;
  pickedLocation: { lat: number; lng: number } | null;
}

const COMMON_NEEDS = [
  'Xuồng máy di tản khẩn',
  'Nước uống đóng chai',
  'Lương thực / Bánh mì khô',
  'Thuốc hạ sốt & tiêu hóa',
  'Bình oxy / Y tế',
  'Sữa bột & Bỉm trẻ em',
  'Áo phao & Đèn pin',
  'Chăn ấm & Quần áo',
];

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  onSubmitSOS,
  userLocation,
  onRequestPickLocation,
  pickedLocation,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('Quảng Bình');
  const [address, setAddress] = useState('');
  const [urgency, setUrgency] = useState<SOSUrgency>('critical');
  const [peopleCount, setPeopleCount] = useState<number>(3);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(['Nước uống đóng chai', 'Lương thực / Bánh mì khô']);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleNeed = (need: string) => {
    if (selectedNeeds.includes(need)) {
      setSelectedNeeds(selectedNeeds.filter((n) => n !== need));
    } else {
      setSelectedNeeds([...selectedNeeds, need]);
    }
  };

  const currentLat = pickedLocation?.lat ?? userLocation?.lat ?? 17.2185;
  const currentLng = pickedLocation?.lng ?? userLocation?.lng ?? 106.7792;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !address.trim() || !description.trim()) {
      alert('Vui lòng điền đầy đủ họ tên, số điện thoại, địa chỉ và mô tả tình hình.');
      return;
    }

    onSubmitSOS({
      fullName: fullName.trim(),
      phone: phone.trim(),
      lat: currentLat,
      lng: currentLng,
      address: address.trim(),
      province,
      urgency,
      peopleCount: Number(peopleCount) || 1,
      needs: selectedNeeds,
      description: description.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-red-200 overflow-hidden my-6">
        {/* Header Alert */}
        <div className="bg-red-600 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Gửi Yêu Cầu Cứu Trợ Khẩn Cấp (SOS)</h3>
              <p className="text-xs text-red-100">Thông tin sẽ xuất hiện trực tiếp trên bản đồ điều phối cứu hộ</p>
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
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Yêu cầu cứu trợ đã được phát đi!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              Điểm SOS của bạn đã được đánh dấu đỏ trên bản đồ. Các đội cứu hộ và trạm hỗ trợ xung quanh sẽ nhận được thông báo để tiếp cận. Xin hãy giữ máy điện thoại thông suốt!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {/* Urgency Selector */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">
                Mức độ khẩn cấp <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setUrgency('critical')}
                  className={`p-2.5 rounded-lg border text-center transition-colors ${
                    urgency === 'critical'
                      ? 'border-red-600 bg-red-50 text-red-700 font-bold shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs">🔴 Nguy cấp</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Nước dâng cao / Đe dọa tính mạng</div>
                </button>

                <button
                  type="button"
                  onClick={() => setUrgency('high')}
                  className={`p-2.5 rounded-lg border text-center transition-colors ${
                    urgency === 'high'
                      ? 'border-amber-500 bg-amber-50 text-amber-700 font-bold shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs">🟠 Rất cần</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Cạn lương thực / Cần thuốc men</div>
                </button>

                <button
                  type="button"
                  onClick={() => setUrgency('medium')}
                  className={`p-2.5 rounded-lg border text-center transition-colors ${
                    urgency === 'medium'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs">🔵 Cần hỗ trợ</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Khó khăn sinh hoạt / Thiếu đồ dùng</div>
                </button>
              </div>
            </div>

            {/* Contact Person & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Họ tên người cần hỗ trợ / báo tin <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn Hưng"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Số điện thoại khẩn cấp <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="0912 xxx xxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Province & People Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Khu vực / Tỉnh thành <span className="text-red-500">*</span>
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:border-red-500"
                >
                  <option value="Quảng Bình">Quảng Bình</option>
                  <option value="Yên Bái">Yên Bái</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Thừa Thiên Huế">Thừa Thiên Huế</option>
                  <option value="Lào Cai">Lào Cai</option>
                  <option value="Nghệ An">Nghệ An</option>
                  <option value="Hà Tĩnh">Hà Tĩnh</option>
                  <option value="Tỉnh khác">Tỉnh khác</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Số lượng người tại điểm cần hỗ trợ
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Địa chỉ chi tiết / Điểm mốc nhận diện <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <textarea
                  rows={2}
                  required
                  placeholder="Ví dụ: Thôn Mỹ Lộc, Xã An Thủy, cách cổng trường tiểu học 100m về phía đông..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Map Coordinate Picker Helper */}
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-800">Tọa độ ghim trên bản đồ:</div>
                <div className="font-mono text-slate-500 text-[11px]">
                  {currentLat.toFixed(4)}, {currentLng.toFixed(4)}
                  {pickedLocation ? ' (Đã chọn trên bản đồ)' : ' (Mặc định / GPS)'}
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
                Ghim trên bản đồ
              </button>
            </div>

            {/* Needs Chips */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">
                Các nhu yếu phẩm / Hỗ trợ đang cần gấp:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_NEEDS.map((item) => {
                  const active = selectedNeeds.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => toggleNeed(item)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                        active
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      {active ? '✓ ' : '+ '} {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Mô tả chi tiết hoàn cảnh & Tình trạng hiện tại <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder="Nước ngập cao bao nhiêu mét, có người già, sản phụ hay em bé không, điện thoại còn bao nhiêu % pin..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <AlertCircle className="w-4 h-4" />
                <span>Gửi phát tin SOS ngay</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
