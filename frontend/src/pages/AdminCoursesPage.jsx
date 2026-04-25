import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import api from '../api/axiosConfig';
import AdminLayout from '../components/layout/AdminLayout';
import ImageUpload from '../components/common/ImageUpload';

// ── Component con: Quản lý Bài giảng (Tích hợp) ──
const LessonManager = ({ course, onUpdate }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const fetchLessons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/courses/${course.id}`);
      const sorted = [...(res.data.lessons || [])].sort((a, b) => (a.lessonOrder || 0) - (b.lessonOrder || 0));
      setLessons(sorted);
    } catch { } finally { setLoading(false); }
  }, [course.id]);

  useEffect(() => { fetchLessons(); }, [fetchLessons]);

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div><h3 className="text-sm font-black text-slate-800">Bài giảng</h3><p className="text-[10px] text-slate-400 font-bold uppercase">{lessons.length} bài học</p></div>
        <button onClick={() => setModal({ type: 'create' })} className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>Thêm bài</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-200 border-t-primary-500"></div></div> : lessons.length === 0 ? <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl"><p className="text-xs text-slate-400 font-medium">Chưa có bài giảng.</p></div> : 
          lessons.map((lesson, idx) => (
            <div key={lesson.id} onClick={() => window.open(`/study/${course.id}?lessonId=${lesson.id}`, '_blank')} className="group p-3 rounded-xl border border-slate-100 hover:bg-primary-50 hover:border-primary-200 cursor-pointer transition-all flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 group-hover:text-primary-700 transition-colors">{lesson.lessonOrder || idx + 1}</div>
              <div className="flex-1 min-w-0 flex items-center gap-3">
                 <p className="text-sm font-bold text-slate-800 truncate group-hover:text-primary-700 transition-colors">{lesson.title}</p>
                 <span className="opacity-0 group-hover:opacity-100 text-[9px] font-black uppercase text-primary-500 tracking-widest transition-opacity flex items-center gap-1 shrink-0"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> Xem trước</span>
              </div>
              <div className="flex gap-1 relative z-10">
                <button onClick={(e) => { e.stopPropagation(); setModal({ type: 'quiz', lesson }); }} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg></button>
                <button onClick={(e) => { e.stopPropagation(); setModal({ type: 'edit', lesson }); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                <button onClick={(e) => { e.stopPropagation(); setModal({ type: 'delete', lesson }); }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
              </div>
            </div>
          ))
        }
      </div>
      {(modal?.type === 'create' || modal?.type === 'edit') && <InternalLessonForm mode={modal.type} lesson={modal.lesson} courseId={course.id} onClose={() => setModal(null)} onSaved={() => { setModal(null); fetchLessons(); if (onUpdate) onUpdate(); }} />}
      {modal?.type === 'delete' && <InternalDeleteConfirm lesson={modal.lesson} onClose={() => setModal(null)} onConfirm={async () => { await api.delete(`/lessons/${modal.lesson.id}`); setModal(null); fetchLessons(); if(onUpdate) onUpdate(); }} />}
      {modal?.type === 'quiz' && <InternalQuizManager lesson={modal.lesson} onClose={() => setModal(null)} />}
    </div>
  );
};

// ── Popup Hồ sơ Học viên (Tích hợp trong Quản lý) ──
const StudentProfileModal = ({ enrollment, user, course, onClose, onRemove }) => {
  const [userEnrollments, setUserEnrollments] = useState([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [enrollmentFilter, setEnrollmentFilter] = useState('all');

  useEffect(() => {
    if (user?.id) {
      setLoadingEnrollments(true);
      api.get(`/admin/enrollments?userId=${user.id}`)
         .then(res => setUserEnrollments(res.data || []))
         .catch(() => setUserEnrollments([{ ...enrollment, course }]))
         .finally(() => setLoadingEnrollments(false));
    } else {
      setUserEnrollments([{ ...enrollment, course }]);
    }
  }, [user, enrollment, course]);

  const filteredEnrollments = userEnrollments.filter(e => enrollmentFilter === 'all' || e.status === enrollmentFilter);

  return createPortal(
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 animate-fade-in flex flex-col">
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            </div>
            <h2 className="text-lg font-black text-slate-900">Hồ sơ người dùng</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-8 flex flex-col md:flex-row gap-8">
          <div className="md:w-72 flex-shrink-0 space-y-4">
            <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
              <div className="w-24 h-24 rounded-full bg-primary-100 mx-auto mb-4 flex items-center justify-center text-3xl font-black text-primary-600 overflow-hidden border-4 border-white shadow-md">
                {user?.avatarUrl ? <img src={user.avatarUrl} alt={user?.name} className="w-full h-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-lg font-black text-slate-900">{user?.name}</h3>
              <span className={`inline-flex mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user?.role?.includes('ADMIN') ? 'bg-amber-100 text-amber-700' : 'bg-primary-50 text-primary-700'}`}>
                {user?.role?.replace('ROLE_', '') || 'USER'}
              </span>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden">
              {[
                { label: 'ID', value: user?.id ? `#${user.id}` : '—', mono: true },
                { label: 'Email', value: user?.email },
                { label: 'Điện thoại', value: user?.phone || '—' },
              ].map(({ label, value, mono }) => (
                <div key={label} className="flex items-start justify-between px-4 py-3 gap-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex-shrink-0 mt-0.5">{label}</span>
                  <span className={`text-sm text-slate-800 text-right break-all ${mono ? 'font-mono' : 'font-medium'}`}>{value}</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-red-100 p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-red-500">Quản lý tham gia</p>
              <button onClick={onRemove} className="w-full py-2.5 text-xs font-bold rounded-lg transition-colors border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center gap-2 shadow-sm active:scale-95">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 Xóa khỏi khóa học này
              </button>
            </div>
          </div>

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
  );
};

// ── Component: Danh sách Học viên ──
const StudentManager = ({ course }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const [enrRes, usersRes] = await Promise.all([
        api.get(`/admin/enrollments?courseId=${course.id}`),
        api.get(`/admin/users`)
      ]);
      setEnrollments(enrRes.data || []);
      setUsers(usersRes.data || []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, [course.id]);

  const handleRemove = async (enrollmentId) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này khỏi khóa học? Hành động này không thể hoàn tác.')) {
      try {
        await api.delete(`/admin/enrollments/${enrollmentId}`);
        setSelectedStudent(null);
        fetchStudents();
      } catch (err) {
        alert(err.response?.data?.error || 'Có lỗi xảy ra khi xóa!');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h3 className="text-sm font-black text-slate-800">Học viên</h3>
        <span className="text-[10px] text-slate-400 font-bold uppercase">{enrollments.length} người</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-6 w-6 border-2 border-slate-200 border-t-primary-500"></div></div> : enrollments.length === 0 ? <p className="text-center py-10 text-xs text-slate-400 font-medium">Chưa có học viên.</p> : enrollments.map(enr => (
          <div 
            key={enr.id || enr.enrollmentId} 
            onClick={() => {
              const matchedUser = users.find(u => u.email === enr.contactEmail);
              setSelectedStudent({ enrollment: enr, user: matchedUser || { name: enr.contactName, email: enr.contactEmail, phone: enr.contactPhone } });
            }}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-50 bg-slate-50/30 hover:bg-primary-50 hover:border-primary-100 cursor-pointer transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 text-[10px] font-black flex items-center justify-center group-hover:bg-primary-200 transition-colors">{enr.contactName?.charAt(0).toUpperCase()}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate group-hover:text-primary-700 transition-colors">{enr.contactName}</p>
              <p className="text-[10px] text-slate-400 truncate">{enr.contactEmail}</p>
            </div>
            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${enr.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{enr.status === 'approved' ? 'Đã duyệt' : 'Chờ'}</span>
          </div>
        ))}
      </div>

      {selectedStudent && (
        <StudentProfileModal 
          enrollment={selectedStudent.enrollment} 
          user={selectedStudent.user}
          course={course}
          onClose={() => setSelectedStudent(null)}
          onRemove={() => handleRemove(selectedStudent.enrollment.id || selectedStudent.enrollment.enrollmentId)}
        />
      )}
    </div>
  );
};

// ── Sub-components nội bộ ──
const InternalLessonForm = ({ mode, lesson, courseId, onClose, onSaved }) => {
  const [form, setForm] = useState({ title: lesson?.title || '', videoUrl: lesson?.videoUrl || '', content: lesson?.content || '', lessonOrder: lesson?.lessonOrder || 1 });
  const [saving, setSaving] = useState(false);
  const handleSubmit = async (e) => { e.preventDefault(); setSaving(true); try { const p = { ...form, courseId: Number(courseId), lessonOrder: Number(form.lessonOrder) }; if (mode === 'create') await api.post('/lessons', p); else await api.put(`/lessons/${lesson.id}`, p); onSaved(); } catch (err) { const d = err.response?.data; alert(d?.error || (d && Object.values(d)[0]) || 'Lỗi lưu bài giảng!'); } finally { setSaving(false); } };
  return (
    <div className="absolute inset-0 z-[70] bg-white animate-slide-up flex flex-col">
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <button onClick={onClose} className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>Quay lại</button>
        <span className="text-xs font-black text-slate-900 uppercase">{mode === 'create' ? 'Tạo bài giảng' : 'Sửa bài giảng'}</span>
      </div>
      <form onSubmit={handleSubmit} className="flex-1 p-5 space-y-4 overflow-y-auto">
        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-3"><label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Tiêu đề</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500" /></div>
          <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Thứ tự</label><input type="number" value={form.lessonOrder} onChange={e => setForm({...form, lessonOrder: e.target.value})} required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
        </div>
        <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Link Video</label><input value={form.videoUrl} onChange={e => setForm({...form, videoUrl: e.target.value})} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm" /></div>
        <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Nội dung</label><textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={5} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none" /></div>
      </form>
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2"><button type="submit" disabled={saving} className="w-full bg-primary-600 text-white py-3 rounded-2xl text-xs font-black">{saving ? 'Đang lưu...' : 'Lưu bài giảng'}</button></div>
    </div>
  );
};

const InternalQuizManager = ({ lesson, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ content: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' });
  const [editingId, setEditingId] = useState(null);
  const fetchQs = useCallback(async () => { const res = await api.get(`/admin/lessons/${lesson.id}/questions`); setQuestions(res.data); }, [lesson.id]);
  useEffect(() => { fetchQs(); }, [fetchQs]);
  const handleSubmit = async (e) => { e.preventDefault(); try { if (editingId) await api.put(`/admin/lessons/questions/${editingId}`, form); else await api.post(`/admin/lessons/${lesson.id}/questions`, form); setForm({ content: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' }); setEditingId(null); fetchQs(); } catch { alert('Lỗi!'); } };
  return (
    <div className="absolute inset-0 z-[80] bg-white animate-slide-up flex flex-col">
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <button onClick={onClose} className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>Quay lại</button>
        <span className="text-[10px] font-black text-slate-900 uppercase">Quiz: {lesson.title}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
          <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} placeholder="Câu hỏi..." required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs" />
          <div className="grid grid-cols-2 gap-2">{['A', 'B', 'C', 'D'].map(o => <input key={o} value={form[`option${o}`]} onChange={e => setForm({...form, [`option${o}`]: e.target.value})} placeholder={`Đáp án ${o}`} required className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-[10px]" />)}</div>
          <div className="flex items-center justify-between gap-3"><select value={form.correctAnswer} onChange={e => setForm({...form, correctAnswer: e.target.value})} className="border border-slate-200 rounded-lg text-[10px] px-2 py-1.5 flex-1"><option value="A">Đúng: A</option><option value="B">Đúng: B</option><option value="C">Đúng: C</option><option value="D">Đúng: D</option></select><button type="submit" className="bg-primary-600 text-white text-[10px] font-black px-4 py-1.5 rounded-lg active:scale-95">{editingId ? 'Lưu' : 'Thêm'}</button></div>
        </form>
        <div className="space-y-2">{questions.map((q, i) => (<div key={q.id} className="p-3 border border-slate-50 rounded-xl bg-slate-50 relative group"><p className="font-bold text-[11px] mb-1">C{i+1}: {q.content}</p><div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2"><button onClick={() => {setEditingId(q.id); setForm({...q});}} className="text-primary-600 font-bold text-[9px]">Sửa</button><button onClick={async () => {if(window.confirm('Xóa?')){await api.delete(`/admin/lessons/questions/${q.id}`); fetchQs();}}} className="text-red-500 font-bold text-[9px]">Xóa</button></div></div>))}</div>
      </div>
    </div>
  );
};

const InternalDeleteConfirm = ({ lesson, onClose, onConfirm }) => (
  <div className="absolute inset-0 z-[100] bg-white/95 flex items-center justify-center p-8 text-center animate-fade-in">
    <div><h3 className="font-black text-slate-900 text-sm mb-4 uppercase">Xóa bài giảng?</h3><div className="flex gap-2"><button onClick={onClose} className="flex-1 px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 rounded-lg">Hủy</button><button onClick={onConfirm} className="flex-1 px-4 py-2 text-xs font-bold text-white bg-red-500 rounded-lg">Xóa ngay</button></div></div>
  </div>
);

// ── Modal Quản trị (Có Sidebar) - Dùng PORTAL ──
const CourseModal = ({ mode, course, categories, onClose, onSaved, onBack }) => {
  const [activeTab, setActiveTab] = useState('info'); 
  const [form, setForm] = useState({ categoryId: course?.categoryId || '', title: course?.title || '', price: course?.price || '', description: course?.description || '', thumbnailUrl: course?.thumbnailUrl || '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const p = { ...form, categoryId: Number(form.categoryId), price: Number(form.price) };
      if (mode === 'create') await api.post('/courses', p);
      else await api.put(`/courses/${course.id}`, p);
      onSaved();
    } catch (err) { 
      const resData = err.response?.data;
      const errorMsg = resData?.error || (resData && Object.values(resData)[0]) || "Lỗi khi lưu khóa học!";
      alert(typeof errorMsg === 'string' ? errorMsg : "Lỗi khi lưu khóa học!");
    } finally { setSaving(false); }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl h-[85vh] max-h-[90vh] flex flex-col animate-fade-in relative z-10 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            {onBack && <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg></button>}
            <h2 className="text-lg font-black text-slate-900 tracking-tight">{mode === 'create' ? 'Thêm Khóa học mới' : 'Quản trị Khóa học'}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {mode === 'edit' && (
            <div className="w-52 bg-slate-50 border-r border-slate-100 p-4 space-y-2 hidden md:block">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">MENU QUẢN TRỊ</div>
              <button onClick={() => setActiveTab('info')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${activeTab === 'info' ? 'bg-white text-primary-600 shadow-sm border border-primary-100' : 'text-slate-500 hover:bg-white'}`}>Thông tin chung</button>
              <button onClick={() => setActiveTab('lessons')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${activeTab === 'lessons' ? 'bg-white text-primary-600 shadow-sm border border-primary-100' : 'text-slate-500 hover:bg-white'}`}>Bài giảng</button>
              <button onClick={() => setActiveTab('students')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${activeTab === 'students' ? 'bg-white text-primary-600 shadow-sm border border-primary-100' : 'text-slate-500 hover:bg-white'}`}>Học viên</button>
            </div>
          )}

          <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
            {activeTab === 'info' ? (
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">DANH MỤC</label>
                      <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50/50"><option value="">-- Chọn --</option>{categories.map(c => <option key={c.id} value={c.id}>{c.categoryName}</option>)}</select>
                    </div>
                    <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">GIÁ (VNĐ)</label>
                      <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50/50" />
                    </div>
                  </div>
                  <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">TIÊU ĐỀ KHÓA HỌC</label>
                    <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold bg-slate-50/50" />
                  </div>
                  <ImageUpload label="Ảnh bìa" currentUrl={form.thumbnailUrl} onUpload={url => setForm({...form, thumbnailUrl: url})} shape="square" />
                  <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">MÔ TẢ</label>
                    <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={5} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none bg-slate-50/50" />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                  <button type="button" onClick={onBack || onClose} className="px-5 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-bold text-sm">Hủy</button>
                  <button type="submit" disabled={saving} className="px-8 py-2.5 bg-primary-600 text-white font-black rounded-xl text-sm shadow-lg">{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
                </div>
              </form>
            ) : activeTab === 'lessons' ? (
              <LessonManager course={course} onUpdate={() => {}} />
            ) : (
              <StudentManager course={course} />
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ── Modal Chi tiết: Nhỏ gọn, nút bấm ngang - Dùng PORTAL ──
const CourseDetailModal = ({ course, onClose, onEdit, onDelete }) => {
  const [studentCount, setStudentCount] = useState(0);
  useEffect(() => {
    if (course) api.get(`/admin/enrollments?courseId=${course.id}`).then(res => setStudentCount(res.data?.length || 0)).catch(() => setStudentCount(0));
  }, [course]);
  
  if (!course) return null;
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-fade-in relative z-10 flex flex-col max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-base font-black text-slate-900">Chi tiết khóa học</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            <div className="w-full sm:w-1/2 shrink-0">
              <img src={course.thumbnailUrl || 'https://via.placeholder.com/640x360'} alt="" className="w-full aspect-video object-cover rounded-2xl shadow-sm border border-slate-100" />
            </div>
            <div className="flex-1 flex flex-col justify-center space-y-3">
              <h3 className="text-xl font-black text-slate-900 leading-tight">{course.title}</h3>
              <div><span className="text-[10px] text-primary-600 font-bold bg-primary-50 px-2.5 py-1 rounded-md uppercase">{course.categoryName}</span></div>
              <div className="flex gap-6 mt-2">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-0.5">Giá bán</p>
                  <p className="text-base font-black text-slate-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase mb-0.5">Học viên</p>
                  <p className="text-base font-black text-primary-600">{studentCount} người</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-600 leading-relaxed italic bg-slate-50 p-4 rounded-2xl border border-slate-100">
            "{course.description || "Chưa có mô tả chi tiết cho khóa học này."}"
          </div>
        </div>

        {/* Nút bấm cùng dòng, bé */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button onClick={onEdit} className="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-primary-700 transition-all active:scale-95 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Quản trị
          </button>
          <button onClick={onDelete} className="px-6 py-2 bg-white text-red-500 border border-red-200 rounded-xl font-bold text-sm shadow-sm hover:bg-red-50 transition-all active:scale-95 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Gỡ bỏ
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ── Modal Xóa Khóa học - Dùng PORTAL ──
const DeleteCourseConfirm = ({ course, onClose, onConfirm, onBack }) => {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 text-center animate-fade-in relative z-10">
        <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></div>
        <h3 className="font-black text-slate-900 text-xl mb-3">Gỡ bỏ khóa học?</h3>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">Dữ liệu sẽ được lưu trữ an toàn. Bạn có thể khôi phục bất cứ lúc nào từ hệ thống admin.</p>
        <div className="flex gap-4"><button onClick={onBack || onClose} className="flex-1 border border-slate-300 py-3 rounded-2xl font-bold text-slate-600 transition-all hover:bg-slate-50">Hủy</button><button onClick={onConfirm} className="flex-1 bg-red-500 text-white py-3 rounded-2xl font-black shadow-lg hover:bg-red-600 transition-all active:scale-95">Xác nhận gỡ</button></div>
      </div>
    </div>,
    document.body
  );
};

// ── Trang Chính ── 
const AdminCoursesPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (modal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [modal]);

  useEffect(() => {
    const courseId = searchParams.get('courseId');
    const action = searchParams.get('action');
    if (courseId && courses.length > 0) {
      const course = courses.find(c => c.id === Number(courseId));
      if (course) {
        if (action === 'edit') setModal({ type: 'edit', course });
        else if (action === 'delete') setModal({ type: 'delete', course });
        else setModal({ type: 'detail', course });
      }
    } else if (!courseId) setModal(null);
  }, [searchParams, courses]);

  const updateURL = (type, course = null) => {
    if (!type) setSearchParams({});
    else { const p = { courseId: course.id }; if (type !== 'detail') p.action = type; setSearchParams(p); }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [coursesRes, catsRes] = await Promise.all([api.get('/courses'), api.get('/categories')]);
      setCourses(coursesRes.data);
      setCategories(catsRes.data);
    } catch { } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!role || !role.toLowerCase().includes('admin')) { navigate('/'); return; }
    loadData();
  }, [navigate, loadData]);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div><h1 className="text-2xl font-black text-slate-900">Quản lý Khóa Học</h1><p className="text-slate-500 mt-0.5">{courses.length} khóa học đang hoạt động</p></div>
        <button onClick={() => setModal({ type: 'create' })} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg transition-all active:scale-95"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>Thêm Khóa học</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
              <tr><th className="px-6 py-4">Khóa học</th><th className="px-6 py-4 text-center">Danh mục</th><th className="px-6 py-4">Giá</th><th className="px-6 py-4 text-center">Bài giảng</th><th className="px-6 py-4 text-right">ID</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-16 text-center text-slate-400 font-medium">Đang tải dữ liệu...</td></tr>
              ) : courses.map(course => (
                <tr key={course.id} onClick={() => updateURL('detail', course)} className="hover:bg-primary-50/50 cursor-pointer transition-all group">
                  <td className="px-6 py-4"><div className="flex items-center gap-4"><img src={course.thumbnailUrl || 'https://via.placeholder.com/56x40'} className="w-14 h-10 object-cover rounded-xl shadow-sm bg-slate-100 border border-slate-100 group-hover:scale-105 transition-transform" alt="" /><p className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{course.title}</p></div></td>
                  <td className="px-6 py-4 text-center"><span className="inline-flex items-center justify-center text-center px-3 py-1.5 bg-primary-50 text-primary-700 text-[10px] font-bold rounded-lg border border-primary-100 uppercase">{course.categoryName}</span></td>
                  <td className="px-6 py-4 font-black text-slate-700">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}</td>
                  <td className="px-6 py-4 text-center font-bold text-slate-600">{course.lessons?.length || 0} bài</td>
                  <td className="px-6 py-4 text-right text-slate-300 font-mono text-[10px]">#{course.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals Core */}
      {modal?.type === 'detail' && <CourseDetailModal course={modal.course} onClose={() => updateURL(null)} onEdit={() => updateURL('edit', modal.course)} onDelete={() => updateURL('delete', modal.course)} />}
      {(modal?.type === 'create' || modal?.type === 'edit') && <CourseModal mode={modal.type} course={modal.course} categories={categories} onClose={() => updateURL(null)} onSaved={() => { updateURL(null); loadData(); }} onBack={modal.type === 'edit' ? () => updateURL('detail', modal.course) : null} />}
      {modal?.type === 'delete' && <DeleteCourseConfirm course={modal.course} onClose={() => updateURL(null)} onConfirm={() => { api.delete(`/courses/${modal.course.id}`).then(() => { updateURL(null); loadData(); }); }} onBack={() => updateURL('detail', modal.course)} />}
    </AdminLayout>
  );
};

export default AdminCoursesPage;
