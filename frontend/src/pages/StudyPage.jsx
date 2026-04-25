import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import DiscussionSection from '../components/review/DiscussionSection';

// Helper: Phát hiện link YouTube hay Video thường
const getYoutubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Helper: Xóa tiền tố "Bài X - " khỏi tiêu đề
const cleanLessonTitle = (title) => {
  if (!title) return '';
  return title.replace(/^Bài\s*\d+\s*[:-]?\s*/i, '');
};

const StudyPage = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [course, setCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const [progress, setProgress] = useState([]); // [{lessonId: 1, completed: true, score: 100}]

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonData, setLessonData] = useState(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [accessError, setAccessError] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({}); // {questionId: 'A'}
  const [quizResult, setQuizResult] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchProgress = useCallback(async () => {
    try {
      const res = await api.get(`/study/courses/${courseId}/progress`);
      setProgress(res.data);
    } catch (err) {
      console.error("Lỗi lấy tiến độ:", err);
    }
  }, [courseId]);

  // ===== Lấy Mục lục Khóa học =====
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    const fetchInitialData = async () => {
      try {
        const res = await api.get(`/courses/${courseId}`);
        setCourse(res.data);
        if (res.data.lessons && res.data.lessons.length > 0) {
          const queryLessonId = searchParams.get('lessonId');
          const targetLesson = queryLessonId 
            ? res.data.lessons.find(l => l.id === Number(queryLessonId)) 
            : null;
          setSelectedLesson(targetLesson || res.data.lessons[0]);
        }
        await fetchProgress();
      } catch {
        navigate('/my-courses');
      } finally {
        setCourseLoading(false);
      }
    };
    fetchInitialData();
  }, [courseId, navigate, fetchProgress, searchParams]);

  // ===== Tải nội dung bài học bảo mật & Quizz =====
  const fetchLessonContent = useCallback(async (lesson) => {
    if (!lesson) return;
    setLessonLoading(true);
    setAccessError(null);
    setLessonData(null);
    setQuestions([]);
    setUserAnswers({});
    setQuizResult(null);

    try {
      // 1. Lấy thông tin bài học (video)
      const lessonRes = await api.get(`/lessons/${lesson.id}`);
      setLessonData(lessonRes.data);

      // 2. Lấy câu hỏi trắc nghiệm (nếu có)
      const questionsRes = await api.get(`/study/lessons/${lesson.id}/questions`);
      setQuestions(questionsRes.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setAccessError(err.response.data?.message || 'Bạn chưa có quyền truy cập bài học này.');
      } else {
        setAccessError('Đã có lỗi xảy ra khi tải bài học.');
      }
    } finally {
      setLessonLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLessonContent(selectedLesson);
  }, [selectedLesson, fetchLessonContent]);

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
    setSidebarOpen(false);
  };

  const handleAnswerChange = (qId, option) => {
    setUserAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmitQuiz = async () => {
    if (Object.keys(userAnswers).length < questions.length) {
      alert("Vui lòng trả lời hết tất cả câu hỏi!");
      return;
    }

    setSubmittingQuiz(true);
    try {
      const res = await api.post(`/study/lessons/${selectedLesson.id}/submit-quiz`, userAnswers);
      setQuizResult(res.data);
      if (res.data.passed) {
        await fetchProgress();
      }
    } catch (err) {
      alert("Gửi bài thất bại, vui lòng thử lại.");
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleMarkComplete = async () => {
    try {
      await api.post(`/study/lessons/${selectedLesson.id}/complete`);
      await fetchProgress();
    } catch (err) {
      console.error("Lỗi đánh dấu hoàn thành:", err);
    }
  };

  // ===== RENDER VIDEO PLAYER & QUIZ =====
  const renderContent = () => {
    if (lessonLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-primary-500"></div>
          <p className="text-slate-500 text-sm">Đang tải...</p>
        </div>
      );
    }

    if (accessError) {
      return (
        <div className="flex flex-col items-center justify-center py-24 gap-6 text-center px-8 bg-white">
          <div className="w-24 h-24 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
            <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Nội dung Bị Khóa</h3>
            <p className="text-slate-500 leading-relaxed max-w-md">{accessError}</p>
          </div>
          <Link to="/my-courses" className="mt-2 inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors">
            Kiểm tra Trạng thái Khóa học →
          </Link>
        </div>
      );
    }

    if (!lessonData) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white text-slate-400">
          <svg className="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium">Chọn một bài học để bắt đầu</p>
        </div>
      );
    }

    const youtubeId = getYoutubeId(lessonData.videoUrl);
    const isCompleted = progress.find(p => p.lessonId === lessonData.id)?.completed;

    return (
      <div className="flex flex-col pb-20">
        {/* ── Video Player ── */}
        <div className="w-full bg-black shadow-lg" style={{ aspectRatio: '16/9' }}>
          {youtubeId ? (
            <iframe
              key={youtubeId}
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={lessonData.title}
            />
          ) : lessonData.videoUrl ? (
            <video
              key={lessonData.id}
              className="w-full h-full"
              controls
              autoPlay
              src={lessonData.videoUrl}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-slate-400 bg-slate-900">
              <p className="font-medium">Bài học này chưa có video.</p>
            </div>
          )}
        </div>

          <div className="bg-white px-6 sm:px-10 py-8 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
             <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-primary-700 font-black bg-primary-50 px-3 py-1 rounded-lg border border-primary-100 whitespace-nowrap uppercase tracking-wider">Bài {(course?.lessons?.findIndex(l => l.id === selectedLesson.id) ?? -1) + 1 || selectedLesson.lessonOrder || '1'}</span>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">{cleanLessonTitle(lessonData.title)}</h2>
             </div>
             <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-slate-400 text-sm font-medium truncate max-w-[160px]">{course?.title}</span>
                {!questions.length && !isCompleted && (
                  <button 
                    onClick={handleMarkComplete}
                    className="flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-primary-600 text-white rounded-xl font-bold text-sm transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                    Hoàn thành
                  </button>
                )}
             </div>
          </div>
          
          {lessonData.content && (
            <div className="mt-8 p-6 bg-slate-50 rounded-2xl text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-100">
              {lessonData.content}
            </div>
          )}
        </div>

        {/* ── Quiz Section ── */}
        {questions.length > 0 && (
          <div className="max-w-4xl mx-auto w-full px-6 py-12">
            <div className="flex items-center gap-3 mb-10">
               <div className="w-10 h-10 bg-primary-50 border border-primary-100 text-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
               </div>
               <div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">Kiểm tra kiến thức</h3>
                  <p className="text-slate-400 text-sm font-medium">Cần đạt trên 50% để hoàn thành bài học</p>
               </div>
            </div>

            {quizResult && (
              <div className={`mb-10 p-6 rounded-2xl border ${quizResult.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${quizResult.passed ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {quizResult.score}%
                  </div>
                  <div>
                    <h4 className={`font-bold ${quizResult.passed ? 'text-green-800' : 'text-red-800'}`}>
                      {quizResult.passed ? 'Chúc mừng! Bạn đã hoàn thành.' : 'Rất tiếc! Bạn cần thử lại.'}
                    </h4>
                    <p className={`text-sm ${quizResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                      Tỉ lệ đáp án đúng: {quizResult.correctAnswers} / {quizResult.totalQuestions}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {questions.map((q, idx) => (
                <div key={q.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                   <p className="font-black text-slate-900 mb-6 text-lg"><span className="text-primary-500 mr-2">Câu {idx + 1}:</span> {q.content}</p>
                   <div className="grid grid-cols-1 gap-3">
                      {['A', 'B', 'C', 'D'].map(opt => (
                        <label 
                          key={opt}
                          className={`
                            relative flex items-center px-5 py-4 rounded-xl border-2 cursor-pointer transition-all
                            ${userAnswers[q.id] === opt 
                              ? 'bg-primary-50 border-primary-500 ring-4 ring-primary-50' 
                              : 'bg-white border-slate-100 hover:border-primary-200 hover:bg-slate-50'}
                          `}
                        >
                          <input 
                            type="radio" 
                            name={`q-${q.id}`} 
                            value={opt}
                            className="hidden"
                            onChange={() => handleAnswerChange(q.id, opt)}
                          />
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs mr-4 transition-colors ${userAnswers[q.id] === opt ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {opt}
                          </span>
                          <span className={`font-semibold ${userAnswers[q.id] === opt ? 'text-primary-900' : 'text-slate-700'}`}>
                            {q[`option${opt}`]}
                          </span>
                        </label>
                      ))}
                   </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
               <button 
                onClick={handleSubmitQuiz}
                disabled={submittingQuiz}
                className={`
                  px-10 py-4 rounded-2xl font-black text-white shadow-xl transition-all
                  ${submittingQuiz ? 'bg-slate-300' : 'bg-primary-600 hover:bg-primary-700 hover:-translate-y-1 shadow-primary-200'}
                `}
               >
                 {submittingQuiz ? 'Đang gửi bài...' : 'Nộp bài trắc nghiệm'}
               </button>
            </div>
          </div>
        )}

        <DiscussionSection lessonId={selectedLesson?.id} />
      </div>
    );
  };

  if (courseLoading) {
    return (
      <div className="flex-1 bg-white flex items-center justify-center" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-primary-500"></div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden bg-slate-50"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      {/* Container Chính */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* === AREA TRÁI: VIDEO & QUIZ === */}
        <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
          {renderContent()}
        </div>

        {/* === SIDEBAR PHẢI: MỤC LỤC === */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          fixed inset-y-0 right-0 z-30 transition-transform duration-300
          lg:relative lg:z-auto w-80 xl:w-96 bg-white border-l border-slate-200 flex flex-col shadow-2xl lg:shadow-none
        `}>
          {/* Header Sidebar */}
          <div className="px-6 py-6 border-b border-slate-100 flex-shrink-0 bg-white">
            <div className="flex justify-end mb-4">
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-300 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <h3 className="text-slate-900 font-black text-lg leading-tight">{course?.title}</h3>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-500 transition-all duration-1000 shadow-sm"
                  style={{ width: `${(progress.filter(p => p.completed).length / (course?.lessons?.length || 1) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                {progress.filter(p => p.completed).length} / {course?.lessons?.length || 0} HOÀN THÀNH
              </span>
            </div>
          </div>

          {/* List bài học */}
          <div className="flex-1 overflow-y-auto px-2 py-4">
            <ul className="space-y-1">
              {course?.lessons?.map((lesson, index) => {
                const isActive = selectedLesson?.id === lesson.id;
                const isCompleted = progress.find(p => p.lessonId === lesson.id)?.completed;
                
                return (
                  <li key={lesson.id}>
                    <button
                      onClick={() => handleSelectLesson(lesson)}
                      className={`
                        w-full text-left p-4 flex items-start gap-4 rounded-2xl transition-all group relative
                        ${isActive ? 'bg-primary-50 shadow-sm' : 'hover:bg-slate-50'}
                      `}
                    >
                      {/* Trạng thái Icon */}
                      <div className={`
                        flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all
                        ${isCompleted 
                          ? 'bg-green-500 text-white shadow-lg shadow-green-100' 
                          : isActive 
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-100' 
                            : 'bg-slate-100 text-slate-400'}
                      `}>
                        {isCompleted ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-xs font-black">{index + 1}</span>
                        )}
                      </div>

                      {/* Thông tin bài học */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold leading-tight line-clamp-2 ${isActive ? 'text-primary-900' : 'text-slate-700'}`}>
                          {cleanLessonTitle(lesson.title)}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                           <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-primary-500' : 'text-slate-400'}`}>
                             BÀI {index + 1}
                           </span>
                           {isCompleted && <span className="text-[10px] font-black text-green-600 uppercase">ĐÃ XONG</span>}
                        </div>
                      </div>
                      
                      {/* Active indicator */}
                      {isActive && <div className="absolute left-0 top-4 bottom-4 w-1 bg-primary-500 rounded-r-full" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Nút mở sidebar mobile */}
        <button 
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-dark text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:bg-primary-600 transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-20" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default StudyPage;
