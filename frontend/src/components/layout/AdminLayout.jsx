import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
      active
        ? 'bg-primary-600 text-white shadow-sm'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <span className={`w-5 h-5 flex-shrink-0 flex items-center justify-center ${active ? 'text-white' : 'text-slate-500'}`}>{icon}</span>
    {label}
  </Link>
);

/**
 * AdminLayout: Bọc nội dung Admin với Sidebar cố định bên trái.
 * Dùng chung cho AdminDashboardPage, AdminCoursesPage, AdminLessonsPage.
 */
const AdminLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* ──────── SIDEBAR ──────── */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col py-6 px-3 min-h-screen sticky top-0">
        <div className="px-3 mb-6">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Admin Panel</p>
        </div>

        <nav className="flex flex-col gap-1">
          <NavItem
            to="/admin"
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            label="Hóa Đơn"
            active={location.pathname === '/admin'}
          />
          <NavItem
            to="/admin/courses"
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            label="Khóa Học"
            active={location.pathname.startsWith('/admin/courses')}
          />
          <NavItem
            to="/admin/users"
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            label="Người Dùng"
            active={location.pathname.startsWith('/admin/users')}
          />
          <NavItem
            to="/admin/support"
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            label="Hỗ Trợ"
            active={location.pathname === '/admin/support'}
          />
        </nav>

        <div className="mt-auto px-3 pt-6 border-t border-slate-100">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Về trang chủ
          </Link>
        </div>
      </aside>

      {/* ──────── MAIN CONTENT ──────── */}
      <div className="flex-1 min-w-0 flex flex-col p-8">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
