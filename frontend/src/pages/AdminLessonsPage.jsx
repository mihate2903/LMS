import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import AdminLayout from '../components/layout/AdminLayout';

// ── Modal Form Bài giảng ──
const LessonModal = ({ mode, lesson, courseId, onClose, onSaved }) => {
  const [form, setForm] = useState({
    title: lesson?.title || '',
    videoUrl: lesson?.videoUrl || '',
    content: lesson?.content || '',
    lessonOrder: lesson?.lessonOrder || 1,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form, courseId: Number(courseId), lessonOrder: Number(form.lessonOrder) };
      if (mode === 'create') {
        await api.post('/lessons', payload);
      } else {
        await api.put(`/lessons/${lesson.id}`, payload);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
              {mode === 'create'
                ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              }
            </span>
            {mode === 'create' ? 'Thêm Bài giảng mới' : 'Chỉnh sửa Bài giảng'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {error && <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl p-3 text-sm">{error}</div>}

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tiêu đề bài giảng <span className="text-red-500">*</span></label>
                <input name="title" value={form.title} onChange={handleChange} required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="VD: Giới thiệu khóa học" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Thứ tự <span className="text-red-500">*</span></label>
                <input name="lessonOrder" type="number" min="1" value={form.lessonOrder} onChange={handleChange} required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Link Video (YouTube hoặc URL trực tiếp)</label>
              <input name="videoUrl" value={form.videoUrl} onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://www.youtube.com/watch?v=..." />
              <p className="text-xs text-slate-400 mt-1">Bỏ trống nếu bài học này chưa có video.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nội dung bài học</label>
              <textarea name="content" value={form.content} onChange={handleChange} rows={6}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="Tóm tắt nội dung bài học, ghi chú, tài liệu bổ sung..." />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">
              Hủy
            </button>
            <button type="submit" disabled={saving}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-50 shadow-sm">
              {saving ? 'Đang lưu...' : mode === 'create' ? 'Tạo Bài giảng' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Modal Quản lý Trắc nghiệm ──
const QuizModal = ({ lesson, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingQ, setEditingQ] = useState(null);
  const [form, setForm] = useState({ content: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' });
  const [saving, setSaving] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/lessons/${lesson.id}/questions`);
      setQuestions(res.data);
    } catch {
      alert("Không thể tải danh sách câu hỏi.");
    } finally {
      setLoading(false);
    }
  }, [lesson.id]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleEdit = (q) => {
    setEditingQ(q);
    setForm({ ...q });
  };

  const handleCancelEdit = () => {
    setEditingQ(null);
    setForm({ content: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingQ) {
        await api.put(`/admin/lessons/questions/${editingQ.id}`, form);
      } else {
        await api.post(`/admin/lessons/${lesson.id}/questions`, form);
      }
      handleCancelEdit();
      fetchQuestions();
    } catch {
      alert("Lỗi khi lưu câu hỏi!");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa câu hỏi này?")) return;
    try {
      await api.delete(`/admin/lessons/questions/${id}`);
      fetchQuestions();
    } catch {
      alert("Lỗi khi xóa!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            </span>
            Quản lý Trắc nghiệm — {lesson.title}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* List Câu hỏi */}
          <div>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">{questions.length}</span>
              Danh sách câu hỏi
            </h3>
            {loading ? <p className="text-slate-400 text-sm italic">Đang tải...</p> : questions.length === 0 ? <p className="text-slate-400 text-sm italic">Chưa có câu hỏi nào.</p> : (
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <div key={q.id} className="p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group">
                    <p className="text-sm font-bold text-slate-900 mb-2">Câu {i+1}: {q.content}</p>
                    <div className="text-[11px] grid grid-cols-2 gap-x-4 gap-y-1 text-slate-500">
                       <p className={q.correctAnswer === 'A' ? 'text-green-600 font-bold' : ''}>A: {q.optionA}</p>
                       <p className={q.correctAnswer === 'B' ? 'text-green-600 font-bold' : ''}>B: {q.optionB}</p>
                       <p className={q.correctAnswer === 'C' ? 'text-green-600 font-bold' : ''}>C: {q.optionC}</p>
                       <p className={q.correctAnswer === 'D' ? 'text-green-600 font-bold' : ''}>D: {q.optionD}</p>
                    </div>
                    <div className="mt-3 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(q)} className="text-blue-600 font-bold text-[10px] uppercase hover:underline">Sửa</button>
                      <button onClick={() => handleDelete(q.id)} className="text-red-600 font-bold text-[10px] uppercase hover:underline">Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form thêm/sửa */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 h-fit sticky top-0">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
               <span className="w-5 h-5 rounded flex items-center justify-center text-primary-600">
                 {editingQ
                   ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                   : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                 }
               </span>
               {editingQ ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}
             </h3>
             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Nội dung câu hỏi</label>
                   <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} required rows={3}
                     className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                   {['A', 'B', 'C', 'D'].map(opt => (
                     <div key={opt}>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Đáp án {opt}</label>
                        <input value={form[`option${opt}`]} onChange={e => setForm({...form, [`option${opt}`]: e.target.value})} required
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500" />
                     </div>
                   ))}
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Đáp án đúng</label>
                   <select value={form.correctAnswer} onChange={e => setForm({...form, correctAnswer: e.target.value})}
                     className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500">
                      <option value="A">Câu A</option>
                      <option value="B">Câu B</option>
                      <option value="C">Câu C</option>
                      <option value="D">Câu D</option>
                   </select>
                </div>
                <div className="flex gap-2">
                   {editingQ && <button type="button" onClick={handleCancelEdit} className="flex-1 py-2 text-sm font-bold text-slate-500">Hủy</button>}
                   <button type="submit" disabled={saving} className="flex-1 bg-primary-600 text-white py-2 rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors">
                     {saving ? 'Đang lưu...' : editingQ ? 'Cập nhật' : 'Thêm mới'}
                   </button>
                </div>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Modal Xác nhận Xóa ──
const DeleteConfirmModal = ({ lesson, onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2">Xác nhận Xóa?</h3>
      <p className="text-slate-500 mb-6 text-sm">Bài giảng <strong>"{lesson?.title}"</strong> sẽ bị xóa vĩnh viễn.</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 border border-slate-300 py-2.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-colors">Hủy</button>
        <button onClick={onConfirm} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-bold transition-colors">Xóa bài giảng</button>
      </div>
    </div>
  </div>
);

// ── Trang Chính ──
const AdminLessonsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!role || !role.toLowerCase().includes('admin')) { navigate('/'); return; }
    loadData();
  }, [courseId, navigate]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/courses/${courseId}`);
      setCourse(res.data);
      // Sort by lessonOrder
      const sorted = [...(res.data.lessons || [])].sort((a, b) => (a.lessonOrder || 0) - (b.lessonOrder || 0));
      setLessons(sorted);
    } catch {
      navigate('/admin/courses');
    } finally {
      setLoading(false);
    }
  }, [courseId, navigate]);

  const handleDelete = async (lesson) => {
    try {
      await api.delete(`/lessons/${lesson.id}`);
      setModal(null);
      loadData();
    } catch {
      alert('Lỗi khi xóa bài giảng!');
    }
  };

  return (
    <AdminLayout>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Quản lý Bài Giảng</h1>
            <p className="text-slate-500 mt-0.5">{lessons.length} bài giảng trong khóa học</p>
          </div>
          <button
            onClick={() => setModal({ type: 'create' })}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Thêm Bài giảng
          </button>
        </div>

        {/* Course Info Card */}
        {course && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-6 flex gap-4 items-center">
            <img src={course.thumbnailUrl} alt={course.title}
              className="w-20 h-14 object-cover rounded-xl flex-shrink-0 bg-slate-100"
              onError={e => e.target.src = 'https://via.placeholder.com/80x56?text=No+Img'} />
            <div className="flex-1 min-w-0">
              <h2 className="font-black text-slate-900 text-lg leading-snug truncate">{course.title}</h2>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-xs bg-primary-50 text-primary-700 font-semibold px-2.5 py-0.5 rounded-full">{course.categoryName}</span>
                <span className="text-sm text-slate-500 font-medium">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Lessons List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 w-16 text-center">STT</th>
                  <th className="px-6 py-4">Tiêu đề</th>
                  <th className="px-6 py-4">Video</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">Đang tải...</td></tr>
                ) : lessons.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <p className="text-slate-400 font-medium">Khóa học này chưa có bài giảng nào.</p>
                      <p className="text-slate-400 text-sm mt-1">Bấm "Thêm Bài giảng" để bắt đầu.</p>
                    </td>
                  </tr>
                ) : (
                  lessons.map((lesson, index) => (
                    <tr key={lesson.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-center">
                        <span className="w-8 h-8 bg-slate-100 text-slate-600 font-bold text-xs rounded-full flex items-center justify-center mx-auto">
                          {lesson.lessonOrder ?? index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{lesson.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        {lesson.videoUrl ? (
                          <a href={lesson.videoUrl} target="_blank" rel="noreferrer"
                            className="text-xs text-primary-600 hover:underline font-medium flex items-center gap-1 max-w-[180px] truncate">
                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                            {lesson.videoUrl.length > 30 ? lesson.videoUrl.slice(0, 30) + '...' : lesson.videoUrl}
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Chưa có video</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                           <button
                            onClick={() => setModal({ type: 'quiz', lesson })}
                            className="px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-bold text-xs rounded-lg transition-colors border border-yellow-100"
                          >
                            Quản lý Quiz
                          </button>
                          <button
                            onClick={() => setModal({ type: 'edit', lesson })}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg transition-colors"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => setModal({ type: 'delete', lesson })}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs rounded-lg transition-colors"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      {/* Modals */}
      {(modal?.type === 'create' || modal?.type === 'edit') && (
        <LessonModal
          mode={modal.type}
          lesson={modal.lesson}
          courseId={courseId}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); loadData(); }}
        />
      )}
      {modal?.type === 'delete' && (
        <DeleteConfirmModal
          lesson={modal.lesson}
          onClose={() => setModal(null)}
          onConfirm={() => handleDelete(modal.lesson)}
        />
      )}
      {modal?.type === 'quiz' && (
        <QuizModal
          lesson={modal.lesson}
          onClose={() => setModal(null)}
        />
      )}
    </AdminLayout>
  );
};

export default AdminLessonsPage;
