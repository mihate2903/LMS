import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';

const CommentItem = ({ comment, onReply }) => {
  return (
    <div className="flex flex-col gap-2 group">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-200 overflow-hidden shadow-sm">
          {comment.userAvatar ? (
            <img src={comment.userAvatar} alt={comment.userName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold text-xs">
              {comment.userName?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 flex justify-between items-center">
          <h4 className="font-bold text-slate-900 text-sm">{comment.userName}</h4>
          <span className="text-[10px] text-slate-400 font-medium">
            {new Date(comment.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
          </span>
        </div>
      </div>
      
      <div className="ml-12">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 group-hover:border-primary-200 transition-colors shadow-sm">
          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
        </div>
        
        <div className="mt-2 flex gap-4">
          <button 
            onClick={() => onReply(comment)}
            className="text-[11px] font-bold text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-wider"
          >
            Trả lời
          </button>
        </div>

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 space-y-6 border-l-2 border-slate-100 pl-4">
            {comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const DiscussionSection = ({ lessonId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState(null); // { id, userName }
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    if (!lessonId) return;
    setLoading(true);
    try {
      const res = await api.get(`/lesson-comments/lesson/${lessonId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Lỗi lấy bình luận:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [lessonId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setSubmitting(true);
    try {
      await api.post(`/lesson-comments/lesson/${lessonId}`, {
        content: content,
        parentId: replyTo?.id || null
      });
      setContent('');
      setReplyTo(null);
      fetchComments();
    } catch (err) {
      alert(err.response?.data?.error || "Không thể gửi bình luận.");
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

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-12 border-t border-slate-100">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-primary-50 border border-primary-100 text-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 leading-tight">Thảo luận bài học</h3>
          <p className="text-slate-400 text-sm font-medium">Đặt câu hỏi hoặc chia sẻ cảm nghĩ của bạn</p>
        </div>
      </div>

      {/* Form Gửi Bình Luận */}
      <form onSubmit={handleSubmit} className="mb-12">
        {replyTo && (
          <div className="mb-2 flex items-center justify-between bg-primary-50 px-4 py-2 rounded-lg border border-primary-100">
            <span className="text-xs font-bold text-primary-700">Đang phản hồi {replyTo.userName}</span>
            <button type="button" onClick={() => setReplyTo(null)} className="text-primary-700 hover:text-primary-900">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}
        <div className="relative group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            required
            rows="3"
            className="w-full px-6 py-4 rounded-3xl border-2 border-slate-200 focus:border-primary-500 outline-none transition-all resize-none shadow-sm group-hover:shadow-md"
            placeholder="Nhập nội dung thảo luận (Nhấn Enter để gửi)..."
          ></textarea>
          <button
            type="submit"
            disabled={submitting}
            className="absolute bottom-4 right-4 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {submitting ? '...' : 'Gửi'}
          </button>
        </div>
      </form>

      {/* Danh sách Bình Luận */}
      <div className="space-y-8">
        {loading && comments.length === 0 ? (
          <div className="text-center py-10 text-slate-400">Đang tải thảo luận...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 text-slate-400 italic bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            Chưa có thảo luận nào. Hãy là người đầu tiên đặt câu hỏi!
          </div>
        ) : (
          comments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              onReply={(c) => {
                setReplyTo({ id: c.id, userName: c.userName });
                window.scrollTo({ top: document.querySelector('form').offsetTop - 200, behavior: 'smooth' });
              }} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DiscussionSection;
