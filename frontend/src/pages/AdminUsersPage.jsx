import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import api from '../api/axiosConfig';
import AdminLayout from '../components/layout/AdminLayout';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'admin'

  // Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [userEnrollments, setUserEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [roleUpdating, setRoleUpdating] = useState(false);
  const [enrollmentFilter, setEnrollmentFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      setError('Lỗi khi tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    setEnrollmentFilter('all');
    setLoadingEnrollments(true);
    try {
      const res = await api.get(`/admin/enrollments?userId=${user.id}`);
      setUserEnrollments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    if (!window.confirm(`Bạn có chắc muốn đổi quyền của user này thành ${newRole}?`)) return;
    setRoleUpdating(true);
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: 'ROLE_' + newRole.toUpperCase() } : u));
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, role: 'ROLE_' + newRole.toUpperCase() });
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Lỗi khi cập nhật quyền.');
    } finally {
      setRoleUpdating(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.phone?.includes(searchTerm);
    const isAdmin = user.role?.toLowerCase().includes('admin');
    const matchRole = activeTab === 'admin' ? isAdmin : !isAdmin;
    return matchSearch && matchRole;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-primary-500"></div>
      </div>
    );
  }

  const filteredEnrollments = userEnrollments.filter(e => enrollmentFilter === 'all' || e.status === enrollmentFilter);

  return (
    <AdminLayout>
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Người Dùng</h1>
          <p className="text-slate-500 mt-1">Quản lý tài khoản, quyền hạn và lịch sử học tập của học viên.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Tìm tên, email, sđt..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('user')}
          className={`pb-4 px-6 font-semibold text-sm transition-all relative ${
            activeTab === 'user' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Học viên (Users)
          {activeTab === 'user' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`pb-4 px-6 font-semibold text-sm transition-all relative ${
            activeTab === 'admin' ? 'text-primary-600' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Quản trị viên (Admins)
          {activeTab === 'admin' && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></span>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">Học viên</th>
                <th className="px-6 py-4 font-bold text-slate-600">Liên hệ</th>
                <th className="px-6 py-4 font-bold text-slate-600">Vai trò</th>
                <th className="px-6 py-4 font-bold text-slate-600">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isAdmin = user.role?.toLowerCase().includes('admin');
                  return (
                    <tr 
                      key={user.id} 
                      onClick={() => handleViewUser(user)}
                      className="hover:bg-primary-50/50 cursor-pointer transition-all group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold overflow-hidden border border-slate-200 group-hover:border-primary-300 transition-colors">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              user.name?.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{user.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Tham gia: -</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <p className="font-medium">{user.email}</p>
                        <p className="text-xs text-slate-400">{user.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                          isAdmin ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isAdmin ? 'ADMIN' : 'USER'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono">#{user.id}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal - Dùng PORTAL */}
      {selectedUser && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="absolute inset-0" onClick={() => setSelectedUser(null)}></div>
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 animate-fade-in flex flex-col">

            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
                <h2 className="text-lg font-black text-slate-900">Hồ sơ người dùng</h2>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 flex flex-col md:flex-row gap-8">

              {/* ── LEFT: Profile Info ── */}
              <div className="md:w-72 flex-shrink-0 space-y-4">

                {/* Avatar & Basic */}
                <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
                  <div className="w-24 h-24 rounded-full bg-primary-100 mx-auto mb-4 flex items-center justify-center text-3xl font-black text-primary-600 overflow-hidden border-4 border-white shadow-md">
                    {selectedUser.avatarUrl ? (
                      <img src={selectedUser.avatarUrl} alt={selectedUser.name} className="w-full h-full object-cover" />
                    ) : (
                      selectedUser.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{selectedUser.name}</h3>
                  <span className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    selectedUser.role?.includes('ADMIN') ? 'bg-amber-100 text-amber-700' : 'bg-primary-50 text-primary-700'
                  }`}>
                    {selectedUser.role?.replace('ROLE_', '')}
                  </span>
                </div>

                {/* Detail rows */}
                <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden">
                  {[
                    { label: 'ID', value: `#${selectedUser.id}`, mono: true },
                    { label: 'Email', value: selectedUser.email },
                    { label: 'Điện thoại', value: selectedUser.phone || '—' },
                  ].map(({ label, value, mono }) => (
                    <div key={label} className="flex items-start justify-between px-4 py-3 gap-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex-shrink-0 mt-0.5">{label}</span>
                      <span className={`text-sm text-slate-800 text-right break-all ${mono ? 'font-mono' : 'font-medium'}`}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Role management */}
                <div className="bg-white rounded-2xl border border-slate-100 p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Cấp quyền</p>
                  <div className="flex gap-2">
                    <button
                      disabled={roleUpdating || selectedUser.role?.includes('ADMIN')}
                      onClick={() => handleUpdateRole(selectedUser.id, 'ADMIN')}
                      className="flex-1 py-2 text-xs font-bold rounded-lg transition-colors border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 disabled:opacity-40"
                    >
                      Lên Admin
                    </button>
                    <button
                      disabled={roleUpdating || !selectedUser.role?.includes('ADMIN')}
                      onClick={() => handleUpdateRole(selectedUser.id, 'USER')}
                      className="flex-1 py-2 text-xs font-bold rounded-lg transition-colors border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                    >
                      Hạ xuống User
                    </button>
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Enrollments ── */}
              <div className="flex-1 min-w-0">

                {/* Stats summary & Filter Toggles */}
                {!loadingEnrollments && (
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[
                      { id: 'all', label: 'Tổng khoá', value: userEnrollments.length, color: 'bg-slate-50 border-slate-200 text-slate-700', activeClass: 'ring-2 ring-slate-400 bg-slate-100 shadow-sm opacity-100' },
                      { id: 'approved', label: 'Đã duyệt', value: userEnrollments.filter(e => e.status === 'approved').length, color: 'bg-emerald-50 border-emerald-200 text-emerald-700', activeClass: 'ring-2 ring-emerald-400 bg-emerald-100 shadow-sm opacity-100' },
                      { id: 'pending', label: 'Chờ duyệt', value: userEnrollments.filter(e => e.status === 'pending').length, color: 'bg-amber-50 border-amber-200 text-amber-700', activeClass: 'ring-2 ring-amber-400 bg-amber-100 shadow-sm opacity-100' },
                    ].map(({ id, label, value, color, activeClass }) => (
                      <button 
                        key={id} 
                        onClick={() => setEnrollmentFilter(id)}
                        className={`rounded-xl border p-3 text-center transition-all cursor-pointer hover:scale-[1.02] active:scale-95 ${color} ${enrollmentFilter === id ? activeClass : 'opacity-60 hover:opacity-100'}`}
                      >
                        <p className="text-xl font-black">{value}</p>
                        <p className="text-xs font-semibold mt-0.5">{label}</p>
                      </button>
                    ))}
                  </div>
                )}

                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Khóa học {enrollmentFilter === 'all' ? 'đã đăng ký' : enrollmentFilter === 'approved' ? 'đã duyệt' : 'chờ duyệt'} ({filteredEnrollments.length})
                </h3>

                {loadingEnrollments ? (
                  <div className="animate-pulse space-y-3">
                    {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl" />)}
                  </div>
                ) : filteredEnrollments.length === 0 ? (
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-400 text-sm">
                    <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
                    </svg>
                    {enrollmentFilter === 'all' ? 'Chưa đăng ký khóa học nào.' : 'Không có khóa học nào thuộc trạng thái này.'}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {filteredEnrollments.map(enr => (
                      <div key={enr.id} className="flex items-center gap-4 bg-slate-50 border border-slate-100 hover:border-primary-200 rounded-xl p-3 transition-colors">
                        {/* Thumbnail */}
                        <div className="w-16 h-12 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                          {enr.course?.thumbnailUrl ? (
                            <img src={enr.course.thumbnailUrl} alt={enr.course.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13" /></svg>
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{enr.course?.title || 'Khóa học đã bị xóa'}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Đăng ký: {enr.createdAt ? new Date(enr.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'}
                          </p>
                        </div>
                        {/* Status badge */}
                        <span className={`flex-shrink-0 inline-flex px-2.5 py-1 rounded-lg text-[10px] uppercase font-black tracking-wider ${
                          enr.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                          enr.status === 'pending'  ? 'bg-amber-100 text-amber-700' :
                          enr.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {enr.status === 'approved' ? 'Đã duyệt'
                            : enr.status === 'pending' ? 'Chờ duyệt'
                            : enr.status === 'rejected' ? 'Từ chối'
                            : enr.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

    </AdminLayout>
  );
};

export default AdminUsersPage;
