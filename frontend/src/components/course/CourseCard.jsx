import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  // Tránh lỗi khi backend chưa có ảnh
  const defaultImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <Link 
      to={`/course/${course.id}`}
      className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer no-underline"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-slate-100 flex-shrink-0">
        <img
          src={course.thumbnailUrl || defaultImage}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {course.categoryName && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center justify-center text-center px-3 py-1 bg-white/95 backdrop-blur-sm text-[11px] font-bold text-primary-700 rounded-lg shadow-sm border border-slate-100/50 max-w-[120px] leading-tight">
              {course.categoryName}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors h-[3.5rem] mb-2">
            {course.title}
          </h3>
          
          <div className="text-sm text-slate-500 line-clamp-2">
            {course.description || "Không có mô tả cho khóa học này."}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="text-xl font-black text-slate-900 group-hover:text-primary-600 transition-colors">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
          </div>
          <div className="text-primary-600 font-bold text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
            Chi tiết 
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
