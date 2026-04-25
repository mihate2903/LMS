import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import api from '../api/axiosConfig';
import AdminLayout from '../components/layout/AdminLayout';

// ── Status Badge ──
const StatusBadge = ({ status }) => {
  const map = {
    pending:  { label: 'Chờ duyệt', cls: 'bg-amber-100 text-amber-700' },
    approved: { label: 'Đã duyệt',  cls: 'bg-emerald-100 text-emerald-700' },
    rejected: { label: 'Từ chối',   cls: 'bg-red-100 text-red-600' },
  };
  const s = map[status] || { label: status, cls: 'bg-slate-100 text-slate-600' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider ${s.cls}`}>
      {s.label}
    </span>
  );
};

// ── Chi tiết Hóa đơn Modal ──
const EnrollmentDetailModal = ({ enrollment, onClose, onUpdateStatus, updating }) => {
  if (!enrollment) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-fade-in relative z-10 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-base font-black text-slate-900">Chi tiết Hóa đơn #{enrollment.enrollmentId}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           {/* Course Info */}
           <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <div className="w-24 h-16 shrink-0 bg-slate-200 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                {enrollment.course?.thumbnailUrl ? (
                  <img src={enrollment.course.thumbnailUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
             </div>
             <div className="flex flex-col justify-center">
                <p className="text-base font-bold text-slate-900 leading-tight">{enrollment.course?.title || 'Khóa học đã bị xóa'}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Giá bán: <span className="font-black text-primary-600 ml-1">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(enrollment.course?.price || 0)}</span>
                </p>
             </div>
           </div>

           {/* User Info */}
           <div>
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Thông tin người mua</h3>
             <div className="bg-white border border-slate-100 rounded-2xl divide-y divide-slate-50 shadow-sm">
               <div className="p-4 flex justify-between items-center"><span className="text-xs font-bold text-slate-400 uppercase">Họ tên</span><span className="text-sm font-bold text-slate-900">{enrollment.contactName}</span></div>
               <div className="p-4 flex justify-between items-center"><span className="text-xs font-bold text-slate-400 uppercase">Email</span><span className="text-sm font-bold text-slate-900">{enrollment.contactEmail}</span></div>
               <div className="p-4 flex justify-between items-center"><span className="text-xs font-bold text-slate-400 uppercase">Số điện thoại</span><span className="text-sm font-bold text-slate-900">{enrollment.contactPhone || '—'}</span></div>
               <div className="p-4 flex justify-between items-center"><span className="text-xs font-bold text-slate-400 uppercase">Thời gian</span><span className="text-sm font-bold text-slate-900">{new Date(enrollment.createdAt).toLocaleString('vi-VN')}</span></div>
             </div>
           </div>
           
           {/* Status */}
           <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái đơn</span>
              <StatusBadge status={enrollment.status} />
           </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
          {enrollment.status === 'pending' ? (
             <>
                <button
                  disabled={updating}
                  onClick={() => onUpdateStatus(enrollment.enrollmentId, 'rejected')}
                  className="px-6 py-2.5 bg-white text-red-500 border border-red-200 rounded-xl font-bold text-sm shadow-sm hover:bg-red-50 transition-all active:scale-95 disabled:opacity-50"
                >
                  Từ chối
                </button>
                <button
                  disabled={updating}
                  onClick={() => onUpdateStatus(enrollment.enrollmentId, 'approved')}
                  className="px-8 py-2.5 bg-emerald-500 text-white rounded-xl font-black text-sm shadow-md hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {updating ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  )}
                  Phê duyệt
                </button>
             </>
          ) : (
             <button onClick={onClose} className="px-8 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 shadow-sm transition-all active:scale-95">Đóng</button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!role || !role.toLowerCase().includes('admin')) { navigate('/'); return; }
    fetchEnrollments();
  }, [filter, navigate]);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' ? '/admin/enrollments' : `/admin/enrollments?status=${filter}`;
      const response = await api.get(url);
      setEnrollments(response.data);
    } catch {
      setError('Không thể tải danh sách hóa đơn. Kiểm tra lại quyền Admin hoặc kết nối mạng.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await api.put(`/admin/enrollments/${id}/status`, { status: newStatus });
      fetchEnrollments();
      if (selectedEnrollment && selectedEnrollment.enrollmentId === id) {
        setSelectedEnrollment({ ...selectedEnrollment, status: newStatus });
      }
    } catch {
      alert('Lỗi khi cập nhật trạng thái!');
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingCount = enrollments.filter(e => e.status === 'pending').length;

  if (error) return (
    <div className="p-8 text-center text-red-600 font-bold bg-slate-50 min-h-screen">{error}</div>
  );

  return (
    <AdminLayout>

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Trạm Kiểm Soát Hóa Đơn</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {pendingCount > 0
                ? <span className="text-amber-600 font-semibold">{pendingCount} đơn đang chờ xử lý</span>
                : 'Tất cả đơn hàng đã được xử lý'}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm gap-0.5">
            {[
              { key: 'all',      label: 'Tất cả' },
              { key: 'pending',  label: 'Chờ duyệt' },
              { key: 'approved', label: 'Đã duyệt' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  filter === key
                    ? key === 'pending'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : key === 'approved'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã HĐ</th>
                  <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Học viên</th>
                  <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Khóa học</th>
                  <th className="px-5 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày đăng ký</th>
                  <th className="px-5 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <div className="animate-spin w-8 h-8 border-4 border-slate-200 border-t-primary-500 rounded-full"></div>
                        <span className="text-sm font-bold">Đang tải dữ liệu...</span>
                      </div>
                    </td>
                  </tr>
                ) : enrollments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-5 py-16 text-center text-slate-400 text-sm font-bold">
                      Không có hóa đơn nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  enrollments.map((e) => (
                    <tr 
                      key={e.enrollmentId} 
                      onClick={() => setSelectedEnrollment(e)}
                      className="hover:bg-primary-50/50 cursor-pointer transition-colors group"
                    >
                      {/* Mã HĐ */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-500 text-xs bg-slate-100 px-2 py-1 rounded group-hover:bg-white transition-colors">
                          #{e.enrollmentId}
                        </span>
                      </td>

                      {/* Học viên */}
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-800 text-sm leading-tight group-hover:text-primary-600 transition-colors">{e.contactName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{e.contactEmail}</p>
                      </td>

                      {/* Khóa học */}
                      <td className="px-5 py-4 max-w-[220px]">
                        {e.course ? (
                          <>
                            <p className="font-bold text-slate-800 text-sm truncate" title={e.course.title}>{e.course.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5 font-bold">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(e.course.price)}
                            </p>
                          </>
                        ) : <span className="text-slate-400 italic text-xs font-bold">Khóa học đã bị xóa</span>}
                      </td>

                      {/* Ngày */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs font-bold text-slate-500">
                        {new Date(e.createdAt).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' })}
                        <br />
                        <span className="text-slate-400 font-medium">{new Date(e.createdAt).toLocaleTimeString('vi-VN', { hour:'2-digit', minute:'2-digit' })}</span>
                      </td>

                      {/* Trạng thái */}
                      <td className="px-5 py-4 text-center">
                        <StatusBadge status={e.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {!loading && enrollments.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400 bg-slate-50/50 font-bold">
              Hiển thị {enrollments.length} kết quả
            </div>
          )}
        </div>

        {/* Modal Chi tiết Hóa đơn */}
        <EnrollmentDetailModal 
          enrollment={selectedEnrollment} 
          onClose={() => setSelectedEnrollment(null)} 
          onUpdateStatus={handleUpdateStatus} 
          updating={updatingId === selectedEnrollment?.enrollmentId} 
        />

    </AdminLayout>
  );
};

export default AdminDashboardPage;
