import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  // Tránh lỗi khi backend chưa có ảnh
  const defaultImage = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img
          src={course.thumbnailUrl || defaultImage}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {course.categoryName && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-primary-700 rounded-full shadow-sm">
              {course.categoryName}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors">
          {course.title}
        </h3>
        
        <div className="mt-2 text-sm text-slate-500 line-clamp-2 flex-1">
          {course.description || "Không có mô tả cho khóa học này."}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="text-xl font-black text-slate-900">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
          </div>
          <Link to={`/course/${course.id}`} className="text-primary-600 font-semibold text-sm hover:text-primary-700">
            Xem chi tiết →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
