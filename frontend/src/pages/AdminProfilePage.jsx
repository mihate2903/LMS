import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import ImageUpload from '../components/common/ImageUpload';
import AdminLayout from '../components/layout/AdminLayout';

const AdminProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    avatarUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [infoForm, setInfoForm] = useState({ name: '', phone: '', avatarUrl: '' });
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [updatingInfo, setUpdatingInfo] = useState(false);
  const [updatingPass, setUpdatingPass] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users/profile');
      setProfile(res.data);
      setInfoForm({ name: res.data.name, phone: res.data.phone, avatarUrl: res.data.avatarUrl || '' });
    } catch (err) {
      setError("Không thể tải thông tin hồ sơ.");
    } finally {
      setLoading(false);
    }
  };

  const handleInfoUpdate = async (e) => {
    e.preventDefault();
    setUpdatingInfo(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.put('/users/profile', infoForm);
      setProfile(res.data);
      localStorage.setItem('name', res.data.name);
      localStorage.setItem('avatarUrl', res.data.avatarUrl || '');
      window.dispatchEvent(new Event('profileUpdated'));
      setSuccess("Cập nhật thông tin thành công!");
    } catch (err) {
      const resData = err.response?.data;
      const errorMsg = resData?.error || (resData && Object.values(resData)[0]) || "Lỗi khi cập nhật thông tin.";
      setError(typeof errorMsg === 'string' ? errorMsg : "Lỗi khi cập nhật thông tin.");
    } finally {
      setUpdatingInfo(false);
    }
  };

  const handlePassUpdate = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      setError("Mật khẩu mới không khớp!");
      return;
    }
    setUpdatingPass(true);
    setError(null);
    setSuccess(null);
    try {
      await api.put('/users/profile/password', {
        oldPassword: passForm.oldPassword,
        newPassword: passForm.newPassword
      });
      setSuccess("Đổi mật khẩu thành công!");
      setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const resData = err.response?.data;
      const errorMsg = resData?.error || (resData && Object.values(resData)[0]) || "Lỗi khi đổi mật khẩu.";
      setError(typeof errorMsg === 'string' ? errorMsg : "Lỗi khi đổi mật khẩu.");
    } finally {
      setUpdatingPass(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-primary-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Hồ Sơ Admin</h1>
          <p className="text-slate-500 mt-1">Quản lý các thông tin cá nhân và cài đặt bảo mật dành cho quản trị viên.</p>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl text-sm font-medium animate-shake">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-emerald-50 text-emerald-600 border border-emerald-100 p-4 rounded-xl text-sm font-medium animate-fade-in">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-black text-primary-600">
                    {profile.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-black text-slate-900">{profile.name}</h2>
              <p className="text-slate-500 text-sm mb-4">{profile.email}</p>
              <div className="inline-flex items-center px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full uppercase tracking-wider">
                ADMIN
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Chi tiết tài khoản</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">ID quản trị</span>
                  <span className="text-slate-900 font-mono">#{profile.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quyền hạn</span>
                  <span className="text-primary-600 font-bold">Toàn quyền</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Trạng thái</span>
                  <span className="text-emerald-500 font-bold">Hoạt động</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editing Tabs/Forms */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Form: Basic Info */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
               {/* Accent line */}
               <div className="absolute top-0 left-0 w-full h-1 bg-primary-500"></div>
               
               <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                 <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                 </svg>
                 Thông tin quản trị
               </h3>

               <form onSubmit={handleInfoUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="md:col-span-2">
                   <label className="block text-sm font-bold text-slate-700 mb-1.5">Địa chỉ Email</label>
                   <input type="text" value={profile.email} disabled
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 cursor-not-allowed text-sm" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1.5">Họ và Tên</label>
                   <input type="text" required
                     value={infoForm.name}
                     onChange={(e) => setInfoForm({...infoForm, name: e.target.value})}
                     className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                     placeholder="Tên quản trị viên" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1.5">Số điện thoại</label>
                   <input type="tel" required
                     value={infoForm.phone}
                     onChange={(e) => setInfoForm({...infoForm, phone: e.target.value})}
                     className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                     placeholder="Số liên lạc" />
                 </div>
                 <div className="md:col-span-2">
                   <ImageUpload
                     label="Ảnh đại diện"
                     currentUrl={infoForm.avatarUrl}
                     onUpload={(url) => setInfoForm({...infoForm, avatarUrl: url})}
                     shape="circle"
                   />
                 </div>
                 <div className="md:col-span-2 pt-2">
                   <button type="submit" disabled={updatingInfo}
                     className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-primary-200 disabled:opacity-50">
                     {updatingInfo ? "Đang lưu..." : "Lưu thay đổi"}
                   </button>
                 </div>
               </form>
            </div>

            {/* Form: Password Change */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-red-400"></div>

               <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                 <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                 </svg>
                 Bảo mật & Mật khẩu
               </h3>

               <form onSubmit={handlePassUpdate} className="space-y-6">
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1.5">Mật khẩu hiện tại</label>
                   <input type="password" required
                     value={passForm.oldPassword}
                     onChange={(e) => setPassForm({...passForm, oldPassword: e.target.value})}
                     className="w-full max-w-md border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" 
                     placeholder="••••••••" />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1.5">Mật khẩu mới</label>
                     <input type="password" required minLength={6}
                       value={passForm.newPassword}
                       onChange={(e) => setPassForm({...passForm, newPassword: e.target.value})}
                       className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" 
                       placeholder="Ít nhất 6 ký tự" />
                   </div>
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1.5">Xác nhận mật khẩu mới</label>
                     <input type="password" required
                       value={passForm.confirmPassword}
                       onChange={(e) => setPassForm({...passForm, confirmPassword: e.target.value})}
                       className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" 
                       placeholder="Nhập lại mật khẩu mới" />
                   </div>
                 </div>

                 <div className="pt-2">
                   <button type="submit" disabled={updatingPass}
                     className="bg-slate-900 hover:bg-black text-white font-bold py-3 px-6 rounded-xl text-sm transition-all shadow-lg shadow-slate-200 disabled:opacity-50">
                     {updatingPass ? 'Đang đổi mật khẩu...' : 'Cập nhật mật khẩu'}
                   </button>
                 </div>
               </form>
            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfilePage;
