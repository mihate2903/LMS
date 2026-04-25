import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [popup, setPopup] = useState({ isVisible: false, type: '', message: '' });

  useEffect(() => {
    // Luôn bắt Token ngay vòng gửi xe
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        setCourse(response.data);
      } catch (err) {
        console.error("Lỗi tải thông tin thanh toán:", err);
        setError("Không thể tải thông tin khóa học. Có thể khóa học không tồn tại.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  const handleConfirmPayment = async () => {
    setSubmitLoading(true);

    try {
      // Bắn API gọi Đơn ghi danh (Đã tháo cản validation name, phone từ Option 1)
      await api.post('/enrollments', { courseId: parseInt(id) });
      
      setPopup({ 
        isVisible: true, 
        type: 'success', 
        message: 'Hoàn tất thủ tục! Đơn đăng ký của bạn đang được Chờ Duyệt. Hệ thống sẽ tự động chuyển trang...' 
      });

      // Tự động đá về Khóa học của tôi sau 2 giây
      setTimeout(() => {
        navigate('/my-courses');
      }, 2500);

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        setPopup({ isVisible: true, type: 'error', message: err.response.data.error });
      } else {
        setPopup({ isVisible: true, type: 'error', message: 'Có lỗi xảy ra. Hãy thử lại hoặc liên hệ Admin.' });
      }
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-primary-500"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center p-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 max-w-lg text-center font-medium shadow-sm">
          {error || "Lỗi không xác định."}
          <div className="mt-4">
            <Link to="/" className="text-sm font-bold underline hover:text-red-800">Về Trang chủ</Link>
          </div>
        </div>
      </div>
    );
  }

  const defaultImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Nút quay lại */}
        <Link to={`/course/${id}`} className="inline-flex items-center text-slate-500 hover:text-primary-600 font-medium mb-6 transition-colors">
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại khóa học
        </Link>
        
        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-8">Thanh toán an toàn</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* CỘT TRÁI: TÓM TẮT ĐƠN HÀNG */}
          <div className="w-full lg:w-5/12 order-2 lg:order-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Tóm tắt Hóa đơn</h2>
              
              <div className="flex flex-col gap-4">
                <img 
                  src={course.thumbnailUrl || defaultImage} 
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-snug">{course.title}</h3>
                  {course.categoryName && <p className="text-sm text-slate-500 mt-1">{course.categoryName}</p>}
                </div>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-6 space-y-4">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Giá gốc</span>
                  <span className="font-medium line-through">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price * 1.5)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Khuyến mãi</span>
                  <span className="text-green-600 font-medium">-33%</span>
                </div>
                
                <div className="flex justify-between items-center text-2xl font-black text-slate-900 pt-4 border-t border-slate-100">
                  <span>Tổng tiền</span>
                  <span className="text-primary-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                  </span>
                </div>
              </div>

              <div className="mt-8 bg-slate-50 rounded-xl p-4 flex items-start text-sm text-slate-600">
                <svg className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p>Khóa học được cấp quyền truy cập trọn đời sau khi Giao dịch hoàn tất.</p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: CỔNG CHUYỂN KHOẢN */}
          <div className="w-full lg:w-7/12 order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-primary-100 relative overflow-hidden">
              {/* Trang trí nhạt */}
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary-50 rounded-full blur-2xl"></div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2 relative z-10">Phương thức chuyển khoản</h2>
              <p className="text-slate-500 mb-8 relative z-10">Vui lòng sử dụng tính năng Quét mã tĩnh hoặc Copy thông tin bên dưới để tiến hành nạp học phí.</p>
              
              <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 relative z-10">
                
                {/* ẢNH MÃ QR BÁN CHÉO (DÙNG ẢNH TẠM CỦA VIETQR) */}
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex-shrink-0">
                  <img 
                    src={`https://img.vietqr.io/image/970407-13371337-compact.jpg?amount=${course.price}&addInfo=THANHTOAN${course.id}&accountName=QUY LOP`} 
                    alt="Mã QR Chuyển Khoản"
                    className="w-48 h-48 object-contain"
                  />
                  <p className="text-center text-xs text-slate-400 mt-2 font-medium uppercase tracking-widest">Powered by VietQR</p>
                </div>

                {/* THÔNG TIN BẰNG CHỮ CHO MOBILE / COPY NHANH */}
                <div className="flex-1 w-full space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Chủ Tài Khoản</p>
                    <p className="text-lg font-black text-slate-900">BỘ TRƯỞNG BỘ GD</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Số Tài Khoản</p>
                    <div className="flex justify-between items-center bg-white border border-slate-200 px-3 py-2 rounded-lg">
                      <p className="text-xl font-bold text-primary-700 font-mono tracking-widest">1337 1337 9999</p>
                      <button className="text-primary-500 hover:text-primary-700 bg-primary-50 p-1.5 rounded-md transition-colors" title="Copy">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Ngân hàng</p>
                    <p className="font-semibold text-slate-800">Techcombank - TMCP Kỹ Thương Vn</p>
                  </div>
                  <div>
                    <p className="text-xs text-red-500 uppercase font-bold tracking-wider mb-1">Nội dung bắt buộc</p>
                    <div className="bg-red-50 text-red-700 border border-red-100 font-mono font-bold px-3 py-2 rounded-lg flex items-center justify-between">
                      <span>THANH TOAN {course.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* NÓI RÕ STATUS GHI DANH PENDING */}
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl mb-8 flex gap-3">
                <svg className="w-6 h-6 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-orange-800 leading-relaxed">
                  <strong>Chú ý:</strong> Sau khi thanh toán và nhấn xác nhận, hóa đơn của bạn sẽ ở trạng thái <strong className="text-orange-900 border-b border-orange-900 border-dotted">Đang chờ duyệt</strong>. Admin sẽ đối chiếu sao kê và mở quyền truy cập trong tối đa 10 phút.
                </p>
              </div>

              <div className="flex gap-4 z-10 relative">
                <Link 
                  to={`/course/${id}`}
                  className="flex-1 text-center py-4 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                >
                  Hủy Giao Dịch
                </Link>
                <button
                  onClick={handleConfirmPayment}
                  disabled={submitLoading}
                  className="flex-[2] bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white shadow-xl shadow-primary-600/20 font-bold py-4 rounded-xl text-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  {submitLoading ? "Đang xử lý..." : "Tôi Đã Chuyển Khoản"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Custom Notification Popup (Dùng chung bộ Source với CourseDetailPage) */}
      {popup.isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 md:p-8 text-center animate-in fade-in zoom-in duration-300">
            {popup.type === 'success' ? (
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-50 mb-6 border-4 border-green-100">
                <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-50 mb-6 border-4 border-red-100">
                <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            <h3 className="text-2xl font-black text-slate-900 mb-3">
              {popup.type === 'success' ? 'Đã Nhận Xong!' : 'Oops! Có lỗi rồi.'}
            </h3>
            <p className="text-slate-600 mb-8 font-medium leading-relaxed">{popup.message}</p>
            {popup.type === 'error' && (
              <button 
                onClick={() => setPopup({ ...popup, isVisible: false })}
                className="w-full bg-dark hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95"
              >
                Đóng
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
