import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import AdminLayout from '../components/layout/AdminLayout';

const AdminSupportPage = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      // Ép trình duyệt gọi dữ liệu mới nhất, không lấy cache
      const timestamp = new Date().getTime();
      console.log(`Đang gọi API: /support/all?t=${timestamp}`);
      const res = await api.get(`/support/all?t=${timestamp}`);
      
      console.log("KẾT QUẢ TỪ SERVER:", res.data);
      
      if (Array.isArray(res.data)) {
        setMessages(res.data);
        if (res.data.length > 0 && !selectedMessage) {
          setSelectedMessage(res.data[0]);
        }
      } else {
        console.error("Dữ liệu trả về không phải là mảng:", res.data);
      }
    } catch (err) {
      console.error("LỖI GỌI API HỖ TRỢ:", err);
      if (err.response) {
        console.error("Chi tiết lỗi từ Server:", err.response.status, err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await api.put(`/support/${id}/resolve`);
      fetchMessages();
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: 'RESOLVED' });
      }
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
    }
  };

  const handleClearNotifications = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sạch TOÀN BỘ thông báo trong hệ thống không?")) {
      try {
        await api.delete('/support/clear-notifications');
        alert("Đã xóa sạch thông báo!");
        window.location.reload();
      } catch (err) {
        console.error("Lỗi xóa thông báo:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-primary-500"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col h-full">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Quản lý Hỗ trợ</h1>
            <p className="text-slate-500 mt-1">Xem và xử lý các yêu cầu hỗ trợ từ người dùng.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={fetchMessages}
              className="bg-white text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-slate-200 flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Làm mới
            </button>
            <button 
              onClick={handleClearNotifications}
              className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-red-100"
            >
              Xóa sạch toàn bộ thông báo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
          {/* List Section */}
          <div className="lg:col-span-4 space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-full">
            {messages.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 text-center italic text-slate-400">
                Chưa có yêu cầu nào.
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMessage(m)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    selectedMessage?.id === m.id
                      ? 'bg-primary-600 border-primary-600 shadow-lg shadow-primary-100 text-white'
                      : 'bg-white border-slate-100 text-slate-600 hover:border-primary-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      m.status === 'PENDING' 
                        ? (selectedMessage?.id === m.id ? 'bg-white/20 text-white' : 'bg-yellow-100 text-yellow-700')
                        : (selectedMessage?.id === m.id ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700')
                    }`}>
                      {m.status === 'PENDING' ? 'Chờ xử lý' : 'Đã xong'}
                    </span>
                    <span className={`text-[10px] ${selectedMessage?.id === m.id ? 'text-primary-100' : 'text-slate-400'}`}>
                      {new Date(m.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <h3 className="font-bold truncate text-sm mb-1">{m.title}</h3>
                  <p className={`text-xs truncate ${selectedMessage?.id === m.id ? 'text-primary-50' : 'text-slate-400'}`}>
                    Từ: {m.user?.name}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Detail Section */}
          <div className="lg:col-span-8 h-full min-h-0">
            {selectedMessage ? (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="p-8 border-b border-slate-50 flex justify-between items-start flex-shrink-0">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">{selectedMessage.title}</h2>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                        {selectedMessage.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{selectedMessage.user?.name}</p>
                        <p className="text-xs text-slate-500">{selectedMessage.user?.email} • {selectedMessage.user?.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Thời gian gửi</p>
                    <p className="text-sm font-bold text-slate-900">
                      {new Date(selectedMessage.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>

                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Nội dung yêu cầu</h4>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[200px]">
                    {selectedMessage.description}
                  </div>
                </div>

                <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500">Trạng thái:</span>
                    <span className={`text-sm font-black ${selectedMessage.status === 'PENDING' ? 'text-yellow-600' : 'text-emerald-600'}`}>
                      {selectedMessage.status === 'PENDING' ? 'ĐANG CHỜ XỬ LÝ' : 'ĐÃ GIẢI QUYẾT'}
                    </span>
                  </div>
                  {selectedMessage.status === 'PENDING' && (
                    <button
                      onClick={() => handleResolve(selectedMessage.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl text-sm transition-all shadow-lg shadow-emerald-100"
                    >
                      Đánh dấu đã giải quyết
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-12">
                <svg className="w-16 h-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="font-medium">Chọn một yêu cầu để xem chi tiết</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSupportPage;
