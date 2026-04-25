import React, { useState, useRef } from 'react';
import api from '../../api/axiosConfig';

/**
 * ImageUpload component - Tái sử dụng cho mọi tính năng upload ảnh.
 * 
 * Props:
 *   currentUrl: string  - URL ảnh hiện tại (nếu đang edit)
 *   onUpload: (url) => void  - callback sau khi upload thành công
 *   label: string  - nhãn hiển thị (ví dụ: "Ảnh đại diện", "Ảnh thumbnail")
 *   shape: 'square' | 'circle'  - hình dạng preview (mặc định 'square')
 */
const ImageUpload = ({ currentUrl, onUpload, label = 'Ảnh', shape = 'square' }) => {
  const [preview, setPreview] = useState(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Chỉ chấp nhận file ảnh (JPG, PNG, WEBP, GIF).');
      return;
    }
    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File quá lớn. Tối đa 10MB.');
      return;
    }

    setError(null);
    setUploading(true);

    // Show local preview immediately for better UX
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrl = res.data.url;
      setPreview(uploadedUrl);
      onUpload(uploadedUrl);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload thất bại, thử lại.');
      setPreview(currentUrl || null); // revert preview on error
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const triggerInput = () => inputRef.current?.click();

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl';

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      )}

      <div
        onClick={triggerInput}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative cursor-pointer border-2 border-dashed transition-all ${
          dragOver
            ? 'border-primary-400 bg-primary-50'
            : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
        } ${shapeClass} overflow-hidden flex flex-col items-center justify-center`}
        style={{ minHeight: shape === 'circle' ? '120px' : '160px' }}
      >
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin" />
              <span className="text-xs text-slate-500 font-medium">Đang tải lên...</span>
            </div>
          </div>
        )}

        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className={`w-full h-full object-cover ${shapeClass}`}
              style={{ minHeight: shape === 'circle' ? '120px' : '160px', maxHeight: '240px' }}
            />
            {/* Overlay on hover */}
            <div className={`absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center ${shapeClass}`}>
              <div className="text-white text-center">
                <svg className="w-8 h-8 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs font-bold">Thay đổi ảnh</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <div className="w-12 h-12 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-center text-primary-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Kéo thả hoặc click để chọn ảnh</p>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP, GIF — tối đa 10MB</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
