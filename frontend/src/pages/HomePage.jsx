import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import CourseCard from '../components/course/CourseCard';

// SVG icons cho section headers
const IconTrending = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
const IconNew = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const IconRecommend = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const CourseCarousel = ({ title, icon, courses }) => {
  if (!courses || courses.length === 0) return null;
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-9 h-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
              {icon}
            </div>
          )}
          <h2 className="text-xl font-black text-slate-900">{title}</h2>
        </div>
      </div>
      <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-6 no-scrollbar">
        {courses.map(course => (
          <div key={course.id} className="snap-start shrink-0 w-[280px] sm:w-[320px] flex">
            <div className="w-full">
              <CourseCard course={course} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategoryId = searchParams.get('category');
  const currentSearch = searchParams.get('search');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const catsRes = await api.get('/categories');
        setCategories(catsRes.data);
      } catch (err) {
        console.error("Lỗi lấy danh mục:", err);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = {};
        if (currentCategoryId) params.categoryId = currentCategoryId;
        if (currentSearch) params.keyword = currentSearch;

        const response = await api.get('/courses', { params });
        setCourses(response.data);
      } catch (err) {
        console.error("Lỗi lấy khóa học:", err);
        setError("Không thể tải danh sách khóa học.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentCategoryId, currentSearch]);

  const handleCategoryClick = (id) => {
    if (id === 'all') {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('category');
      setSearchParams(newParams);
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('category', id);
      setSearchParams(newParams);
    }
  };

  const isDefaultView = !currentCategoryId && !currentSearch;

  // Fake sections for UI demonstration
  const trendingCourses = courses.length > 0 ? [...courses].sort(() => 0.5 - Math.random()).slice(0, 5) : [];
  const latestCourses = courses.length > 0 ? [...courses].reverse().slice(0, 5) : [];
  const recommendedCourses = courses.length > 0 ? [...courses].slice(0, 5) : [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-dark text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Khám phá tri thức, <span className="text-primary-500">nâng tầm tương lai.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
            Hàng trăm khóa học chất lượng cao, thực chiến từ các chuyên gia hàng đầu. Bắt đầu hành trình học tập của bạn ngay hôm nay.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Category Filter Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-3 overflow-x-auto pb-8 no-scrollbar">
          <button
            onClick={() => handleCategoryClick('all')}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm border ${
              !currentCategoryId 
                ? 'bg-primary-600 text-white border-primary-600' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-primary-400'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm border ${
                currentCategoryId === String(cat.id)
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-primary-400'
              }`}
            >
              {cat.categoryName}
            </button>
          ))}
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
            Không tìm thấy khóa học nào phù hợp.
          </div>
        ) : isDefaultView ? (
          // Default View: Show multiple Carousels
          <div className="space-y-4">
            <CourseCarousel title="Thịnh hành nhất" icon={<IconTrending />} courses={trendingCourses} />
            <CourseCarousel title="Khóa học Mới nhất" icon={<IconNew />} courses={latestCourses} />
            <CourseCarousel title="Có thể bạn sẽ thích" icon={<IconRecommend />} courses={recommendedCourses} />
          </div>
        ) : (
          // Filtered View: Show Grid
          <div>
            <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {currentSearch ? `Kết quả cho "${currentSearch}"` : 'Danh sách khóa học'}
                </h2>
                {currentCategoryId && (
                  <p className="text-sm text-slate-500 mt-1">
                    Danh mục: <span className="text-primary-600 font-bold">{categories.find(c => String(c.id) === currentCategoryId)?.categoryName}</span>
                  </p>
                )}
              </div>
              <span className="text-slate-500 text-sm font-medium bg-slate-200/50 px-3 py-1 rounded-full">{courses.length} kết quả</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
