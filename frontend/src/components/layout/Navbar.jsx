import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import UserDropdown from './UserDropdown';

const Navbar = ({ onOpenSupport }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState(localStorage.getItem('name') || '');
  const [avatarUrl, setAvatarUrl] = useState(localStorage.getItem('avatarUrl') || '');

  useEffect(() => {
    const handleProfileUpdate = () => {
      setUserName(localStorage.getItem('name') || '');
      setAvatarUrl(localStorage.getItem('avatarUrl') || '');
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('avatarUrl');
    localStorage.removeItem('email');
    setUserName('');
    setAvatarUrl('');
    window.dispatchEvent(new Event('profileUpdated'));
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const q = searchQuery.trim();
      if (q) {
        navigate(`/?search=${encodeURIComponent(q)}`);
      } else {
        navigate('/');
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link 
              to="/" 
              onClick={() => {
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-2xl font-black bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent"
            >
              MiniLMS<span className="text-primary-500">.</span>
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all duration-200"
                placeholder="Tìm kiếm khóa học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {!token ? (
              <>
                <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors">
                  Đăng nhập
                </Link>
                <Link to="/register" className="bg-dark hover:bg-slate-800 text-white px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow">
                  Đăng ký
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-2 md:space-x-4">
                {/* Notifications */}
                <NotificationDropdown />

                {/* User Avatar Dropdown */}
                <UserDropdown 
                  user={{ name: userName, email: localStorage.getItem('email'), avatarUrl, role }} 
                  onLogout={handleLogout} 
                  onOpenSupport={onOpenSupport}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
