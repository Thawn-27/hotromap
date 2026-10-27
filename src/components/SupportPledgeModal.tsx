import React, { useState } from 'react';
import { SupportPoint, SupportPledge } from '../types.ts';
import { X, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface SupportPledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  point: SupportPoint | null;
  onSubmitPledge: (pledge: SupportPledge) => void;
}

export const SupportPledgeModal: React.FC<SupportPledgeModalProps> = ({
  isOpen,
  onClose,
  point,
  onSubmitPledge,
}) => {
  const [donorName, setDonorName] = useState('');
  const [phone, setPhone] = useState('');
  const [pledgeType, setPledgeType] = useState<SupportPledge['pledgeType']>('supplies');
  const [quantity, setQuantity] = useState('50 thùng nước đóng chai');
  const [description, setDescription] = useState('Tôi có thể mang qua trực tiếp điểm vào chiều nay.');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !point) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || !phone.trim() || !quantity.trim()) {
      alert('Vui lòng điền đầy đủ họ tên, số điện thoại và thông tin đóng góp.');
      return;
    }

    const newPledge: SupportPledge = {
      id: `PLG-${Date.now()}`,
      pointId: point.id,
      donorName: donorName.trim(),
      phone: phone.trim(),
      pledgeType,
      quantity: quantity.trim(),
      description: description.trim(),
      createdAt: 'Vừa xong',
    };

    onSubmitPledge(newPledge);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-emerald-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-emerald-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HeartHandshake className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-bold text-base leading-tight">Đăng Ký Tiếp Sức & Chi Viện</h3>
              <p className="text-xs text-emerald-100">Gửi nguồn lực đến: {point.title}</p>
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
            <h4 className="text-lg font-bold text-slate-900">Cảm ơn tấm lòng của bạn!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              Thông tin tiếp viện đã được gửi tới người điều phối trạm ({point.contactPerson} - {point.phone}). Trạm sẽ chủ động liên hệ bạn để đón nhận.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Urgent Needs Prompt */}
            {point.urgentNeeds.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-slate-700">
                <span className="font-semibold text-red-700 block mb-1">
                  Trạm này đang cần tiếp tế gấp:
                </span>
                <span className="text-red-900 text-[11px] leading-relaxed">
                  {point.urgentNeeds.join(' · ')}
                </span>
              </div>
            )}

            {/* Pledge Type */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">
                Hình thức đóng góp / Hỗ trợ <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPledgeType('supplies')}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    pledgeType === 'supplies'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  📦 Nhu yếu phẩm & Vật tư
                </button>
                <button
                  type="button"
                  onClick={() => setPledgeType('food')}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    pledgeType === 'food'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  🍲 Thực phẩm & Suất ăn
                </button>
                <button
                  type="button"
                  onClick={() => setPledgeType('volunteer')}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    pledgeType === 'volunteer'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  🤝 Tình nguyện viên trực tiếp
                </button>
                <button
                  type="button"
                  onClick={() => setPledgeType('financial')}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    pledgeType === 'financial'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  💳 Hỗ trợ kinh phí nấu cơm
                </button>
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Họ tên cá nhân / Nhóm thiện nguyện <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hoàng Tuấn"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="09xx xxx xxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Số lượng / Nội dung chi viện cụ thể <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: 10 bao gạo tẻ 25kg, 3 tình nguyện viên phụ bếp..."
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Ghi chú thời gian giao hoặc hỗ trợ
              </label>
              <textarea
                rows={2}
                placeholder="Ví dụ: Giao vào 14h chiều mai tại cổng chính hoặc gọi trước khi đến..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Actions */}
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
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-colors"
              >
                Xác nhận chi viện
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
