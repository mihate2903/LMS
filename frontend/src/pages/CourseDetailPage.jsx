import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollLoading, setEnrollLoading] = useState(false);

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

  const handleEnrollClick = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setEnrollLoading(true);

    try {
      await api.post('/enrollments', { courseId: parseInt(id) });
      alert("Đăng ký ghi danh thành công! Cùng bắt đầu học ngay nhé!");
      navigate('/my-courses');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert("Gặp sự cố khi ghi danh. Vui lòng thử lại sau.");
      }
    } finally {
      setEnrollLoading(false);
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

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Nội dung khóa học (Curriculum)</h2>

              {!course.lessons || course.lessons.length === 0 ? (
                <div className="text-slate-500 italic bg-slate-50 p-4 rounded-lg text-center">
                  Khóa học này hiện chưa có bài giảng nào.
                </div>
              ) : (
                <ul className="space-y-4">
                  {course.lessons.map((lesson, index) => (
                    <li key={lesson.id} className="flex items-start bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-primary-200 transition-colors">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold mr-4">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">{lesson.title}</h3>
                      </div>
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
                  disabled={enrollLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-xl text-lg transition-colors shadow-md hover:shadow-lg flex justify-center items-center disabled:opacity-50"
                >
                  {enrollLoading ? "Đang xử lý..." : "ĐĂNG KÝ"}
                </button>

                <p className="text-center text-sm text-slate-500 mt-4">
                  Mua ngay để nhận quyền truy cập vào khóa học.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
