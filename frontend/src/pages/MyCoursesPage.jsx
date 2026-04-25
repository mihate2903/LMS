import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const MyCoursesPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchMyCourses = async () => {
      try {
        const response = await api.get('/enrollments/my-courses');
        setEnrollments(response.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách khóa học của tôi:", err);
        setError("Không thể tải danh sách khóa học. Vui lòng kiểm tra lại kết nối.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center p-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center font-medium border border-red-100 max-w-lg w-full">
          {error}
        </div>
      </div>
    );
  }

  const defaultImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Khóa học của tôi</h1>
          <p className="text-slate-500 mt-2">Nơi lưu giữ hành trình tri thức của bạn.</p>
        </div>

        {enrollments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 mt-8">
            <div className="mx-auto w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Hành trang trống rỗng</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Bạn chưa ghi danh vào bất kỳ khóa học nào. Hãy khám phá kho tàng tri thức của chúng tôi và bắt đầu học ngay hôm nay!
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-md hover:shadow-lg"
            >
              Khám phá Khóa học
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {enrollments.map((enrollment) => {
              const isApproved = enrollment.status === "approved";
              const { course } = enrollment;
              
              if (!course) return null; // Defensive check

              return (
                <div key={enrollment.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  
                  {/* Thumbnail (Left side) */}
                  <div className="w-full sm:w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 relative group">
                    <img 
                      src={course.thumbnailUrl || defaultImage} 
                      alt={course.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Status Badge overlay on Mobile */}
                    <div className="absolute top-2 left-2 sm:hidden block">
                      {isApproved ? (
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg backdrop-blur-md shadow-sm">
                          Đã Duyệt
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-lg backdrop-blur-md shadow-sm">
                          Đang chờ duyệt
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info (Middle) */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Mã Hóa đơn: #{enrollment.id} • Đăng ký ngày: {new Date(enrollment.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                    
                    {/* Status Badge on Desktop */}
                    <div className="mt-4 hidden sm:block">
                      {isApproved ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                          Hồ sơ hợp lệ - Đã duyệt
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                          <span className="w-2 h-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
                          Đang chờ Admin xử lý
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions (Right Side) */}
                  <div className="w-full sm:w-auto flex-shrink-0 mt-4 sm:mt-0">
                    {isApproved ? (
                      <Link 
                        to={`/study/${course.id}`}
                        className="w-full sm:w-40 flex justify-center items-center bg-dark hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm active:scale-95"
                      >
                        Vào học ngay
                      </Link>
                    ) : (
                      <button 
                        disabled
                        className="w-full sm:w-40 flex justify-center items-center bg-slate-100 text-slate-400 font-bold py-3 px-6 rounded-xl cursor-not-allowed border border-slate-200"
                      >
                        Đang chờ duyệt
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;
