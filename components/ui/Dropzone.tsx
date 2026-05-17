"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, File, X } from "lucide-react";

interface DropzoneProps {
  onFileAccepted: (file: File) => void;
  isUploading: boolean;
}

export function Dropzone({ onFileAccepted, isUploading }: DropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileAccepted(acceptedFiles[0]);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer
        ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-500'}
        ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-blue-400">
          <UploadCloud className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">
            {isDragActive ? "Drop your contract here" : "Drag & drop a contract"}
          </h3>
          <p className="text-slate-400 text-sm">
            Supported formats: PDF, DOCX, TXT
          </p>
        </div>
        <button 
          className="bg-slate-800 text-white border border-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-700 transition-colors mt-2 disabled:opacity-50"
          disabled={isUploading}
        >
          Browse Files
        </button>
      </div>
    </div>
  );
}
