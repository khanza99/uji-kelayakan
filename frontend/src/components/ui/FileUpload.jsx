import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function FileUpload({
  onFile,
  accept,
  label = 'Upload file',
  description = 'Drag & drop or click to browse',
  maxSize = 5 * 1024 * 1024, // 5 MB
  className = '',
}) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) onFile(acceptedFiles[0]);
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
        transition-all duration-200
        ${isDragActive
          ? 'border-primary-400 bg-primary-50 scale-[1.01]'
          : 'border-surface-200 hover:border-primary-300 hover:bg-primary-50/50 bg-surface-50'
        }
        ${className}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
          isDragActive ? 'bg-primary-100' : 'bg-white border border-surface-200'
        }`}>
          <svg className={`w-6 h-6 ${isDragActive ? 'text-primary-600' : 'text-surface-400'}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-surface-700">{label}</p>
          <p className="text-xs text-surface-400 mt-0.5">{description}</p>
        </div>
        {acceptedFiles.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success-50 border border-success-200">
            <svg className="w-3.5 h-3.5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-xs font-medium text-success-700 truncate max-w-[200px]">
              {acceptedFiles[0].name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
