import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { DocumentProcessingState } from '../../types';

interface DocumentUploadCardProps {
  onUploadSuccess: () => void;
}

export const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<DocumentProcessingState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    // Validation
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'txt') {
      setErrorMessage('Unsupported format. Please upload a PDF or TXT document.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 25 MB limit.');
      return;
    }

    setErrorMessage(null);
    setCurrentFileName(file.name);
    setUploadStatus('Uploading');

    // Simulate genuine progression through pipeline states for UI feedback
    const timer1 = setTimeout(() => setUploadStatus('Extracting text'), 400);
    const timer2 = setTimeout(() => setUploadStatus('Chunking'), 900);
    const timer3 = setTimeout(() => setUploadStatus('Indexing'), 1400);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed with status ${response.status}`);
      }

      setUploadStatus('Ready');
      setTimeout(() => {
        setUploadStatus(null);
        setCurrentFileName(null);
        onUploadSuccess();
      }, 1200);
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setUploadStatus('Failed');
      setErrorMessage(err.message || 'An unexpected error occurred during processing.');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploadStatus && fileInputRef.current?.click()}
        className={`relative p-5 sm:p-6 rounded-2xl border-2 border-dashed transition-all duration-300 text-center cursor-pointer ${
          isDragging
            ? 'border-[#00D9FF] bg-[#00D9FF]/10 shadow-[0_0_20px_rgba(0,217,255,0.2)]'
            : 'border-white/15 hover:border-[#00D9FF]/40 bg-[#0A0A0D] hover:bg-[#101116]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={uploadStatus !== null && uploadStatus !== 'Failed'}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#101116] to-[#171820] border border-white/10 flex items-center justify-center text-[#00D9FF] shadow-inner">
            {uploadStatus && uploadStatus !== 'Ready' && uploadStatus !== 'Failed' ? (
              <Loader2 className="w-6 h-6 animate-spin text-[#00D9FF]" />
            ) : uploadStatus === 'Ready' ? (
              <CheckCircle2 className="w-6 h-6 text-[#25D9A0]" />
            ) : uploadStatus === 'Failed' ? (
              <AlertCircle className="w-6 h-6 text-[#FF647C]" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white font-heading">
              {uploadStatus ? (
                <span className="flex items-center justify-center gap-2">
                  <span>{currentFileName}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-[#00D9FF]">
                    {uploadStatus}
                  </span>
                </span>
              ) : (
                'Bring Your Knowledge In'
              )}
            </h4>
            <p className="text-xs text-[#7C8090] mt-1">
              {uploadStatus
                ? 'Preparing passages and calculating vector index...'
                : 'Drag & drop your PDF or TXT file here, or click to browse (up to 25 MB)'}
            </p>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-[#FF647C]/10 border border-[#FF647C]/30 text-xs text-[#FF647C] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setErrorMessage(null);
                setUploadStatus(null);
              }}
              className="text-xs font-mono underline hover:text-white ml-2"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
