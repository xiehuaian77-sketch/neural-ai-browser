import { useState, useRef } from 'react';
import { Upload, FileText, Image, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export interface UploadedFile {
  originalName: string;
  mimetype: string;
  size: number;
  text: string;
  metadata: {
    pageCount?: number;
    rowCount?: number;
    wordCount?: number;
    format: string;
  };
}

export interface FileUploadProps {
  onFilesParsed: (files: UploadedFile[]) => void;
  provider?: string;
  model?: string;
}

const ACCEPTED_TYPES = [
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/csv',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

const MAX_FILES = 5;
const MAX_SIZE_MB = 10;

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesParsed }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList) => {
    setError(null);
    const fileArray = Array.from(files);

    if (fileArray.length > MAX_FILES) {
      setError(`最多只能上传 ${MAX_FILES} 个文件`);
      return;
    }

    const invalid = fileArray.find((f) => !ACCEPTED_TYPES.includes(f.type) && !f.type.startsWith('text/'));
    if (invalid) {
      setError(`不支持的文件类型: ${invalid.type}`);
      return;
    }

    const tooLarge = fileArray.find((f) => f.size > MAX_SIZE_MB * 1024 * 1024);
    if (tooLarge) {
      setError(`文件过大，单文件最大 ${MAX_SIZE_MB}MB`);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      fileArray.forEach((file) => formData.append('files', file));

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || '上传失败');
      }

      const parsed: UploadedFile[] = data.files;
      setUploadedFiles((prev) => [...prev, ...parsed]);
      onFilesParsed(parsed);
    } catch (err: any) {
      setError(err?.message || '上传过程中发生错误');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files);
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (mimetype: string) => {
    if (mimetype === 'application/pdf') return <FileText className="w-5 h-5 text-rose-400" />;
    if (mimetype.startsWith('image/')) return <Image className="w-5 h-5 text-emerald-400" />;
    if (mimetype.includes('csv') || mimetype.includes('plain')) return <FileText className="w-5 h-5 text-sky-400" />;
    return <FileText className="w-5 h-5 text-slate-400" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition cursor-pointer ${
          isDragging
            ? 'border-sky-500 bg-sky-500/10'
            : 'border-slate-700 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-900/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleInputChange}
          className="hidden"
        />

        <Upload className={`w-8 h-8 mb-3 ${isDragging ? 'text-sky-400' : 'text-slate-500'}`} />
        <p className="text-sm text-slate-300 font-medium">
          {isDragging ? '释放文件以上传' : '点击或拖拽文件到此处'}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          支持 PDF、TXT、CSV、DOCX、图片，单文件最大 {MAX_SIZE_MB}MB，最多 {MAX_FILES} 个文件
        </p>

        {isUploading && (
          <div className="mt-3 flex items-center space-x-2 text-xs text-sky-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>正在解析文件...</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 flex items-center space-x-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-slate-400">已上传文件</p>
          {uploadedFiles.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2"
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                {getFileIcon(file.mimetype)}
                <div className="min-w-0">
                  <p className="truncate text-sm text-slate-200">{file.originalName}</p>
                  <p className="text-[11px] text-slate-500">
                    {formatSize(file.size)} · {file.metadata.format}
                    {file.metadata.wordCount ? ` · ${file.metadata.wordCount} 字` : ''}
                    {file.metadata.rowCount ? ` · ${file.metadata.rowCount} 行` : ''}
                    {file.metadata.pageCount ? ` · ${file.metadata.pageCount} 页` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  className="rounded p-1 text-slate-500 hover:text-rose-400 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
