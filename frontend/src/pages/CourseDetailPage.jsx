import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import ReviewSection from '../components/review/ReviewSection';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [popup, setPopup] = useState({ isVisible: false, type: '', message: '' });

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        setCourse(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết khóa học:", err);
        setError("Không thể tải thông tin khóa học hoặc khóa học không tồn tại.");
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [id]);

  const handleEnrollClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    // Chuyển hướng sang màn Checkout
    navigate(`/checkout/${id}`);
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
        <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center font-medium border border-red-100 max-w-lg w-full">
          {error || "Lỗi không xác định."}
        </div>
      </div>
    );
  }

  const defaultImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="min-h-screen bg-slate-50 py-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Mobile Header Title */}
        <div className="mb-8 block lg:hidden">
          <h1 className="text-3xl font-black text-slate-900 mb-2">{course.title}</h1>
          {course.categoryName && (
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full mb-4">
              {course.categoryName}
            </span>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1">
            <div className="hidden lg:block mb-8">
              <h1 className="text-4xl font-black text-slate-900 mb-3">{course.title}</h1>
              {course.categoryName && (
                <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full">
                  {course.categoryName}
                </span>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Về khóa học này</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {course.description || "Chưa có thông tin mô tả chi tiết cho khóa học này."}
              </p>
            </div>

            <ReviewSection courseId={id} />

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Nội dung khóa học (Curriculum)</h2>

              {!course.lessons || course.lessons.length === 0 ? (
                <div className="text-slate-500 italic bg-slate-50 p-4 rounded-lg text-center">
                  Khóa học này hiện chưa có bài giảng nào.
                </div>
              ) : (
                <ul className="space-y-4">
                  {course.lessons.map((lesson, index) => (
                  <li key={lesson.id} className="flex items-center bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-primary-200 transition-colors gap-4">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-primary-50 border border-primary-100 text-primary-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <h3 className="text-base font-semibold text-slate-800">{lesson.title}</h3>
                  </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden sticky top-24">
              <div className="relative aspect-video">
                <img
                  src={course.thumbnailUrl || defaultImage}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="text-3xl font-black text-slate-900 mb-6 text-center">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                </div>

                <button
                  onClick={handleEnrollClick}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors shadow-md hover:shadow-lg flex justify-center items-center"
                >
                  ĐĂNG KÝ
                </button>

                <p className="text-center text-sm text-slate-500 mt-4">
                  Mua ngay để nhận quyền truy cập vào khóa học.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Notification Popup */}
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
              {popup.type === 'success' ? 'Tuyệt Vời!' : 'Oops! Có lỗi rồi.'}
            </h3>
            <p className="text-slate-600 mb-8 font-medium leading-relaxed">{popup.message}</p>
            {popup.type === 'error' && (
              <button 
                onClick={() => setPopup({ ...popup, isVisible: false })}
                className="w-full bg-dark hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-95"
              >
                Đóng cửa sổ này
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;
