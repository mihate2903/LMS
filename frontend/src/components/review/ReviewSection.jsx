import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const ReviewSection = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reviews/course/${courseId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Lỗi lấy đánh giá:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post(`/reviews/course/${courseId}`, { rating, content });
      setContent('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.error || "Không thể gửi đánh giá.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const renderStars = (count, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(s)}
            className={`${interactive ? 'cursor-pointer transform hover:scale-110' : 'cursor-default'} transition-all`}
          >
            <svg
              className={`w-5 h-5 ${s <= (interactive ? rating : count) ? 'text-yellow-400 fill-current' : 'text-slate-200'}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
        <svg className="w-7 h-7 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        Đánh giá khóa học
      </h2>

      {/* Form Đánh giá */}
      <form onSubmit={handleSubmit} className="mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <p className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Chia sẻ trải nghiệm của bạn</p>
        <div className="mb-4">
          {renderStars(5, true)}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          required
          rows="3"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
          placeholder="Bạn thấy khóa học này thế nào? (Nhấn Enter để gửi)..."
        ></textarea>
        {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-4 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
      </form>

      {/* Danh sách Đánh giá */}
      <div className="space-y-6">
        {loading ? (
          <div className="py-10 text-center text-slate-400">Đang tải đánh giá...</div>
        ) : reviews.length === 0 ? (
          <div className="py-10 text-center text-slate-400 italic">Chưa có đánh giá nào cho khóa học này.</div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="flex flex-col gap-2 border-b border-slate-100 pb-6 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-200 overflow-hidden shadow-sm">
                  {rev.userAvatar ? (
                    <img src={rev.userAvatar} alt={rev.userName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold text-xs">
                      {rev.userName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <h4 className="font-bold text-slate-900 text-sm">{rev.userName}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
              <div className="ml-12">
                <div className="mb-2">{renderStars(rev.rating)}</div>
                <p className="text-slate-600 text-sm leading-relaxed">{rev.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
