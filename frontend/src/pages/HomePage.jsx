import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import CourseCard from '../components/course/CourseCard';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi CORS hoặc không kết nối được Backend:", err);
        setError("Không thể tải danh sách khóa học. Vui lòng kiểm tra kết nối Backend.");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-dark text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Khám phá tri thức, <span className="text-primary-500">nâng tầm tương lai.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
            Khóa học chất lượng cao, thực chiến từ các chuyên gia hàng đầu. Bắt đầu hành trình học tập của bạn ngay hôm nay.
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Các Khóa Học Mới Nhất</h2>
          <span className="text-slate-500 text-sm font-medium">{courses.length} khóa học</span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-primary-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center font-medium border border-red-100">
            {error}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center text-slate-500 py-12">
            Chưa có khóa học nào được xuất bản.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
