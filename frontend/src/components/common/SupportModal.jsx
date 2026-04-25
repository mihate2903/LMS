import React, { useState } from 'react';
import api from '../../api/axiosConfig';

const SupportModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('faq');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  if (!isOpen) return null;

  const faqs = [
    { q: "Làm sao để đổi mật khẩu?", a: "Bạn vào mục Hồ sơ cá nhân -> Bảo mật & Mật khẩu để thực hiện đổi mật khẩu nhé." },
    { q: "Tôi có thể học trên điện thoại không?", a: "Hoàn toàn được! Website được tối ưu cho cả máy tính và thiết bị di động." },
    { q: "Làm thế nào để đăng ký khóa học?", a: "Bạn chọn khóa học yêu thích, nhấn 'Đăng ký học ngay' và làm theo hướng dẫn thanh toán." },
    { q: "Tôi có được cấp chứng chỉ không?", a: "Có, sau khi hoàn thành 100% bài học và bài kiểm tra (nếu có), hệ thống sẽ cấp chứng chỉ điện tử cho bạn." }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/support/request', formData);
      setSubmitted(true);
      setFormData({ title: '', description: '' });
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2500);
    } catch (err) {
      console.error("Lỗi gửi yêu cầu hỗ trợ:", err);
      alert("Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Centering Container */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        {/* Modal Content */}
        <div className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh]">
          
          {/* Header */}
          <div className="bg-primary-600 p-6 sm:p-8 text-white relative flex-shrink-0">
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-2xl sm:text-3xl font-black">Trung tâm Hỗ trợ</h2>
            <p className="text-primary-100 text-sm mt-1">Chúng tôi luôn sẵn sàng đồng hành cùng bạn.</p>
          </div>

          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
            {['faq', 'contact', 'info'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-xs sm:text-sm font-black uppercase tracking-widest transition-all border-b-2 ${
                  activeTab === tab 
                    ? 'text-primary-600 border-primary-600 bg-white' 
                    : 'text-slate-400 border-transparent hover:text-slate-600'
                }`}
              >
                {tab === 'faq' ? 'Hỏi đáp' : tab === 'contact' ? 'Gửi yêu cầu' : 'Liên hệ'}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar">
            
            {activeTab === 'faq' && (
              <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                {faqs.map((item, index) => (
                  <div key={index} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary-200 transition-colors">
                    <h4 className="font-bold text-slate-900 mb-2 flex items-start gap-2">
                      <span className="text-primary-600 font-black">Q:</span> {item.q}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed pl-6">
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="animate-in slide-in-from-bottom-2 duration-300">
                {submitted ? (
                  <div className="py-12 text-center">
                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">Đã gửi yêu cầu!</h3>
                    <p className="text-slate-500 mt-2">Chúng tôi đã nhận được thông tin và sẽ phản hồi sớm.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tiêu đề vấn đề</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all bg-slate-50 focus:bg-white" 
                        placeholder="Ví dụ: Lỗi không xem được video..." 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Mô tả chi tiết</label>
                      <textarea 
                        required 
                        rows="5" 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full border border-slate-200 rounded-xl px-4 py-4 text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none bg-slate-50 focus:bg-white" 
                        placeholder="Hãy mô tả chi tiết vấn đề bạn đang gặp phải để chúng tôi hỗ trợ tốt nhất..."
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-4 rounded-xl text-sm transition-all shadow-xl shadow-primary-200 disabled:opacity-50 active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Đang gửi yêu cầu...
                        </span>
                      ) : 'Gửi yêu cầu hỗ trợ'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'info' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-3 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Hotline 24/7</p>
                      <p className="text-lg font-black text-slate-900 underline decoration-blue-200 underline-offset-4">1900 8888</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Email hỗ trợ</p>
                      <p className="text-lg font-black text-slate-900 underline decoration-emerald-200 underline-offset-4">support@minilms.com</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="w-14 h-14 bg-white shadow-sm border border-slate-100 text-primary-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trụ sở chính</p>
                    <p className="text-sm font-bold text-slate-900 leading-snug">Số 123, Đường Công Nghệ, Khu đô thị Tri Thức, Hà Nội</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="p-5 bg-slate-50 border-t border-slate-100 text-center flex-shrink-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
              Thời gian phản hồi dự kiến: <span className="text-primary-600">Trong vòng 2 giờ làm việc</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
